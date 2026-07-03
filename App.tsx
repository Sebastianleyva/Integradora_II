import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './frontend/src/screens/login_screen';
import SignupScreen from './frontend/src/screens/signup_screen';
import GeneralSurvey from './frontend/src/screens/general_survey';
import { HomeTabNavigator } from './frontend/src/navigation/navigation';
import RegistroSueno from './frontend/src/screens/registro_sueno';
import RegistroComida from './frontend/src/screens/registro_comida';
import TecnoRegistro from './frontend/src/screens/tecno_registro';
import ObjetivoScreen from './frontend/src/screens/objetivo_screen';

type Screen = 'login' | 'home' | 'signup' | 'survey' | 'registro_sueno' | 'registro_comida' | 'tecno_registro' | 'objetivo';

interface data {
  horasSueno: string;
  calidadSueno: number;
  numeroComidas: string;
  calidadComida: number;
  horasOcio: number;
  calidadConsumo: number;
  usoIa: boolean;
  usoIaEn: string;
  bienestar: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [encuesta, setEncuesta] = useState<data | null>(null)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToHome={() => setCurrentScreen('home')}
            onNavigateToSignup={() => setCurrentScreen('signup')}
            onNavigateToSurvey={() => setCurrentScreen('survey')}
          />
        );
      case 'home':
        return (
          <HomeTabNavigator
            onLogout={() => setCurrentScreen('login')}
            onNavigateToRegistroSueno={() => setCurrentScreen('registro_sueno')}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onNavigateToSurvey={() => setCurrentScreen('survey')}
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
      case 'registro_sueno':
        return (
          <RegistroSueno
            onNavigateToComida={(datos) => { setEncuesta(datos); setCurrentScreen('registro_comida'); }}
            onNavigateToHome={() => setCurrentScreen('home')}
          />
        );
      case 'registro_comida':
        return (
          <RegistroComida
            datos={encuesta as data}
            onNavigateToTecno={(datos) => { setEncuesta(datos); setCurrentScreen('tecno_registro') }}
            onNavigateToHome={() => setCurrentScreen('home')}
          />
        );
      case 'tecno_registro':
        return (
          <TecnoRegistro
            datos={encuesta as data}
            onNavigateToObjetivo={(datos) => setCurrentScreen('objetivo')}
            onNavigateToHome={() => setCurrentScreen('home')}
          />
        );
      case 'objetivo':
        return (
          <ObjetivoScreen
            datos={encuesta as data}
            onNavigateToHome={() => setCurrentScreen('home')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SafeAreaProvider>
        {renderScreen()}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </>
  );
}
