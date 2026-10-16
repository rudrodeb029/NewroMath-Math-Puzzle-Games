/**
 * Firebase Cloud Firestore & Realtime Database Sync Service for NewroMath
 * Project ID: newromaths
 * Cloud Firestore: projects/newromaths/databases/(default)
 * Realtime Database URL: https://newromaths-default-rtdb.firebaseio.com
 */

export const FIREBASE_CONFIG = {
  projectId: 'newromaths',
  appId: '1:380321074987:web:5f576dfdde6b963ddaff6e',
  databaseURL: 'https://newromaths-default-rtdb.firebaseio.com',
  firestoreBaseUrl: 'https://firestore.googleapis.com/v1/projects/newromaths/databases/(default)/documents',
  storageBucket: 'newromaths.firebasestorage.app',
  apiKey: 'AIzaSyAlGxK6C1_MZzIU3u0U6rvceXVmAJWg4Q4',
  authDomain: 'newromaths.firebaseapp.com',
  messagingSenderId: '380321074987',
  projectNumber: '380321074987',
};

const PLAYER_ID_KEY = 'newromath_player_id';

const COUNTRY_FLAG_MAP: Record<string, string> = {
  'United States': '🇺🇸',
  'United Kingdom': '🇬🇧',
  Canada: '🇨🇦',
  Australia: '🇦🇺',
  Bangladesh: '🇧🇩',
  India: '🇮🇳',
  Pakistan: '🇵🇰',
  Germany: '🇩🇪',
  France: '🇫🇷',
  Spain: '🇪🇸',
  Italy: '🇮🇹',
  Brazil: '🇧🇷',
  Mexico: '🇲🇽',
  Japan: '🇯🇵',
  'South Korea': '🇰🇷',
  Singapore: '🇸🇬',
  Malaysia: '🇲🇾',
  Indonesia: '🇮🇩',
  Philippines: '🇵🇭',
  Vietnam: '🇻🇳',
  UAE: '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  Turkey: '🇹🇷',
  Egypt: '🇪🇬',
  Nigeria: '🇳🇬',
  'South Africa': '🇿🇦',
  Netherlands: '🇳🇱',
  Sweden: '🇸🇪',
  Norway: '🇳🇴',
  Switzerland: '🇨🇭',
};

/**
 * Converts a JS value to Cloud Firestore REST API Value format
 */
export function toFirestoreValue(val: any): Record<string, any> {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === 'boolean') {
    return { booleanValue: val };
  }
  if (typeof val === 'number') {
    if (Number.isInteger(val)) {
      return { integerValue: String(val) };
    }
    return { doubleValue: val };
  }
  if (typeof val === 'string') {
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map((item) => toFirestoreValue(item)),
      },
    };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

/**
 * Converts a plain JS object to a Cloud Firestore Document payload ({ fields: ... })
 */
export function toFirestoreDocument(obj: Record<string, any>): { fields: Record<string, any> } {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  return { fields };
}

/**
 * Converts a Cloud Firestore REST API Value back to a plain JS value
 */
export function fromFirestoreValue(valObj: any): any {
  if (!valObj || typeof valObj !== 'object') return null;
  if ('stringValue' in valObj) return valObj.stringValue;
  if ('booleanValue' in valObj) return Boolean(valObj.booleanValue);
  if ('integerValue' in valObj) return Number(valObj.integerValue);
  if ('doubleValue' in valObj) return Number(valObj.doubleValue);
  if ('nullValue' in valObj) return null;
  if ('arrayValue' in valObj) {
    const vals = valObj.arrayValue?.values || [];
    return vals.map((v: any) => fromFirestoreValue(v));
  }
  if ('mapValue' in valObj) {
    return fromFirestoreDocument(valObj.mapValue);
  }
  return null;
}

/**
 * Converts a Cloud Firestore Document ({ fields: ... }) back to a plain JS object
 */
export function fromFirestoreDocument(doc: any): Record<string, any> | null {
  if (!doc || !doc.fields) return null;
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(doc.fields)) {
    result[k] = fromFirestoreValue(v);
  }
  return result;
}

/**
 * Upserts a document in Cloud Firestore via REST API
 */
export async function upsertFirestoreDoc(collectionPath: string, docId: string, data: Record<string, any>): Promise<boolean> {
  try {
    const url = `${FIREBASE_CONFIG.firestoreBaseUrl}/${collectionPath}/${encodeURIComponent(docId)}?key=${FIREBASE_CONFIG.apiKey}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toFirestoreDocument(data)),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function getOrCreatePlayerId(): string {
  try {
    const existing = localStorage.getItem(PLAYER_ID_KEY);
    if (existing && existing.trim().length > 4) {
      return existing.trim();
    }
    const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newId = `player_${Date.now().toString(36)}_${randomSuffix}`;
    localStorage.setItem(PLAYER_ID_KEY, newId);
    return newId;
  } catch {
    return 'player_guest_default';
  }
}

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export interface PlayerCloudSnapshot {
  playerId: string;
  updatedAt: number;
  profile: {
    playerId: string;
    playerName: string;
    playerCountry: string;
    countryFlag: string;
    playerPhone: string;
    playerEmail: string;
    equippedAvatar: string;
    updatedAt: number;
  };
  progress: {
    unlockedLevelMax: number;
    playerLevel: number;
    selectedLevelNum: number;
    playerXp: number;
    coins: number;
    gems: number;
    isProUser: boolean;
    dailyCrateLastClaimed: string;
    updatedAt: number;
  };
  settings: {
    isDarkMode: boolean;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    notificationsEnabled: boolean;
    timerEnabled: boolean;
    explanationEnabled: boolean;
    autoSubmitEnabled: boolean;
    largeFontEnabled: boolean;
    divisionSymbol: string;
  };
  dailyChallenges: Record<string, number[]>;
  puzzleRecords: any[];
  savedPuzzles: Array<string | number>;
}

/**
 * Builds a complete snapshot of all local player data to sync with Firebase Firestore & RTDB
 */
export function buildLocalPlayerSnapshot(): PlayerCloudSnapshot {
  const playerId = getOrCreatePlayerId();
  const now = Date.now();

  const playerName = (localStorage.getItem('newromath_player_name') || 'Guest-JFNZLZ').trim();
  const playerCountry = (localStorage.getItem('newromath_player_country') || 'United States').trim();
  const countryFlag = COUNTRY_FLAG_MAP[playerCountry] || '🌐';
  const playerPhone = (localStorage.getItem('newromath_player_phone') || '').trim();
  const playerEmail = (localStorage.getItem('newromath_player_email') || '').trim();
  const equippedAvatar = localStorage.getItem('newromath_player_avatar') || '/assets/icon_robot_3d.webp';

  const unlockedLevelMax = Math.max(1, parseInt(localStorage.getItem('newromath_unlocked_level') || '1', 10) || 1);
  const playerLevel = Math.max(1, parseInt(localStorage.getItem('newromath_player_level') || '1', 10) || 1);
  const selectedLevelNum = Math.max(1, parseInt(localStorage.getItem('newromath_selected_level') || '1', 10) || 1);
  const playerXp = Math.max(0, parseInt(localStorage.getItem('newromath_player_xp') || '0', 10) || 0);
  const coins = Math.max(0, parseInt(localStorage.getItem('newromath_coins') || '2450', 10) || 0);
  const gems = Math.max(0, parseInt(localStorage.getItem('newromath_gems') || '25', 10) || 0);
  const isProUser = localStorage.getItem('newromath_is_pro_user') === 'true';
  const dailyCrateLastClaimed = localStorage.getItem('newromath_daily_crate_last_claimed') || '';

  const settings = {
    isDarkMode: localStorage.getItem('newromath_dark_mode') !== 'false',
    soundEnabled: localStorage.getItem('newromath_sound') !== 'false',
    hapticsEnabled: localStorage.getItem('newromath_haptics') !== 'false',
    notificationsEnabled: localStorage.getItem('newromath_notifications') !== 'false',
    timerEnabled: localStorage.getItem('newromath_timer') !== 'false',
    explanationEnabled: localStorage.getItem('newromath_explanation') !== 'false',
    autoSubmitEnabled: localStorage.getItem('newromath_autosubmit') === 'true',
    largeFontEnabled: localStorage.getItem('newromath_largefont') === 'true',
    divisionSymbol: localStorage.getItem('newromath_div_symbol') || '÷',
  };

  const dailyChallenges: Record<string, number[]> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('newromath_daily_completed_')) {
        const seasonKey = k.replace('newromath_daily_completed_', '');
        dailyChallenges[seasonKey] = safeParseJson<number[]>(localStorage.getItem(k), []);
      }
    }
  } catch {
    // ignore storage iteration error
  }

  const puzzleRecords = safeParseJson<any[]>(localStorage.getItem('newromath_puzzle_records'), []).slice(0, 50);
  const savedPuzzles = safeParseJson<Array<string | number>>(localStorage.getItem('newromath_saved_puzzles'), []);

  return {
    playerId,
    updatedAt: now,
    profile: {
      playerId,
      playerName,
      playerCountry,
      countryFlag,
      playerPhone,
      playerEmail,
      equippedAvatar,
      updatedAt: now,
    },
    progress: {
      unlockedLevelMax,
      playerLevel,
      selectedLevelNum,
      playerXp,
      coins,
      gems,
      isProUser,
      dailyCrateLastClaimed,
      updatedAt: now,
    },
    settings,
    dailyChallenges,
    puzzleRecords,
    savedPuzzles,
  };
}

let syncTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Immediately pushes the current player snapshot and leaderboard score to both
 * Cloud Firestore and Firebase Realtime Database
 */
export async function syncPlayerToFirebaseNow(): Promise<boolean> {
  try {
    const snapshot = buildLocalPlayerSnapshot();
    const { playerId, profile, progress } = snapshot;

    const computedScore = progress.playerXp + progress.unlockedLevelMax * 500 + progress.coins;
    const leaderboardEntry = {
      playerId,
      name: profile.playerName,
      country: profile.playerCountry,
      flag: profile.countryFlag,
      avatar: profile.equippedAvatar,
      level: Math.max(progress.playerLevel, progress.unlockedLevelMax),
      xp: progress.playerXp,
      score: computedScore,
      coins: progress.coins,
      isProUser: progress.isProUser,
      updatedAt: snapshot.updatedAt,
    };

    // 1. Sync to Cloud Firestore (users/{playerId} & leaderboard/{playerId})
    const fsUserPromise = upsertFirestoreDoc('users', playerId, snapshot);
    const fsLbPromise = upsertFirestoreDoc('leaderboard', playerId, leaderboardEntry);

    // 2. Sync to Firebase Realtime Database (/users/{playerId}.json & /leaderboard/{playerId}.json)
    const userUrl = `${FIREBASE_CONFIG.databaseURL}/users/${encodeURIComponent(playerId)}.json`;
    const rtdbUserPromise = fetch(userUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    }).then((r) => r.ok).catch(() => false);

    const lbUrl = `${FIREBASE_CONFIG.databaseURL}/leaderboard/${encodeURIComponent(playerId)}.json`;
    const rtdbLbPromise = fetch(lbUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leaderboardEntry),
    }).then((r) => r.ok).catch(() => false);

    const [fsOk, , rtdbOk] = await Promise.all([fsUserPromise, fsLbPromise, rtdbUserPromise, rtdbLbPromise]);
    return Boolean(fsOk || rtdbOk);
  } catch (err) {
    console.warn('[NewroMath Firebase] Cloud sync deferred (offline or network unavailable):', err);
    return false;
  }
}

/**
 * Debounced trigger called automatically whenever FastGameStorage updates a key
 */
export function scheduleFirebaseSync(changedKey?: string): void {
  if (changedKey && !changedKey.startsWith('newromath_')) return;
  if (syncTimeoutId) {
    clearTimeout(syncTimeoutId);
  }
  syncTimeoutId = setTimeout(() => {
    syncTimeoutId = null;
    void syncPlayerToFirebaseNow();
  }, 400);
}

/**
 * Submit a support / feedback ticket directly to Cloud Firestore and Realtime Database
 */
export async function submitFeedbackTicketToFirebase(payload: {
  category: string;
  email?: string;
  message: string;
}): Promise<boolean> {
  try {
    const snapshot = buildLocalPlayerSnapshot();
    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const ticketData = {
      ticketId,
      playerId: snapshot.playerId,
      playerName: snapshot.profile.playerName,
      playerCountry: snapshot.profile.playerCountry,
      email: payload.email || snapshot.profile.playerEmail || '',
      category: payload.category || 'General',
      message: payload.message,
      playerLevel: snapshot.progress.playerLevel,
      isProUser: snapshot.progress.isProUser,
      status: 'open',
      createdAt: Date.now(),
    };

    const fsPromise = upsertFirestoreDoc('feedback_tickets', ticketId, ticketData);
    const rtdbUrl = `${FIREBASE_CONFIG.databaseURL}/feedback_tickets/${encodeURIComponent(ticketId)}.json`;
    const rtdbPromise = fetch(rtdbUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    }).then((r) => r.ok).catch(() => false);

    const [fsOk, rtdbOk] = await Promise.all([fsPromise, rtdbPromise]);
    return Boolean(fsOk || rtdbOk);
  } catch (err) {
    console.warn('[NewroMath Firebase] Failed to submit feedback ticket:', err);
    return false;
  }
}

/**
 * Record an IAP store purchase in Cloud Firestore and Realtime Database
 */
export async function recordPurchaseToFirebase(payload: {
  productId: string;
  title?: string;
  price?: string;
  rewardCoins?: number;
  rewardGems?: number;
  grantPro?: boolean;
}): Promise<boolean> {
  try {
    const playerId = getOrCreatePlayerId();
    const purchaseId = `pur_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const purchaseRecord = {
      purchaseId,
      playerId,
      productId: payload.productId,
      title: payload.title || payload.productId,
      price: payload.price || '',
      rewardCoins: payload.rewardCoins || 0,
      rewardGems: payload.rewardGems || 0,
      grantPro: Boolean(payload.grantPro),
      createdAt: Date.now(),
    };

    const fsPromise = upsertFirestoreDoc('purchases', purchaseId, purchaseRecord);
    const url = `${FIREBASE_CONFIG.databaseURL}/purchases/${encodeURIComponent(purchaseId)}.json`;
    const rtdbPromise = fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseRecord),
    }).then((r) => r.ok).catch(() => false);

    void syncPlayerToFirebaseNow();
    const [fsOk, rtdbOk] = await Promise.all([fsPromise, rtdbPromise]);
    return Boolean(fsOk || rtdbOk);
  } catch {
    return false;
  }
}

/**
 * Fetch live Global Leaderboard entries from Cloud Firestore (with RTDB fallback)
 */
export async function fetchLeaderboardFromFirebase(): Promise<any[]> {
  try {
    const fsUrl = `${FIREBASE_CONFIG.firestoreBaseUrl}/leaderboard?pageSize=50&key=${FIREBASE_CONFIG.apiKey}`;
    const fsRes = await fetch(fsUrl);
    if (fsRes.ok) {
      const fsJson = await fsRes.json();
      if (Array.isArray(fsJson?.documents) && fsJson.documents.length > 0) {
        return fsJson.documents
          .map((doc: any) => fromFirestoreDocument(doc))
          .filter(Boolean)
          .sort((a: any, b: any) => (b.score || b.xp || 0) - (a.score || a.xp || 0));
      }
    }
    const url = `${FIREBASE_CONFIG.databaseURL}/leaderboard.json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || typeof data !== 'object') return [];
    return Object.values(data).sort((a: any, b: any) => (b.score || b.xp || 0) - (a.score || a.xp || 0));
  } catch {
    return [];
  }
}

/**
 * Initializes two-way cloud synchronization on app startup:
 * - Pulls existing cloud profile/progress from Cloud Firestore (or RTDB fallback) and merges with local storage
 * - Otherwise seeds the current device player into Cloud Firestore & Realtime Database
 */
export async function initFirebaseCloudSync(storageCache?: Record<string, string>): Promise<void> {
  try {
    const playerId = getOrCreatePlayerId();
    let cloudData: Partial<PlayerCloudSnapshot> | null = null;

    // Try Cloud Firestore first
    try {
      const fsUrl = `${FIREBASE_CONFIG.firestoreBaseUrl}/users/${encodeURIComponent(playerId)}?key=${FIREBASE_CONFIG.apiKey}`;
      const fsRes = await fetch(fsUrl);
      if (fsRes.ok) {
        const fsDoc = await fsRes.json();
        cloudData = fromFirestoreDocument(fsDoc) as Partial<PlayerCloudSnapshot> | null;
      }
    } catch {
      // fallback to RTDB
    }

    // Fallback to Realtime Database if not found in Firestore yet
    if (!cloudData) {
      const userUrl = `${FIREBASE_CONFIG.databaseURL}/users/${encodeURIComponent(playerId)}.json`;
      const res = await fetch(userUrl);
      if (res.ok) {
        cloudData = (await res.json()) as Partial<PlayerCloudSnapshot> | null;
      }
    }

    if (cloudData && cloudData.progress && cloudData.profile) {
      const localSnap = buildLocalPlayerSnapshot();
      let didRestoreFromCloud = false;

      const setKey = (k: string, v: string) => {
        localStorage.setItem(k, v);
        if (storageCache) storageCache[k] = v;
      };

      // Merge highest progression values
      if ((cloudData.progress.unlockedLevelMax || 1) > localSnap.progress.unlockedLevelMax) {
        setKey('newromath_unlocked_level', String(cloudData.progress.unlockedLevelMax));
        didRestoreFromCloud = true;
      }
      if ((cloudData.progress.playerXp || 0) > localSnap.progress.playerXp) {
        setKey('newromath_player_xp', String(cloudData.progress.playerXp));
        didRestoreFromCloud = true;
      }
      if (cloudData.progress.isProUser && !localSnap.progress.isProUser) {
        setKey('newromath_is_pro_user', 'true');
        didRestoreFromCloud = true;
      }

      // Restore custom profile fields if local is still default Guest
      if (
        cloudData.profile.playerName &&
        !cloudData.profile.playerName.startsWith('Guest-') &&
        localSnap.profile.playerName.startsWith('Guest-')
      ) {
        setKey('newromath_player_name', cloudData.profile.playerName);
        if (cloudData.profile.playerCountry) setKey('newromath_player_country', cloudData.profile.playerCountry);
        if (cloudData.profile.playerPhone) setKey('newromath_player_phone', cloudData.profile.playerPhone);
        if (cloudData.profile.playerEmail) setKey('newromath_player_email', cloudData.profile.playerEmail);
        didRestoreFromCloud = true;
      }

      if (didRestoreFromCloud && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('newromath-cloud-synced', { detail: cloudData }));
      }
    }

    // Always push latest merged state back to both Cloud Firestore and Realtime Database
    await syncPlayerToFirebaseNow();
  } catch (err) {
    console.warn('[NewroMath Firebase] Initial cloud sync skipped:', err);
  }
}
