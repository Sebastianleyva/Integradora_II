import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import LoginScreen from './src/screens/login_screen';
import HomeScreen from './src/screens/home_screen';
import SignupScreen from './src/screens/signup_screen';

type Screen = 'login' | 'home' | 'signup';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToHome={() => setCurrentScreen('home')}
            onNavigateToSignup={() => setCurrentScreen('signup')}
          />
        );
      case 'home':
        return (
          <HomeScreen onLogout={() => setCurrentScreen('login')} />
        );
      case 'signup':
        return (
          <SignupScreen
            onNavigateToHome={() => setCurrentScreen('home')}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );
    }
  };

  return (
    <>
      {renderScreen()}
      <StatusBar style="auto" />
    </>
  );
}
