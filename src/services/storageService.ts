import { Preferences } from '@capacitor/preferences';

export class StorageService {
  public static async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const { value } = await Preferences.get({ key });
      if (value !== null && value !== undefined) {
        return JSON.parse(value) as T;
      }
    } catch {
      // Fallback to localStorage if Capacitor Preferences throws
      try {
        const item = localStorage.getItem(key);
        if (item) return JSON.parse(item) as T;
      } catch (e) {
        console.error('Storage read error:', e);
      }
    }
    return defaultValue;
  }

  public static async set<T>(key: string, value: T): Promise<void> {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } catch {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage write error:', e);
      }
    }
  }

  public static async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Storage remove error:', e);
      }
    }
  }
}

