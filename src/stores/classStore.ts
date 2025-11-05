import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Class } from '@/types';
import { STORAGE_KEYS } from '@/constants/localStorage';

interface ClassState {
  classes: Class[];
  setClasses: (classes: Class[]) => void;
  addClass: (classItem: Omit<Class, 'id'>) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  deleteClass: (id: string) => void;
}

// 기존 localStorage 키와 호환되는 커스텀 스토리지
const createLegacyStorage = (key: string) => {
  return {
    getItem: (_name: string): string | null => {
      try {
        const classes = localStorage.getItem(key);
        return JSON.stringify({
          state: {
            classes: classes ? JSON.parse(classes) : [],
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
          localStorage.setItem(key, JSON.stringify(parsed.state.classes || []));
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

export const useClassStore = create<ClassState>()(
  persist(
    (set) => ({
      classes: [],

      setClasses: (classes) => set({ classes }),

      addClass: (classItem) => {
        const newClass = { ...classItem, id: crypto.randomUUID() };
        set((state) => ({
          classes: [newClass, ...state.classes],
        }));
      },

      updateClass: (id, updates) => {
        set((state) => ({
          classes: state.classes.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: 'class-storage',
      storage: createJSONStorage(() => createLegacyStorage(STORAGE_KEYS.ADMIN_CLASSES)),
      partialize: (state) => ({
        classes: state.classes,
      }),
    },
  ),
);

// storage 이벤트 리스너 (다른 탭에서 변경 시 동기화)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.ADMIN_CLASSES) {
      const classes = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMIN_CLASSES) || '[]');
      useClassStore.setState({ classes });
    }
  });
}

