import { STORAGE_KEYS } from '@/constants/localStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type NotificationTarget = 'member' | 'coach';

type NotificationItem = {
  id: string;
  message: string;
  link?: string;
  createdAt: string;
  target: NotificationTarget;
  readBy: string[]; // 읽은 사용자(email) 목록
};

type NotificationState = {
  notifications: NotificationItem[];
  addNotification: (payload: {
    message: string;
    link?: string;
    target: NotificationTarget;
  }) => void;
  markAllReadForUser: (target: NotificationTarget, userId: string) => void;
  clear: () => void;
  hasUnreadForUser: (target: NotificationTarget, userId: string) => boolean;
};

const createLegacyStorage = (key: string) => {
  return {
    getItem: () => localStorage.getItem(key),
    setItem: (_name: string, value: string) => {
      localStorage.setItem(key, value);
    },
    removeItem: () => {
      localStorage.removeItem(key);
    },
  };
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: ({ message, link, target }) => {
        const newItem: NotificationItem = {
          id: crypto.randomUUID(),
          message,
          link,
          createdAt: new Date().toISOString(),
          target,
          readBy: [],
        };

        set((state) => ({
          notifications: [newItem, ...state.notifications].slice(0, 20),
        }));
      },
      markAllReadForUser: (target, userId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.target === target && userId
              ? { ...n, readBy: Array.from(new Set([...(n.readBy || []), userId])) }
              : n,
          ),
        })),
      clear: () => set({ notifications: [] }),
      hasUnreadForUser: (target, userId) =>
        get().notifications.some(
          (n) => n.target === target && !!userId && !(n.readBy || []).includes(userId),
        ),
    }),
    {
      name: STORAGE_KEYS.NOTIFICATIONS,
      storage: createJSONStorage(() => createLegacyStorage(STORAGE_KEYS.NOTIFICATIONS)),
      partialize: (state) => ({
        notifications: state.notifications,
      }),
    },
  ),
);
