import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fernandev.gymapp',
  appName: 'GymApp',
  webDir: 'dist/gym-app/browser',
  android: {
    backgroundColor: '#dc2626' // red-600, color del header
  }
};

export default config;
