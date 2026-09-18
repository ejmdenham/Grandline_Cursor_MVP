import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { RaceProvider } from './contexts/RaceContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RaceProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </RaceProvider>
    </AuthProvider>
  );
}
