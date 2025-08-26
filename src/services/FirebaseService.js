import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FirebaseService {
  constructor() {
    this.isFirebaseEnabled = false; // Set to true when Firebase is configured
  }

  // Authentication methods
  async signInAnonymously() {
    if (!this.isFirebaseEnabled) {
      // Demo mode - create a mock user
      const mockUser = {
        uid: 'demo-user-' + Date.now(),
        email: 'demo@example.com',
        displayName: 'Demo User'
      };
      await AsyncStorage.setItem('currentUser', JSON.stringify(mockUser));
      return mockUser;
    }

    try {
      const userCredential = await auth().signInAnonymously();
      return userCredential.user;
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      throw error;
    }
  }

  async signInWithEmailAndPassword(email, password) {
    if (!this.isFirebaseEnabled) {
      // Demo mode
      const mockUser = {
        uid: 'demo-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      };
      await AsyncStorage.setItem('currentUser', JSON.stringify(mockUser));
      return mockUser;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  async createUserWithEmailAndPassword(email, password) {
    if (!this.isFirebaseEnabled) {
      // Demo mode
      const mockUser = {
        uid: 'demo-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      };
      await AsyncStorage.setItem('currentUser', JSON.stringify(mockUser));
      return mockUser;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  }

  async signOut() {
    if (!this.isFirebaseEnabled) {
      await AsyncStorage.removeItem('currentUser');
      return;
    }

    try {
      await auth().signOut();
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    if (!this.isFirebaseEnabled) {
      const userString = await AsyncStorage.getItem('currentUser');
      return userString ? JSON.parse(userString) : null;
    }

    return auth().currentUser;
  }

  // Chat/Firestore methods
  async saveMessage(userId, message) {
    if (!this.isFirebaseEnabled) {
      // Use AsyncStorage for demo mode
      const messages = await this.getMessages(userId);
      messages.push(message);
      await AsyncStorage.setItem(`messages_${userId}`, JSON.stringify(messages));
      return;
    }

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('messages')
        .add({
          ...message,
          timestamp: firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
      console.error('Save message error:', error);
      throw error;
    }
  }

  async getMessages(userId) {
    if (!this.isFirebaseEnabled) {
      // Use AsyncStorage for demo mode
      const messagesString = await AsyncStorage.getItem(`messages_${userId}`);
      return messagesString ? JSON.parse(messagesString) : [];
    }

    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Get messages error:', error);
      return [];
    }
  }

  async clearMessages(userId) {
    if (!this.isFirebaseEnabled) {
      await AsyncStorage.removeItem(`messages_${userId}`);
      return;
    }

    try {
      const batch = firestore().batch();
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('messages')
        .get();

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Clear messages error:', error);
      throw error;
    }
  }

  // Listen to real-time message updates
  subscribeToMessages(userId, callback) {
    if (!this.isFirebaseEnabled) {
      // For demo mode, just call callback with current messages
      this.getMessages(userId).then(callback);
      return () => {}; // Return empty unsubscribe function
    }

    return firestore()
      .collection('users')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        snapshot => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback(messages);
        },
        error => {
          console.error('Messages subscription error:', error);
        }
      );
  }
}

export default new FirebaseService();
