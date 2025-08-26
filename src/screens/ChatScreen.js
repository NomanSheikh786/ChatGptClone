import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// FIREBASE COMMENTED OUT - Frontend only mode
// import { useAuth } from '../context/AuthContext';
// import FirebaseService from '../services/FirebaseService';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const flatListRef = useRef(null);
  // FIREBASE COMMENTED OUT - Frontend only mode
  // const { user } = useAuth();

  useEffect(() => {
    loadMessages();
    loadApiKey();
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const loadMessages = async () => {
    try {
      // FIREBASE COMMENTED OUT - Frontend only mode
      // if (user) {
      //   // Load messages from Firebase
      //   const firebaseMessages = await FirebaseService.getMessages(user.uid);
      //   setMessages(firebaseMessages);
      // } else {
        // Using AsyncStorage for frontend-only mode
        const savedMessages = await AsyncStorage.getItem('chatMessages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      // }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadApiKey = async () => {
    try {
      const key = await AsyncStorage.getItem('apiKey');
      if (key) {
        setApiKey(key);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const saveMessages = async (newMessages) => {
    try {
      // FIREBASE COMMENTED OUT - Frontend only mode
      // if (user) {
      //   // Save to Firebase - save only the latest message
      //   const latestMessage = newMessages[newMessages.length - 1];
      //   if (latestMessage) {
      //     await FirebaseService.saveMessage(user.uid, latestMessage);
      //   }
      // } else {
        // Using AsyncStorage for frontend-only mode
        await AsyncStorage.setItem('chatMessages', JSON.stringify(newMessages));
      // }
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const generateDemoResponse = async (message) => {
    const lowerMessage = message.toLowerCase();

    // Add realistic delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Smart demo responses based on message content
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your ChatGPT Clone assistant. How can I help you today? 👋";
    }

    if (lowerMessage.includes('how are you')) {
      return "I'm doing great! I'm a demo version of ChatGPT Clone running without a backend. What would you like to talk about?";
    }

    if (lowerMessage.includes('what') && lowerMessage.includes('your') && lowerMessage.includes('name')) {
      return "I'm ChatGPT Clone, a demo AI assistant built with React Native and Firebase! 🤖";
    }

    if (lowerMessage.includes('help')) {
      return "I'm here to help! You can ask me questions, have conversations, or just chat. This is a demo version with smart responses. 💬";
    }

    if (lowerMessage.includes('weather')) {
      return "I don't have access to real weather data in demo mode, but I hope you're having a great day! ☀️";
    }

    if (lowerMessage.includes('time')) {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()}. Is there anything else I can help you with? ⏰`;
    }

    if (lowerMessage.includes('firebase')) {
      return "Yes! This app is integrated with Firebase for authentication and data storage. Pretty cool, right? 🔥";
    }

    if (lowerMessage.includes('react native')) {
      return "This app is built with React Native! It's a great framework for cross-platform mobile development. 📱";
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm happy to help. Feel free to ask me anything else! 😊";
    }

    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! It was nice chatting with you. Come back anytime! 👋";
    }

    // Default intelligent responses
    const defaultResponses = [
      `That's an interesting point about "${message}". In demo mode, I can engage in basic conversation! 🤔`,
      `I understand you're asking about "${message}". This is a demo response with smart contextual replies! 💡`,
      `Thanks for sharing that! You said: "${message}". I'm running in demo mode with intelligent responses! 🎯`,
      `That's a great question! While I'm in demo mode, I try to give helpful responses about: "${message}" 🚀`,
      `I hear you talking about "${message}". This ChatGPT Clone is working perfectly with smart demo responses! ✨`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // BACKEND API COMMENTED OUT - Using demo responses instead
      /*
      const response = await fetch('http://10.0.2.2:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          apiKey: apiKey,
        }),
      });

      const data = await response.json();
      */

      // DEMO MODE: Generate intelligent demo responses
      const demoResponse = await generateDemoResponse(userMessage.text);

      const aiMessage = {
        id: Date.now() + 1,
        text: demoResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please check your connection and try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.aiMessageText
      ]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />
      
      {isLoading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.typingText}>AI is typing...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2c2c2c',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c2c2c',
    marginHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#2c2c2c',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#555',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginRight: 16,
  },
  settingsButtonText: {
    fontSize: 20,
  },
});

export default ChatScreen;
