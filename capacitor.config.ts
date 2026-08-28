import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fernandev.gymapp',
  appName: 'GymApp',
  webDir: 'dist/gym-app/browser',
  android: {
    backgroundColor: '#4f46e5' // indigo-600, color del header
  }
};

export default config;
