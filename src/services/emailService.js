/**
 * Email Service
 * Handles email operations (mock implementation - can be connected to real API)
 */
class EmailService {
  constructor() {
    // Mock email storage (in real app, this would be API calls)
    this.emails = [
      {
        id: 1,
        from: 'john.doe@example.com',
        to: 'user@example.com',
        subject: 'Welcome to Voice Email',
        body: 'This is a sample email to demonstrate the voice-controlled email system.',
        date: new Date('2024-01-15T10:30:00'),
        read: false
      },
      {
        id: 2,
        from: 'support@example.com',
        to: 'user@example.com',
        subject: 'System Update',
        body: 'Your account has been successfully updated. Thank you for using our service.',
        date: new Date('2024-01-14T14:20:00'),
        read: false
      },
      {
        id: 3,
        from: 'newsletter@example.com',
        to: 'user@example.com',
        subject: 'Monthly Newsletter',
        body: 'Check out our latest updates and features in this month\'s newsletter.',
        date: new Date('2024-01-13T09:15:00'),
        read: true
      }
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
        const email = this.emails.find(e => e.id === parseInt(id));
        if (email) {
          email.read = true;
        }
        resolve(email);
      }, 200);
    });
  }

  async sendEmail(emailData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!emailData.to || !emailData.subject || !emailData.body) {
          reject(new Error('Missing required fields'));
          return;
        }

        const newEmail = {
          id: Date.now(),
          from: 'user@example.com',
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          date: new Date(),
          read: true
        };

        // In real app, this would send to server
        console.log('Email sent:', newEmail);
        resolve(newEmail);
      }, 500);
    });
  }

  async markAsRead(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = this.emails.find(e => e.id === parseInt(id));
        if (email) {
          email.read = true;
        }
        resolve(email);
      }, 200);
    });
  }

  async deleteEmail(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.emails = this.emails.filter(e => e.id !== parseInt(id));
        resolve(true);
      }, 200);
    });
  }
}

export default new EmailService();
