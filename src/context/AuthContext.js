import React, { createContext, useContext, useState, useEffect } from 'react';
import FirebaseService from '../services/FirebaseService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
 
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await FirebaseService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth state check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInAnonymously = async () => {
    try {
      setLoading(true);
      const user = await FirebaseService.signInAnonymously();
      setUser(user);
      return user;
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const user = await FirebaseService.signInWithEmailAndPassword(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const user = await FirebaseService.createUserWithEmailAndPassword(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await FirebaseService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInAnonymously,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
