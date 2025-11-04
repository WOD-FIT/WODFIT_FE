export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 저장 실패 시 무시
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    // localStorage 삭제 실패 시 무시
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch {
    // localStorage 초기화 실패 시 무시
  }
};
