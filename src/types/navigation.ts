export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  BeneficiarySetup: undefined;
  DataEntry: {
    section: 'passwords' | 'wishes' | 'financial' | 'confessions';
  };
  TwoFactorSetup: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
