import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.newromath.puzzlegames',
  appName: 'NewroMath',
  webDir: 'dist',
  backgroundColor: '#183278',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    // Security: never allow HTTP content inside HTTPS app, no remote WebView inspection in release
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
    captureInput: false,
    backgroundColor: '#183278',
  },
  plugins: {
    Haptics: {},
    Preferences: {},
    AdMob: {},
  },
};

export default config;
