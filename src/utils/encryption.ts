import { NativeModules } from 'react-native';
import Aes from 'react-native-aes-crypto';
import { EncryptedData } from '../types/encryption';

const ENCRYPTION_KEY = 'sua-chave-de-criptografia-segura';

export const encrypt = async (text: string): Promise<string> => {
  try {
    const salt = await Aes.randomKey(16);
    const key = await Aes.pbkdf2(ENCRYPTION_KEY, salt, 5000, 256);
    const iv = await Aes.randomKey(16);
    const encrypted = await Aes.encrypt(text, key, iv, 'aes-256-cbc');
    return JSON.stringify({
      encrypted,
      iv,
      salt,
    });
  } catch (error) {
      console.error('Erro na criptografia:', error);
    throw error;
  }
};

export const decrypt = async (encryptedData: string): Promise<string> => {
  try {
    const { encrypted, iv, salt } = JSON.parse(encryptedData);
    const key = await Aes.pbkdf2(ENCRYPTION_KEY, salt, 5000, 256);
    const decrypted = await Aes.decrypt(encrypted, key, iv, 'aes-256-cbc');
    return decrypted;
  } catch (error) {
      console.error('Erro na descriptografia:', error);
    throw error;
  }
};
