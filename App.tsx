import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import LoginScreen from './frontend/src/screens/login_screen';
import SignupScreen from './frontend/src/screens/signup_screen';
import GeneralSurvey from './frontend/src/screens/general_survey';
import { HomeTabNavigator } from './frontend/src/navigation/navigation';

type Screen = 'login' | 'home' | 'signup' | 'survey';

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
          <HomeTabNavigator onLogout={() => setCurrentScreen('login')} />
        );
      case 'signup':
        return (
          <SignupScreen
            onNavigateToHome={() => setCurrentScreen('survey')}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );
      case 'survey':
        return (
          <GeneralSurvey
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
