import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation';

export interface Entry {
  title: string;
  content: string;
  createdAt: string;
}

export interface DataEntryScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DataEntry'>;
  route: {
    params: {
      section: 'passwords' | 'wishes' | 'financial' | 'confessions';
    };
  };
}

export interface DataEntryState {
  entries: Entry[];
  newEntry: Entry;
  isLoading: boolean;
  error: string | null;
}

export interface SectionTitles {
  passwords: string;
  wishes: string;
  financial: string;
  confessions: string;
  default: string;
}

export const defaultSectionTitles: SectionTitles = {
  passwords: 'Gerenciador de Senhas',
  wishes: 'Últimos Desejos',
  financial: 'Informações Financeiras',
  confessions: 'Confissões Privadas',
  default: 'Entrada de Dados'
};

export interface AlertMessages {
  success: {
    save: string;
    remove: string;
  };
  error: {
    load: string;
    save: string;
    remove: string;
    validation: string;
  };
}

export const defaultAlertMessages: AlertMessages = {
  success: {
    save: 'Entrada salva com sucesso',
    remove: 'Entrada removida com sucesso'
  },
  error: {
    load: 'Falha ao carregar entradas',
    save: 'Falha ao salvar entrada',
    remove: 'Falha ao remover entrada',
    validation: 'Título e conteúdo são obrigatórios'
  }
};
