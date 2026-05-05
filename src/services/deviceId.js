import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@alignpal_install_id';

function uuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

let cached = null;

export async function getInstallId() {
  if (cached) return cached;
  try {
    const stored = await AsyncStorage.getItem(KEY);
    if (stored) {
      cached = stored;
      return cached;
    }
    const fresh = uuidV4();
    await AsyncStorage.setItem(KEY, fresh);
    cached = fresh;
    return cached;
  } catch {
    // If storage fails fall back to in-memory only
    if (!cached) cached = uuidV4();
    return cached;
  }
}
