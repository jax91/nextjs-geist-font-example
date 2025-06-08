import { ReactNode } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextData extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AlertMessages {
  error: {
    login: string;
    biometrics: string;
    validation: string;
  };
}

export const defaultAlertMessages: AlertMessages = {
  error: {
    login: 'Falha no login. Verifique suas credenciais.',
    biometrics: 'Falha na autenticação biométrica.',
    validation: 'E-mail e senha são obrigatórios.'
  }
};
