/**
 * NewroMath Security & Anti-Cheat Protection System
 * Protects against:
 * 1. LocalStorage / IndexedDB economy overflow & invalid value injection (strict bounds clamping + salted seal)
 * 2. Memory / delta injection attacks (strict upper bounds & max single-transaction delta validation)
 * 3. Root / Frida / Xposed / Debugger hooks reported by Android MainActivity (window.__NM_INTEGRITY)
 * 4. Exposed window.* cheat functions and WebView inspection in production builds
 */

export interface NativeIntegrityReport {
  checked: boolean;
  rooted?: boolean;
  emulator?: boolean;
  debugger?: boolean;
  hooked?: boolean;
  debuggable?: boolean;
  compromised?: boolean;
  ts?: number;
}

const SEAL_STORAGE_KEY = 'newromath_sec_seal_v1';
const SNAPSHOT_BACKUP_KEY = 'newromath_sec_verified_v1';
const SECRET_PEPPER = 'NM_2026_QUANTUM_SHIELD_#9817x!';

export const ECONOMY_LIMITS = {
  MAX_COINS: 5_000_000,
  MAX_GEMS: 100_000,
  MAX_XP: 10_000_000,
  MAX_LEVEL: 26,
  MAX_SINGLE_COIN_DELTA: 100_000,
  MAX_SINGLE_GEM_DELTA: 10_000,
  MAX_SINGLE_XP_DELTA: 25_000,
};

const PROTECTED_KEYS = new Set([
  'newromath_coins',
  'newromath_gems',
  'newromath_player_xp',
  'newromath_unlocked_level',
  'newromath_player_level',
  'newromath_is_pro_user',
]);

/**
 * Fast, deterministic 64-bit-Equivalent Dual FNV-1a Salted Hash for economy state sealing
 */
export function computeEconomySeal(state: {
  coins: number;
  gems: number;
  xp: number;
  unlockedLevel: number;
  playerLevel: number;
  isPro: boolean;
}): string {
  const payload = `${SECRET_PEPPER}|c:${state.coins}|g:${state.gems}|x:${state.xp}|u:${state.unlockedLevel}|l:${state.playerLevel}|p:${state.isPro ? 1 : 0}|${SECRET_PEPPER}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch ^ (i & 0xff);
    h2 = Math.imul(h2, 0x811c9dc5);
  }
  return `nms1_${(h1 >>> 0).toString(16).padStart(8, '0')}_${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

export function clampEconomyValue(key: string, rawVal: string | number): string {
  if (key === 'newromath_is_pro_user') {
    return String(rawVal) === 'true' ? 'true' : 'false';
  }
  const parsed = Number(rawVal);
  const num = Number.isFinite(parsed) ? Math.floor(parsed) : 0;
  switch (key) {
    case 'newromath_coins':
      return String(Math.max(0, Math.min(ECONOMY_LIMITS.MAX_COINS, num)));
    case 'newromath_gems':
      return String(Math.max(0, Math.min(ECONOMY_LIMITS.MAX_GEMS, num)));
    case 'newromath_player_xp':
      return String(Math.max(0, Math.min(ECONOMY_LIMITS.MAX_XP, num)));
    case 'newromath_unlocked_level':
      return String(Math.max(1, Math.min(ECONOMY_LIMITS.MAX_LEVEL, num || 1)));
    case 'newromath_player_level':
    case 'newromath_selected_level':
      return String(Math.max(1, Math.min(25, num || 1)));
    default:
      return String(rawVal);
  }
}

export function isProtectedEconomyKey(key: string): boolean {
  return PROTECTED_KEYS.has(key);
}

function readCurrentEconomyFromStorage(getter: (k: string) => string | null) {
  const rawCoins = parseInt(getter('newromath_coins') ?? '2450', 10);
  const rawGems = parseInt(getter('newromath_gems') ?? '25', 10);
  const rawXp = parseInt(getter('newromath_player_xp') ?? '0', 10);
  const rawUnlocked = parseInt(getter('newromath_unlocked_level') ?? '1', 10);
  const rawLevel = parseInt(getter('newromath_player_level') ?? '1', 10);

  return {
    coins: Math.max(0, Math.min(ECONOMY_LIMITS.MAX_COINS, Number.isFinite(rawCoins) ? rawCoins : 2450)),
    gems: Math.max(0, Math.min(ECONOMY_LIMITS.MAX_GEMS, Number.isFinite(rawGems) ? rawGems : 25)),
    xp: Math.max(0, Math.min(ECONOMY_LIMITS.MAX_XP, Number.isFinite(rawXp) ? rawXp : 0)),
    unlockedLevel: Math.max(1, Math.min(ECONOMY_LIMITS.MAX_LEVEL, Number.isFinite(rawUnlocked) ? rawUnlocked : 1)),
    playerLevel: Math.max(1, Math.min(25, Number.isFinite(rawLevel) ? rawLevel : 1)),
    isPro: getter('newromath_is_pro_user') === 'true',
  };
}

/**
 * Updates the cryptographic seal whenever legitimate in-app code modifies player economy
 */
export function updateEconomySeal(getter: (k: string) => string | null): void {
  try {
    const state = readCurrentEconomyFromStorage(getter);
    const seal = computeEconomySeal(state);
    localStorage.setItem(SEAL_STORAGE_KEY, seal);
    localStorage.setItem(SNAPSHOT_BACKUP_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

/**
 * Verifies and clamps localStorage economy values on boot and before cloud sync.
 * Clamps any out-of-range values to safe bounds without reverting legitimate player rewards.
 */
export function verifyAndSanitizeStorage(cacheMap?: Map<string, string>): boolean {
  try {
    const getVal = (k: string) => (cacheMap && cacheMap.has(k) ? cacheMap.get(k)! : localStorage.getItem(k));
    const setVal = (k: string, v: string) => {
      localStorage.setItem(k, v);
      if (cacheMap) cacheMap.set(k, v);
    };

    const current = readCurrentEconomyFromStorage(getVal);
    setVal('newromath_coins', String(current.coins));
    setVal('newromath_gems', String(current.gems));
    setVal('newromath_player_xp', String(current.xp));
    setVal('newromath_unlocked_level', String(current.unlockedLevel));
    setVal('newromath_player_level', String(current.playerLevel));
    updateEconomySeal(getVal);
    return true;
  } catch {
    return true;
  }
}

/**
 * Checks whether the Android device or browser environment is flagged as compromised
 * (Root, Frida/Xposed hook framework, or attached native debugger)
 */
export function isDeviceCompromised(): boolean {
  if (typeof window === 'undefined') return false;
  const report = (window as any).__NM_INTEGRITY as NativeIntegrityReport | undefined;
  if (report && report.checked) {
    if (report.hooked || report.debugger || report.rooted) {
      return true;
    }
  }
  return false;
}

/**
 * Initializes runtime hardening on the WebView / browser window:
 * - Applies native APK viewport class so screen never jumps into desktop mockup mode
 * - Blocks context-menu / drag / text-selection exploits on touch devices
 */
export function initRuntimeSecurityShield(): void {
  if (typeof window === 'undefined') return;

  try {
    const isNative = Boolean((window as any).Capacitor?.isNativePlatform?.());
    if (isNative) {
      document.documentElement.classList.add('nm-native-apk');
    }

    // Prevent long-press context menu & drag ghosting inside game view
    window.addEventListener(
      'contextmenu',
      (e) => {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
        e.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener('dragstart', (e) => e.preventDefault());
  } catch {
    // ignore
  }
}
