import { STORAGE_KEYS } from '@/constants/localStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type NotificationTarget = 'member' | 'coach';

type NotificationItem = {
  id: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
  target: NotificationTarget;
};

type NotificationState = {
  notifications: NotificationItem[];
  addNotification: (payload: {
    message: string;
    link?: string;
    target: NotificationTarget;
  }) => void;
  markAllReadForTarget: (target: NotificationTarget) => void;
  clear: () => void;
  hasUnreadForTarget: (target: NotificationTarget) => boolean;
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
          read: false,
          target,
        };

        set((state) => ({
          notifications: [newItem, ...state.notifications].slice(0, 20),
        }));
      },
      markAllReadForTarget: (target) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.target === target ? { ...n, read: true } : n,
          ),
        })),
      clear: () => set({ notifications: [] }),
      hasUnreadForTarget: (target) =>
        get().notifications.some((n) => n.target === target && !n.read),
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
