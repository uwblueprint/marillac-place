import { useState, useEffect } from "react";

// TODO: Apply this hook for all local storage operations in this project
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const json = localStorage.getItem(key);
      return json != null ? JSON.parse(json) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
