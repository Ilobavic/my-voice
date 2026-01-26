import { useState, useEffect } from "react";
import authService from "../services/authService";
import textToSpeech from "../services/textToSpeech";
import voiceRecognition from "../services/voiceRecognition";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(null); // 'email' or 'password'
  const [step, setStep] = useState("email"); // 'email' or 'password'

  useEffect(() => {
    textToSpeech.speak(
      'Welcome to Voice Email System. Please log in. Say "Email" to enter your email address, or type it manually.'
    );

    voiceRecognition.onResult((result) => {
      if (result.final && voiceMode) {
        const text = result.final.trim().toLowerCase();

        if (voiceMode === "email") {
          // Extract email from voice input
          const emailMatch = result.final.match(/[\w\.-]+@[\w\.-]+\.\w+/);
          if (emailMatch) {
            setEmail(emailMatch[0]);
            textToSpeech.speak(
              `Email set to ${emailMatch[0]}. Now say "Password" to enter your password.`
            );
            setVoiceMode(null);
            voiceRecognition.stop();
            setStep("password");
          } else {
            textToSpeech.speak(
              "Could not recognize email address. Please try again or type it manually."
            );
          }
        } else if (voiceMode === "password") {
          setPassword(text);
          textToSpeech.speak("Password entered. Logging in...");
          setVoiceMode(null);
          voiceRecognition.stop();
          handleLogin();
        }
      }
    });

    voiceRecognition.onError((err) => {
      if (err.code === "no-speech" || err.code === "no-match") {
        textToSpeech.speak(
          "Could not recognize speech. Please try again or use manual input."
        );
      }
    });

    return () => {
      voiceRecognition.stop();
    };
  }, [voiceMode]);

  const handleVoiceInput = (field) => {
    if (voiceMode === field) {
      voiceRecognition.stop();
      setVoiceMode(null);
      textToSpeech.speak("Voice input stopped");
    } else {
      setVoiceMode(field);
      voiceRecognition.start();
      if (field === "email") {
        textToSpeech.speak("Please speak your email address clearly");
      } else {
        textToSpeech.speak("Please speak your password");
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      textToSpeech.speak("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await authService.login(email, password);
      textToSpeech.speak(
        `Welcome ${user.name || user.email}. Login successful.`
      );
      if (onLogin) {
        onLogin(user);
      }
    } catch (err) {
      setError(err.message);
      textToSpeech.speak(`Login failed. ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" role="main" aria-label="Login">
      <div className="login-box">
        <h1>Voice-Controlled Email System</h1>
        <h2>Login</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="form-group">
            <label htmlFor="email">
              Email:
              <button
                type="button"
                className="voice-input-button"
                onClick={() => handleVoiceInput("email")}
                aria-label="Use voice input for email"
              >
                {voiceMode === "email" ? "🛑 Stop" : "🎤 Voice"}
              </button>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-required="true"
              aria-label="Email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password:
              <button
                type="button"
                className="voice-input-button"
                onClick={() => handleVoiceInput("password")}
                aria-label="Use voice input for password"
              >
                {voiceMode === "password" ? "🛑 Stop" : "🎤 Voice"}
              </button>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              aria-required="true"
              aria-label="Password"
            />
          </div>

          {error && (
            <div className="error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
            aria-label="Login"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="voice-instructions">
          <p>
            <strong>Voice Commands:</strong>
          </p>
          <ul>
            <li>Say "Email" to enter email via voice</li>
            <li>Say "Password" to enter password via voice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
