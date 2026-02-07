import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the value after 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: If the user types again before the timer ends, clear it
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}