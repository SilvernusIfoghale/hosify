// localStorageService.ts
class LocalStorageService {
  // Add or update data in localStorage
  static setItem<T>(key: string, data: T): void {
    try {
      const stringifiedData = JSON.stringify(data);
      localStorage.setItem(key, stringifiedData);
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }

  // Get data from localStorage
  static getItem<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error retrieving from localStorage", error);
      return null;
    }
  }

  // Remove data from localStorage
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage", error);
    }
  }

  // Clear all data from localStorage
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  }
}

export default LocalStorageService;
