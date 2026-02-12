// Debounce Hook - Used to add debounce/delay in updating the state to minimize unnecessary re-renders and API calls

// Usage:
// const debouncedValue = useDebounce(value, delay);

// Used in:
//  -> Buy-Credits Page: to fetch credits w.r.t price after delay
//  -> Seller Home Page: to fetch posts matching search after delay

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
  // States
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Effects
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
