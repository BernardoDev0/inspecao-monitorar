import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import InspectionScreen from './src/screens/InspectionScreen';
import CEOScreen from './src/screens/CEOScreen';
import { ShiftScheduleScreen } from './src/screens/ShiftScheduleScreen';
import LoadingScreen from './src/components/LoadingScreen';
import { colors } from './src/constants/theme';

type ScreenType = 'login' | 'inspection' | 'ceo' | 'schedule';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [currentPlate, setCurrentPlate] = useState<string>('');
  const [currentVehicleName, setCurrentVehicleName] = useState<string>('');

  const handleLogin = (plate: string, vehicleName: string) => {
    try {
      setCurrentPlate(plate);
      setCurrentVehicleName(vehicleName);
      setCurrentScreen('inspection');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleCEOAccess = () => {
    try {
      setCurrentScreen('ceo');
    } catch (error) {
      console.error('Erro ao acessar CEO:', error);
    }
  };

  const handleLogout = () => {
    try {
      setCurrentScreen('login');
      setCurrentPlate('');
      setCurrentVehicleName('');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLoadingFinish = () => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao finalizar loading:', error);
      // Força finalizar mesmo com erro
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen onFinish={handleLoadingFinish} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onCEOAccess={handleCEOAccess}
          onScheduleAccess={() => setCurrentScreen('schedule')}
        />
      )}
      {currentScreen === 'inspection' && (
        <InspectionScreen 
          plate={currentPlate}
          vehicleName={currentVehicleName}
          onLogout={handleLogout}
        />
      )}
      {currentScreen === 'ceo' && (
        <CEOScreen onLogout={handleLogout} />
      )}
      {currentScreen === 'schedule' && (
        <ShiftScheduleScreen onBack={() => setCurrentScreen('login')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
});
