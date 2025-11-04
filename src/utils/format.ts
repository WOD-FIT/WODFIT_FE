export const formatTime = (time: { min: string; sec: string }): string => {
  return `${time.min}:${time.sec}`;
};

export const formatWeight = (weight: number): string => {
  return `${weight}lbs`;
};

export const formatEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const formatNickname = (nickname: string): string => {
  return nickname.trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
