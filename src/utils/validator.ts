export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isValidNickname = (nickname: string): boolean => {
  return nickname.trim().length >= 2;
};

export const isValidAge = (age: number): boolean => {
  return age > 0 && age < 150;
};

export const isValidHeight = (height: number): boolean => {
  return height > 0 && height < 300;
};

export const isValidWeight = (weight: number): boolean => {
  return weight > 0 && weight < 500;
};

export const isValidTime = (time: string): boolean => {
  if (!time) return false;

  // HTML5 time input은 자체적으로 유효한 형식을 보장하므로
  // 단순히 비어있지 않은지만 확인
  return time.trim().length > 0;
};

export const isValidCapacity = (capacity: number): boolean => {
  return Number.isInteger(capacity) && capacity > 0 && capacity <= 100;
};
