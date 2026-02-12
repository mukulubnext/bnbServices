// Hook to persist state in localStorage
// Saves data in localStorage and returns the state and a function to update the state

// Usage: 
// const [state, setState] = usePersistedState("key", "initialValue");

// Used in:
//  -> Registeration Page
//  -> Additional Details Page

"use client";

import { useEffect, useState } from "react";

export function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
