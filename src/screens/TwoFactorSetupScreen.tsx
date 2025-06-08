import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

type TwoFactorSetupScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const TwoFactorSetupScreen: React.FC<TwoFactorSetupScreenProps> = ({ navigation }) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [weeklyConfirmationEnabled, setWeeklyConfirmationEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
    checkBiometricsAvailability();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('securitySettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setBiometricsEnabled(parsedSettings.biometricsEnabled);
        setPushNotificationsEnabled(parsedSettings.pushNotificationsEnabled);
        setWeeklyConfirmationEnabled(parsedSettings.weeklyConfirmationEnabled);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const checkBiometricsAvailability = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      setBiometricsAvailable(available);
    } catch (error) {
      console.error('Erro ao verificar biometria:', error);
      setBiometricsAvailable(false);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        biometricsEnabled,
        pushNotificationsEnabled,
        weeklyConfirmationEnabled,
      };
      await AsyncStorage.setItem('securitySettings', JSON.stringify(settings));
      Alert.alert('Sucesso', 'Configurações de segurança atualizadas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Alert.alert('Erro', 'Falha ao salvar configurações de segurança');
    }
  };

  const toggleBiometrics = async (value: boolean) => {
    if (value && biometricsAvailable) {
      const rnBiometrics = new ReactNativeBiometrics();
      try {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirme sua digital para ativar a autenticação biométrica',
        });
        if (success) {
          setBiometricsEnabled(true);
          await saveSettings();
        }
      } catch (error) {
        console.error('Erro de biometria:', error);
        Alert.alert('Erro', 'Falha ao ativar autenticação biométrica');
      }
    } else {
      setBiometricsEnabled(false);
      await saveSettings();
    }
  };

  const handlePushNotifications = async (value: boolean) => {
    setPushNotificationsEnabled(value);
    await saveSettings();
  };

  const handleWeeklyConfirmation = async (value: boolean) => {
    setWeeklyConfirmationEnabled(value);
    await saveSettings();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Configurações de Segurança</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Autenticação Biométrica</Text>
            <Text style={styles.settingDescription}>
              Use digital ou reconhecimento facial para login
            </Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={toggleBiometrics}
            disabled={!biometricsAvailable}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Notificações Push</Text>
            <Text style={styles.settingDescription}>
              Receba notificações para atualizações importantes
            </Text>
          </View>
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={handlePushNotifications}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Confirmação Semanal de Vida</Text>
            <Text style={styles.settingDescription}>
              Requer confirmação semanal de atividade da conta
            </Text>
          </View>
          <Switch
            value={weeklyConfirmationEnabled}
            onValueChange={handleWeeklyConfirmation}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Recomendações de Segurança</Text>
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>Ative Todos os Recursos de Segurança</Text>
          <Text style={styles.recommendationText}>
            Para máxima proteção de sua herança digital, recomendamos ativar
            todos os recursos de segurança disponíveis. Isso garante que seus dados
            permaneçam seguros e acessíveis apenas aos beneficiários pretendidos quando necessário.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Salvar Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  recommendationCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#000',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TwoFactorSetupScreen;
