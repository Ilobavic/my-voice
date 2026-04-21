/**
 * Authentication Service
 * Handles user authentication with voice-guided login
 */
class AuthService {
  constructor() {
    // Mock user storage (in production, this would be API calls)
    this.users = [
      {
        id: 1,
        email: "demo@example.com",
        password: "demo123",
        name: "Demo User",
      },
      {
        id: 2,
        email: "test@example.com",
        password: "test123",
        name: "Test User",
      },
    ]; // Demo users for testing

    this.currentUser = null;
    this.loadSession();
  }

  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find((u) => u.email === email);

        if (!user) {
          reject(new Error("User not found"));
          return;
        }

        if (user.password !== password) {
          reject(new Error("Invalid password"));
          return;
        }

        this.currentUser = { ...user };
        delete this.currentUser.password; // Don't store password in session
        this.saveSession();
        resolve(this.currentUser);
      }, 500);
    });
  }

  async voiceGuidedLogin(voiceEmail, voicePassword) {
    return new Promise((resolve, reject) => {
      // Extract email from voice input
      const emailMatch = voiceEmail.match(/[\w\.-]+@[\w\.-]+\.\w+/);
      if (!emailMatch) {
        reject(
          new Error("Could not recognize email address. Please try again."),
        );
        return;
      }

      const email = emailMatch[0];
      // For password, we'll use the spoken text (in production, use secure voice auth)
      const password = voicePassword.trim().toLowerCase();

      this.login(email, password).then(resolve).catch(reject);
    });
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("user_session");
    localStorage.removeItem("auth_token");
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  saveSession() {
    if (this.currentUser) {
      localStorage.setItem("user_session", JSON.stringify(this.currentUser));
      // In production, store secure token instead
      localStorage.setItem("auth_token", "mock_token_" + Date.now());
    }
  }

  loadSession() {
    const session = localStorage.getItem("user_session");
    const token = localStorage.getItem("auth_token");

    if (session && token) {
      try {
        this.currentUser = JSON.parse(session);
      } catch (e) {
        this.logout();
      }
    }
  }

  async register(email, password, name) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.users.find((u) => u.email === email)) {
          reject(new Error("User already exists"));
          return;
        }

        const newUser = {
          id: Date.now(),
          email,
          password, // In production, hash this
          name,
        };

        this.users.push(newUser);
        resolve({ id: newUser.id, email: newUser.email, name: newUser.name });
      }, 500);
    });
  }
}

export default new AuthService();
