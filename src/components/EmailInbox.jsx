import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import emailService from "../services/emailService";
import textToSpeech from "../services/textToSpeech";
import voiceRecognition from "../services/voiceRecognition";

function EmailInbox({ onSelectEmail, onCompose, onReply, ref }) {
  const inboxRef = ref || useRef(null);
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read', 'today', 'this-week'
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    loadEmails();

    // Listen for voice search commands
    voiceRecognition.onResult((result) => {
      if (result.final && searchMode) {
        handleSearch(result.final);
        setSearchMode(false);
        voiceRecognition.stop();
      }
    });
  }, [searchMode]);

  useEffect(() => {
    applyFilters();
  }, [emails, filter, searchQuery]);

  const loadEmails = async () => {
    try {
      setLoading(true);
      let emailList;

      if (filter !== "all") {
        emailList = await emailService.filterEmails(filter);
      } else {
        emailList = await emailService.getEmails();
      }

      setEmails(emailList);
      setError(null);

      // Announce inbox loaded
      textToSpeech.speak(`Inbox loaded. You have ${emailList.length} emails.`);
    } catch (err) {
      setError("Failed to load emails");
      textToSpeech.speak("Failed to load emails");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...emails];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query) ||
          email.from.toLowerCase().includes(query),
      );
    }

    setFilteredEmails(filtered);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchQuery("");
      await loadEmails();
      return;
    }

    setSearchQuery(query);
    try {
      const results = await emailService.searchEmails(query);
      setEmails(results);
      textToSpeech.speak(`Found ${results.length} emails matching your search`);
    } catch (err) {
      setError("Search failed");
      textToSpeech.speak("Search failed");
    }
  };

  const handleNextEmail = () => {
    if (filteredEmails.length === 0) {
      textToSpeech.speak("No emails available");
      return;
    }

    const nextIndex =
      currentIndex < filteredEmails.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    const email = filteredEmails[nextIndex];
    handleEmailClick(email);
  };

  const handlePreviousEmail = () => {
    if (filteredEmails.length === 0) {
      textToSpeech.speak("No emails available");
      return;
    }

    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : filteredEmails.length - 1;
    setCurrentIndex(prevIndex);
    const email = filteredEmails[prevIndex];
    handleEmailClick(email);
  };

  const handleMarkAsRead = async (emailId) => {
    try {
      await emailService.markAsRead(emailId);
      await loadEmails();
      textToSpeech.speak("Email marked as read");
    } catch (err) {
      textToSpeech.speak("Failed to mark email as read");
    }
  };

  const handleMarkAsUnread = async (emailId) => {
    try {
      await emailService.markAsUnread(emailId);
      await loadEmails();
      textToSpeech.speak("Email marked as unread");
    } catch (err) {
      textToSpeech.speak("Failed to mark email as unread");
    }
  };

  const handleEmailClick = (email) => {
    const index = filteredEmails.findIndex((e) => e.id === email.id);
    setCurrentIndex(index);
    setSelectedId(email.id);
    if (onSelectEmail) {
      onSelectEmail(email);
    }
    textToSpeech.speak(
      `Email ${index + 1} of ${filteredEmails.length}. From ${
        email.from
      }. Subject: ${email.subject}`,
    );
  };

  const handleDelete = async (emailId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this email?")) {
      try {
        await emailService.deleteEmail(emailId);
        await loadEmails();
        textToSpeech.speak("Email deleted");
      } catch (err) {
        setError("Failed to delete email");
        textToSpeech.speak("Failed to delete email");
      }
    }
  };

  if (loading) {
    return (
      <div className="email-inbox" role="status" aria-live="polite">
        <p>Loading emails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="email-inbox" role="alert">
        <p>{error}</p>
        <button onClick={loadEmails}>Retry</button>
      </div>
    );
  }

  return (
    <div className="email-inbox" role="main" aria-label="Email Inbox">
      <div className="inbox-header">
        <h1>Inbox</h1>
        <div className="header-actions">
          <button
            className="compose-button"
            onClick={onCompose}
            aria-label="Compose new email"
          >
            + Compose
          </button>
        </div>
      </div>

      <div className="inbox-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search emails"
          />
          <button
            onClick={() => {
              setSearchMode(true);
              voiceRecognition.start();
              textToSpeech.speak("Please speak your search query");
            }}
            aria-label="Voice search"
          >
            🎤
          </button>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => {
              setFilter("all");
              loadEmails();
            }}
            aria-label="Show all emails"
          >
            All
          </button>
          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => {
              setFilter("unread");
              loadEmails();
            }}
            aria-label="Show unread emails"
          >
            Unread
          </button>
          <button
            className={filter === "read" ? "active" : ""}
            onClick={() => {
              setFilter("read");
              loadEmails();
            }}
            aria-label="Show read emails"
          >
            Read
          </button>
          <button
            className={filter === "today" ? "active" : ""}
            onClick={() => {
              setFilter("today");
              loadEmails();
            }}
            aria-label="Show today's emails"
          >
            Today
          </button>
        </div>

        <div className="navigation-buttons">
          <button
            onClick={handlePreviousEmail}
            aria-label="Previous email"
            disabled={filteredEmails.length === 0}
          >
            ← Previous
          </button>
          <button
            onClick={handleNextEmail}
            aria-label="Next email"
            disabled={filteredEmails.length === 0}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="email-list" role="list" aria-label="Email list">
        {emails.length === 0 ? (
          <p className="empty-state">No emails found</p>
        ) : (
          emails.map((email) => (
            <div
              key={email.id}
              className={`email-item ${
                selectedId === email.id ? "selected" : ""
              } ${!email.read ? "unread" : ""}`}
              role="listitem"
              tabIndex={0}
              onClick={() => handleEmailClick(email)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleEmailClick(email);
                }
              }}
              aria-label={`Email from ${email.from}, subject: ${
                email.subject
              }, ${email.read ? "read" : "unread"}`}
            >
              <div className="email-item-header">
                <span className="email-from" aria-label={`From: ${email.from}`}>
                  {email.from}
                </span>
                <span
                  className="email-date"
                  aria-label={`Date: ${email.date.toLocaleDateString()}`}
                >
                  {email.date.toLocaleDateString()}
                </span>
              </div>
              <div
                className="email-subject"
                aria-label={`Subject: ${email.subject}`}
              >
                {!email.read && (
                  <span className="unread-indicator" aria-label="Unread"></span>
                )}
                {email.subject}
              </div>
              <div
                className="email-preview"
                aria-label={`Preview: ${email.body.substring(0, 100)}`}
              >
                {email.body.substring(0, 100)}...
              </div>
              <div className="email-actions">
                {onReply && (
                  <button
                    className="reply-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReply(email);
                    }}
                    aria-label={`Reply to email from ${email.from}`}
                  >
                    Reply
                  </button>
                )}
                <button
                  className="mark-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (email.read) {
                      handleMarkAsUnread(email.id);
                    } else {
                      handleMarkAsRead(email.id);
                    }
                  }}
                  aria-label={email.read ? "Mark as unread" : "Mark as read"}
                >
                  {email.read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  className="delete-button"
                  onClick={(e) => handleDelete(email.id, e)}
                  aria-label={`Delete email from ${email.from}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmailInbox;
