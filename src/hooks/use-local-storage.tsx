import * as React from "react";

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return initialValue;
      }

      try {
        const parsedItem = JSON.parse(item) as T;

        if (parsedItem === null || parsedItem === undefined) {
          console.warn(`Invalid value in localStorage for key "${key}"`);
          return initialValue;
        }

        return parsedItem;
      } catch (e) {
        console.warn(`Error parsing localStorage key "${key}":`, e);
        localStorage.removeItem(key);
        return initialValue;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const valueRef = React.useRef(storedValue);
  React.useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  const setValue = React.useCallback(
    (value: SetValue<T>) => {
      try {
        const valueToStore =
          value instanceof Function ? value(valueRef.current) : value;

        if (valueToStore === undefined) {
          console.warn(
            `Attempt to save undefined in localStorage for key "${key}"`,
          );
          return;
        }

        if (JSON.stringify(valueRef.current) === JSON.stringify(valueToStore)) {
          return;
        }

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (e) {
            console.error(`Error saving to localStorage key "${key}":`, e);
          }
        }
      } catch (error) {
        console.error(
          `Error processing value for localStorage key "${key}":`,
          error,
        );
      }
    },
    [key],
  );

  return [storedValue, setValue] as const;
}
