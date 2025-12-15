// 공통 타입 정의

export type UserRole = 'member' | 'coach';

export interface User {
  email: string;
  nickname: string;
  role: UserRole;
}

export interface WodEntry {
  id: string;
  date: string;
  text: string;
  time: { min: string; sec: string };
  exercises: { name: string; weight: string }[];
  tags?: string[];
  userId?: string;
  userNickname?: string;
}

export interface SavedWod {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface WodPayload {
  date: string;
  title: string;
  description: string;
}

export interface Class {
  id: string;
  date: string;
  time: string;
  location: string;
  wodId: string;
  capacity: number;
}

export interface ReservedWod {
  wodId: string;
  date: string;
  userId?: string;
  userNickname?: string;
}

export interface Profile {
  name: string;
  age: number | '';
  heightCm: number | '';
  weightKg: number | '';
  muscleKg: number | '';
  boxName?: string;
}

export type TabType = 'register' | 'list' | 'records' | 'manage';
