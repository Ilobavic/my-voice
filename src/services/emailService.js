/**
 * Email Service
 * Handles email operations with SMTP integration capability
 */
class EmailService {
  constructor() {
    // SMTP Configuration (can be set via environment variables or user settings)
    this.smtpConfig = {
      host: import.meta.env.VITE_SMTP_HOST || "smtp.gmail.com",
      port: import.meta.env.VITE_SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: import.meta.env.VITE_SMTP_USER || "",
        pass: import.meta.env.VITE_SMTP_PASS || "",
      },
    };

    // Mock email storage (in real app, this would be API calls)
    this.emails = [
      {
        id: 1,
        from: "john.doe@example.com",
        to: "user@example.com",
        subject: "Welcome to Voice Email",
        body: "This is a sample email to demonstrate the voice-controlled email system. You can reply to this email or delete it. Try using voice commands to navigate!",
        date: new Date("2024-01-15T10:30:00"),
        read: false,
      },
      {
        id: 2,
        from: "support@example.com",
        to: "user@example.com",
        subject: "System Update",
        body: "Your account has been successfully updated. Thank you for using our service. If you have any questions, please don't hesitate to contact our support team.",
        date: new Date("2024-01-14T14:20:00"),
        read: false,
      },
      {
        id: 3,
        from: "newsletter@example.com",
        to: "user@example.com",
        subject: "Monthly Newsletter",
        body: "Check out our latest updates and features in this month's newsletter. We've added several new improvements including enhanced accessibility features.",
        date: new Date("2024-01-13T09:15:00"),
        read: true,
      },
      {
        id: 4,
        from: "events@example.com",
        to: "user@example.com",
        subject: "Upcoming Webinar: Accessibility Best Practices",
        body: "You're invited to our upcoming webinar on accessibility best practices. Join us on January 20th at 2 PM EST. Register now to secure your spot!",
        date: new Date("2024-01-12T11:00:00"),
        read: false,
      },
      {
        id: 5,
        from: "team@example.com",
        to: "user@example.com",
        subject: "Project Update",
        body: "The team is making great progress on the new features. We've completed the voice input module and are now working on improving the command recognition accuracy.",
        date: new Date("2024-01-11T16:45:00"),
        read: true,
      },
      {
        id: 6,
        from: "admin@example.com",
        to: "user@example.com",
        subject: "Important: Password Reset Required",
        body: "For security reasons, we require you to reset your password. Please follow the link below to complete this important security step.",
        date: new Date("2024-01-10T08:30:00"),
        read: false,
      },
    ];
  }

  async getEmails() {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.emails].sort((a, b) => b.date - a.date));
      }, 300);
    });
  }

  async getEmail(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = this.emails.find((e) => e.id === parseInt(id));
        if (email) {
          email.read = true;
        }
        resolve(email);
      }, 200);
    });
  }

  async sendEmail(emailData) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!emailData.to || !emailData.subject || !emailData.body) {
          reject(new Error("Missing required fields"));
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailData.to)) {
          reject(new Error("Invalid email address format"));
          return;
        }

        // If SMTP is configured, send via SMTP
        if (this.smtpConfig.auth.user && this.smtpConfig.auth.pass) {
          await this.sendViaSMTP(emailData);
        }

        const newEmail = {
          id: Date.now(),
          from: this.smtpConfig.auth.user || "user@example.com",
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          date: new Date(),
          read: true,
        };

        // In production, this would be handled by backend
        console.log("Email sent:", newEmail);
        resolve(newEmail);
      } catch (error) {
        reject(error);
      }
    });
  }

  async sendViaSMTP(emailData) {
    // This would typically be done via a backend API endpoint
    // For security reasons, SMTP credentials should never be exposed in frontend
    // This is a placeholder that shows the structure

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        replyTo: emailData.replyTo,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email via SMTP");
    }

    return response.json();
  }

  async replyToEmail(emailId, replyBody) {
    return new Promise(async (resolve, reject) => {
      try {
        const originalEmail = this.emails.find(
          (e) => e.id === parseInt(emailId),
        );
        if (!originalEmail) {
          reject(new Error("Original email not found"));
          return;
        }

        const replyData = {
          to: originalEmail.from,
          subject: originalEmail.subject.startsWith("Re:")
            ? originalEmail.subject
            : `Re: ${originalEmail.subject}`,
          body: replyBody,
          replyTo: originalEmail.id,
        };

        const sentEmail = await this.sendEmail(replyData);
        resolve(sentEmail);
      } catch (error) {
        reject(error);
      }
    });
  }

  async markAsRead(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = this.emails.find((e) => e.id === parseInt(id));
        if (email) {
          email.read = true;
        }
        resolve(email);
      }, 200);
    });
  }

  async markAsUnread(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = this.emails.find((e) => e.id === parseInt(id));
        if (email) {
          email.read = false;
        }
        resolve(email);
      }, 200);
    });
  }

  async deleteEmail(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.emails = this.emails.filter((e) => e.id !== parseInt(id));
        resolve(true);
      }, 200);
    });
  }

  async searchEmails(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const results = this.emails.filter(
          (email) =>
            email.subject.toLowerCase().includes(lowerQuery) ||
            email.body.toLowerCase().includes(lowerQuery) ||
            email.from.toLowerCase().includes(lowerQuery) ||
            email.to.toLowerCase().includes(lowerQuery),
        );
        resolve(results.sort((a, b) => b.date - a.date));
      }, 200);
    });
  }

  async filterEmails(filterType) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.emails];

        switch (filterType) {
          case "unread":
            filtered = filtered.filter((e) => !e.read);
            break;
          case "read":
            filtered = filtered.filter((e) => e.read);
            break;
          case "today":
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            filtered = filtered.filter((e) => new Date(e.date) >= today);
            break;
          case "this-week":
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filtered = filtered.filter((e) => new Date(e.date) >= weekAgo);
            break;
          default:
            break;
        }

        resolve(filtered.sort((a, b) => b.date - a.date));
      }, 200);
    });
  }

  setSMTPConfig(config) {
    this.smtpConfig = { ...this.smtpConfig, ...config };
    localStorage.setItem("smtp_config", JSON.stringify(this.smtpConfig));
  }

  getSMTPConfig() {
    const stored = localStorage.getItem("smtp_config");
    if (stored) {
      this.smtpConfig = { ...this.smtpConfig, ...JSON.parse(stored) };
    }
    return this.smtpConfig;
  }
}

export default new EmailService();
