import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInAnonymously, loading } = useAuth();

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        Alert.alert('Success', 'Account created successfully!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Authentication failed');
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in anonymously');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChatGPT Clone</Text>
      <Text style={styles.subtitle}>
        {isSignUp ? 'Create Account' : 'Sign In'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.switchText}>
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={styles.anonymousButton}
        onPress={handleAnonymousSignIn}
        disabled={loading}
      >
        <Text style={styles.anonymousButtonText}>
          Continue as Guest
        </Text>
      </TouchableOpacity>

      <Text style={styles.demoText}>
        🔥 Firebase Integration Active{'\n'}
        📱 Demo Mode - No API Required
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  anonymousButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  anonymousButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  demoText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default LoginScreen;
