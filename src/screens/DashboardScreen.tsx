import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt } from '../utils/encryption';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [lastConfirmation, setLastConfirmation] = useState<string>('');

  useEffect(() => {
    checkLifeConfirmation();
  }, []);

  const checkLifeConfirmation = async () => {
    try {
      const lastCheck = await AsyncStorage.getItem('lastLifeConfirmation');
      if (!lastCheck) {
        showLifeConfirmationPrompt();
      } else {
        const lastCheckDate = new Date(lastCheck);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 7) {
          showLifeConfirmationPrompt();
        }
        setLastConfirmation(lastCheck);
      }
    } catch (error) {
      console.error('Error checking life confirmation:', error);
    }
  };

  const showLifeConfirmationPrompt = () => {
    Alert.alert(
      'Confirmação de Vida Necessária',
      'Por favor, confirme seu status para manter acesso à sua herança digital.',
      [
        {
          text: 'Estou vivo',
          onPress: confirmLife,
        },
        {
          text: 'Lembrar depois',
          style: 'cancel',
        },
      ],
    );
  };

  const confirmLife = async () => {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem('lastLifeConfirmation', now);
      setLastConfirmation(now);
      Alert.alert('Sucesso', 'Confirmação de vida atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao confirmar vida:', error);
      Alert.alert('Erro', 'Falha ao atualizar confirmação de vida');
    }
  };

  const navigateToSection = (section: string) => {
    navigation.navigate('DataEntry', { section });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Herança Digital</Text>
        <Text style={styles.subtitle}>
          Última Confirmação: {lastConfirmation ? new Date(lastConfirmation).toLocaleDateString('pt-BR') : 'Nunca'}
        </Text>
      </View>

      <View style={styles.sectionsContainer}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigateToSection('passwords')}>
          <Text style={styles.sectionTitle}>Senhas</Text>
          <Text style={styles.sectionDescription}>
            Armazene credenciais importantes de contas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => navigateToSection('wishes')}>
          <Text style={styles.sectionTitle}>Últimos Desejos</Text>
          <Text style={styles.sectionDescription}>
            Documente seus desejos e pedidos finais
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => navigateToSection('financial')}>
          <Text style={styles.sectionTitle}>Informações Financeiras</Text>
          <Text style={styles.sectionDescription}>
            Registre contas e documentos financeiros
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() => navigateToSection('confessions')}>
          <Text style={styles.sectionTitle}>Confissões</Text>
          <Text style={styles.sectionDescription}>
            Compartilhe pensamentos e segredos privados
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.beneficiaryButton}
        onPress={() => navigation.navigate('BeneficiarySetup')}>
        <Text style={styles.beneficiaryButtonText}>Gerenciar Beneficiários</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
  },
  sectionsContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  beneficiaryButton: {
    margin: 20,
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
  },
  beneficiaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
