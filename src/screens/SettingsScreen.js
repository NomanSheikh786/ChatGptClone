import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const [apiKey, setApiKey] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const { user, signOut } = useAuth();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedApiKey = await AsyncStorage.getItem('apiKey');
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveApiKey = async () => {
    try {
      await AsyncStorage.setItem('apiKey', apiKey);
      Alert.alert('Success', 'API key saved successfully!');
    } catch (error) {
      console.error('Error saving API key:', error);
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const saveTheme = async (value) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const clearChatHistory = async () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('chatMessages');
              Alert.alert('Success', 'Chat history cleared successfully!');
            } catch (error) {
              console.error('Error clearing chat history:', error);
              Alert.alert('Error', 'Failed to clear chat history');
            }
          },
        },
      ]
    );
  };

  const resetSettings = async () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['apiKey', 'isDarkMode']);
              setApiKey('');
              setIsDarkMode(true);
              Alert.alert('Success', 'Settings reset successfully!');
            } catch (error) {
              console.error('Error resetting settings:', error);
              Alert.alert('Error', 'Failed to reset settings');
            }
          },
        },
      ]
    );
  };

  // FIREBASE COMMENTED OUT - Frontend only mode
  /*
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out.');
            }
          },
        },
      ]
    );
  };
  */

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        {/* <Text style={styles.sectionDescription}>
          Enter your OpenAI API key to enable AI responses. You can get one from
          <Text style={styles.link}>https://platform.openai.com/api-keys</Text>
        </Text> */}
        
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter your OpenAI API key"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TouchableOpacity style={styles.button} onPress={saveApiKey}>
          <Text style={styles.buttonText}>Save API Key</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={saveTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearChatHistory}>
          <Text style={styles.buttonText}>Clear Chat History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={resetSettings}>
          <Text style={styles.buttonText}>Reset All Settings</Text>
        </TouchableOpacity>
      </View>

      {/* FIREBASE COMMENTED OUT - Frontend only mode */}
      {/*
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {user && (
          <Text style={styles.userInfo}>
            Signed in as: {user.email || user.displayName || 'Guest User'}
          </Text>
        )}

        <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <Text style={styles.userInfo}>
          🚀 Frontend Demo Mode Active{'\n'}
          💬 Smart Demo Responses{'\n'}
          📱 No Backend Required
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          ChatGPT Clone v1.0.0{'\n'}
          Built with React Native{'\n'}
          Developer: Muhammad Noman{'\n'}
          Email: nomisheikh978@gmail.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 16,
    lineHeight: 20,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  signOutButton: {
    backgroundColor: '#FF9500',
  },
  userInfo: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
});

export default SettingsScreen;
