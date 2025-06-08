import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import BeneficiarySetupScreen from './src/screens/BeneficiarySetupScreen';
import DataEntryScreen from './src/screens/DataEntryScreen';
import TwoFactorSetupScreen from './src/screens/TwoFactorSetupScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ title: 'Herança Digital' }} 
          />
          <Stack.Screen 
            name="BeneficiarySetup" 
            component={BeneficiarySetupScreen}
            options={{ title: 'Configurar Beneficiários' }} 
          />
          <Stack.Screen 
            name="DataEntry" 
            component={DataEntryScreen}
            options={{ title: 'Entrada de Dados Segura' }} 
          />
          <Stack.Screen 
            name="TwoFactorSetup" 
            component={TwoFactorSetupScreen}
            options={{ title: 'Configuração 2FA' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
