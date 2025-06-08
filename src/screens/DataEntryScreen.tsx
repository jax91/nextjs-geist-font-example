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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from '../utils/encryption';

type DataEntryScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      section: string;
    };
  };
};

type Entry = {
  title: string;
  content: string;
  createdAt: string;
};

const DataEntryScreen: React.FC<DataEntryScreenProps> = ({ route }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>({
    title: '',
    content: '',
    createdAt: new Date().toISOString(),
  });

  const { section } = route.params;

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem(`entries_${section}`);
      if (savedEntries) {
        const decryptedEntries = await Promise.all(
          JSON.parse(savedEntries).map(async (entry: Entry) => ({
            ...entry,
            content: await decrypt(entry.content),
          })),
        );
        setEntries(decryptedEntries);
      }
    } catch (error) {
      console.error('Erro ao carregar entradas:', error);
      Alert.alert('Erro', 'Falha ao carregar entradas');
    }
  };

  const saveEntry = async () => {
    if (!newEntry.title || !newEntry.content) {
      Alert.alert('Erro', 'Título e conteúdo são obrigatórios');
      return;
    }

    try {
      const encryptedContent = await encrypt(newEntry.content);
      const entryToSave = {
        ...newEntry,
        content: encryptedContent,
      };

      const updatedEntries = [...entries, entryToSave];
      await AsyncStorage.setItem(
        `entries_${section}`,
        JSON.stringify(updatedEntries),
      );

      // Update state with decrypted content for display
      setEntries([
        ...entries,
        {
          ...newEntry,
          content: newEntry.content, // Use original unencrypted content for display
        },
      ]);

      setNewEntry({
        title: '',
        content: '',
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Entrada salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar entrada:', error);
      Alert.alert('Erro', 'Falha ao salvar entrada');
    }
  };

  const removeEntry = async (index: number) => {
    try {
      const updatedEntries = entries.filter((_, i) => i !== index);
      const encryptedEntries = await Promise.all(
        updatedEntries.map(async (entry) => ({
          ...entry,
          content: await encrypt(entry.content),
        })),
      );
      await AsyncStorage.setItem(
        `entries_${section}`,
        JSON.stringify(encryptedEntries),
      );
      setEntries(updatedEntries);
      Alert.alert('Sucesso', 'Entrada removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover entrada:', error);
      Alert.alert('Erro', 'Falha ao remover entrada');
    }
  };

  const getSectionTitle = () => {
    switch (section) {
      case 'passwords':
        return 'Gerenciador de Senhas';
      case 'wishes':
        return 'Últimos Desejos';
      case 'financial':
        return 'Informações Financeiras';
      case 'confessions':
        return 'Confissões Privadas';
      default:
        return 'Entrada de Dados';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{getSectionTitle()}</Text>

        <TextInput
          style={styles.input}
          placeholder="Título"
          value={newEntry.title}
          onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
        />

        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Conteúdo"
          value={newEntry.content}
          onChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
          <Text style={styles.saveButtonText}>Salvar Entrada</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.subtitle}>Entradas Salvas</Text>
        {entries.map((entry, index) => (
          <View key={index} style={styles.entryCard}>
            <View style={styles.entryInfo}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryContent}>{entry.content}</Text>
              <Text style={styles.entryDate}>
                {new Date(entry.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeEntry(index)}>
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
  contentInput: {
    height: 120,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  entryCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  entryInfo: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  entryContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
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

export default DataEntryScreen;
