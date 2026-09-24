// Thin, defensive wrapper around localStorage.
// Every read/write is guarded so corrupted data or a disabled storage API
// (private browsing, quota errors, etc.) never crashes the app.

export const STORAGE_KEYS = {
  transactions: 'finora_transactions',
  budgets: 'finora_budgets',
  goals: 'finora_goals',
  bills: 'finora_bills',
  settings: 'finora_settings',
  theme: 'finora_theme',
};

export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch (error) {
    console.warn(`Finora: could not read "${key}" from storage, using fallback.`, error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Finora: could not write "${key}" to storage.`, error);
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Finora: could not remove "${key}" from storage.`, error);
  }
}

export function clearAllFinoraStorage() {
  Object.values(STORAGE_KEYS).forEach(removeStorage);
}
