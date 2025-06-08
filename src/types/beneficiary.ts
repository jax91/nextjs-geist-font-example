import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation';

export interface Beneficiary {
  name: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface BeneficiaryScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BeneficiarySetup'>;
}

export interface BeneficiaryState {
  beneficiaries: Beneficiary[];
  newBeneficiary: Beneficiary;
  isLoading: boolean;
  error: string | null;
}

export interface BeneficiaryContextData {
  beneficiaries: Beneficiary[];
  addBeneficiary: (beneficiary: Beneficiary) => Promise<void>;
  removeBeneficiary: (index: number) => Promise<void>;
  updateBeneficiary: (index: number, beneficiary: Beneficiary) => Promise<void>;
}

export interface AlertMessages {
  success: {
    add: string;
    remove: string;
    update: string;
  };
  error: {
    load: string;
    add: string;
    remove: string;
    update: string;
    validation: string;
  };
}

export const defaultAlertMessages: AlertMessages = {
  success: {
    add: 'Beneficiário adicionado com sucesso',
    remove: 'Beneficiário removido com sucesso',
    update: 'Beneficiário atualizado com sucesso'
  },
  error: {
    load: 'Falha ao carregar beneficiários',
    add: 'Falha ao adicionar beneficiário',
    remove: 'Falha ao remover beneficiário',
    update: 'Falha ao atualizar beneficiário',
    validation: 'Nome e e-mail são obrigatórios'
  }
};
