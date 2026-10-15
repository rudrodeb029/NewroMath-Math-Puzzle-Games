import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.newromath.puzzlegames',
  appName: 'NewroMath',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Haptics: {},
    Preferences: {},
    AdMob: {}
  }
};

export default config;

