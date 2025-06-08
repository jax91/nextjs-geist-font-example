import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Beneficiary = {
  name: string;
  email: string;
  phone: string;
  relationship: string;
};

type BeneficiarySetupScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const BeneficiarySetupScreen: React.FC<BeneficiarySetupScreenProps> = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [newBeneficiary, setNewBeneficiary] = useState<Beneficiary>({
    name: '',
    email: '',
    phone: '',
    relationship: '',
  });

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const savedBeneficiaries = await AsyncStorage.getItem('beneficiaries');
      if (savedBeneficiaries) {
        setBeneficiaries(JSON.parse(savedBeneficiaries));
      }
    } catch (error) {
      console.error('Erro ao carregar beneficiários:', error);
      Alert.alert('Erro', 'Falha ao carregar beneficiários');
    }
  };

  const saveBeneficiary = async () => {
    if (!newBeneficiary.name || !newBeneficiary.email) {
      Alert.alert('Erro', 'Nome e e-mail são obrigatórios');
      return;
    }

    try {
      const updatedBeneficiaries = [...beneficiaries, newBeneficiary];
      await AsyncStorage.setItem(
        'beneficiaries',
        JSON.stringify(updatedBeneficiaries),
      );
      setBeneficiaries(updatedBeneficiaries);
      setNewBeneficiary({
        name: '',
        email: '',
        phone: '',
        relationship: '',
      });
      Alert.alert('Success', 'Beneficiary added successfully');
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      Alert.alert('Error', 'Failed to save beneficiary');
    }
  };

  const removeBeneficiary = async (index: number) => {
    try {
      const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
      await AsyncStorage.setItem(
        'beneficiaries',
        JSON.stringify(updatedBeneficiaries),
      );
      setBeneficiaries(updatedBeneficiaries);
      Alert.alert('Success', 'Beneficiary removed successfully');
    } catch (error) {
      console.error('Error removing beneficiary:', error);
      Alert.alert('Error', 'Failed to remove beneficiary');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Adicionar Novo Beneficiário</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={newBeneficiary.name}
          onChangeText={(text) =>
            setNewBeneficiary({ ...newBeneficiary, name: text })
          }
        />
        
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={newBeneficiary.email}
          onChangeText={(text) =>
            setNewBeneficiary({ ...newBeneficiary, email: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={newBeneficiary.phone}
          onChangeText={(text) =>
            setNewBeneficiary({ ...newBeneficiary, phone: text })
          }
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Relacionamento"
          value={newBeneficiary.relationship}
          onChangeText={(text) =>
            setNewBeneficiary({ ...newBeneficiary, relationship: text })
          }
        />

        <TouchableOpacity style={styles.addButton} onPress={saveBeneficiary}>
          <Text style={styles.addButtonText}>Adicionar Beneficiário</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.subtitle}>Beneficiários Atuais</Text>
        {beneficiaries.map((beneficiary, index) => (
          <View key={index} style={styles.beneficiaryCard}>
            <View style={styles.beneficiaryInfo}>
              <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
              <Text style={styles.beneficiaryDetail}>{beneficiary.email}</Text>
              <Text style={styles.beneficiaryDetail}>{beneficiary.phone}</Text>
              <Text style={styles.beneficiaryDetail}>
                {beneficiary.relationship}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeBeneficiary(index)}>
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
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
    marginBottom: 10,
    color: '#000',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  beneficiaryCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  beneficiaryDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BeneficiarySetupScreen;
