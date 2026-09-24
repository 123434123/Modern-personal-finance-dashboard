import { useCallback, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

// A useState-like hook that transparently mirrors its value to localStorage.
// Reading is defensive (see utils/storage), so a corrupted or missing key
// simply falls back to the provided initial value instead of throwing.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initialValue === 'function' ? initialValue() : initialValue;
    return readStorage(key, fallback);
  });

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update];
}
