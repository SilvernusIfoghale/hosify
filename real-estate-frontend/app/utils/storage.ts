/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/storage.ts

export const storeData = (key: string, value: any): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.error("Error storing data:", e);
  }
};

export const getStoredData = (key: string): any | null => {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (e) {
    console.error("Error getting data:", e);
    return null;
  }
};

export const removeData = (key: string): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.error("Error removing data:", e);
  }
};
