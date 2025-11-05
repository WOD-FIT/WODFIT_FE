import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/localStorage';

interface User {
  email: string;
  password: string;
  nickname: string;
  role?: 'member' | 'coach';
}

interface UserState {
  users: User[];
  addUser: (user: User) => void;
  removeUser: (email: string) => void;
  getUser: (email: string) => User | undefined;
  getAllUsers: () => User[];
}

// 기존 localStorage 키와 호환되는 커스텀 스토리지
const createLegacyStorage = (key: string) => {
  return {
    getItem: (_name: string): string | null => {
      try {
        const users = localStorage.getItem(key);
        return JSON.stringify({
          state: {
            users: users ? JSON.parse(users) : [],
          },
          version: 0,
        });
      } catch {
        return null;
      }
    },
    setItem: (_name: string, value: string): void => {
      try {
        const parsed = JSON.parse(value);
        if (parsed.state) {
          localStorage.setItem(key, JSON.stringify(parsed.state.users || []));
        }
      } catch {
        // 무시
      }
    },
    removeItem: (_name: string): void => {
      localStorage.removeItem(key);
    },
  };
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],

      addUser: (user) => {
        set((state) => {
          if (state.users.find((u) => u.email === user.email)) {
            return state;
          }
          return { users: [...state.users, user] };
        });
      },

      removeUser: (email) => {
        set((state) => ({
          users: state.users.filter((u) => u.email !== email),
        }));
      },

      getUser: (email) => {
        return get().users.find((u) => u.email === email);
      },

      getAllUsers: () => {
        return get().users;
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => createLegacyStorage(STORAGE_KEYS.USERS)),
      partialize: (state) => ({
        users: state.users,
      }),
    },
  ),
);

// storage 이벤트 리스너 (다른 탭에서 변경 시 동기화)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.USERS) {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      useUserStore.setState({ users });
    }
  });
}

