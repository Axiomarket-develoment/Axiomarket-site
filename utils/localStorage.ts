// utils/localStorage.ts
export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("localStorageUpdated")); // ✅ custom event
};