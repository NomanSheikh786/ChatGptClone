import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View } from 'react-native';
// FIREBASE COMMENTED OUT - Frontend only mode
// import { AuthProvider, useAuth } from './src/context/AuthContext';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';
// import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Chat"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ title: 'ChatGPT Clone - Frontend Demo' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default App;
