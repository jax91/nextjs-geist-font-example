export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
}

export interface EncryptionUtils {
  encrypt: (text: string) => Promise<string>;
  decrypt: (encryptedData: string) => Promise<string>;
}

export interface SecuritySettings {
  biometricsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  weeklyConfirmationEnabled: boolean;
}
