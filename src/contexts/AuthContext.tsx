import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import { AuthContextData, AuthProviderProps, AuthState, defaultAlertMessages } from '../types/auth';
import { Alert } from 'react-native';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        Alert.alert('Erro', defaultAlertMessages.error.validation);
        return;
      }

      // Aqui você normalmente faria uma chamada à API para autenticar
      // Por enquanto, vamos apenas simular um login bem-sucedido
      await AsyncStorage.setItem('authToken', 'dummy-token');
      setState({ ...state, isAuthenticated: true, error: null });
    } catch (error) {
      setState({ ...state, error: defaultAlertMessages.error.login });
      Alert.alert('Erro', defaultAlertMessages.error.login);
    }
  };

  const loginWithBiometrics = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      if (available) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirme sua digital para entrar',
        });
        if (success) {
          await AsyncStorage.setItem('authToken', 'dummy-token');
          setState({ ...state, isAuthenticated: true, error: null });
        }
      }
    } catch (error) {
      setState({ ...state, error: defaultAlertMessages.error.biometrics });
      Alert.alert('Erro', defaultAlertMessages.error.biometrics);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setState({ ...state, isAuthenticated: false });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithBiometrics,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
