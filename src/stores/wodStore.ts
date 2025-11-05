import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WodEntry, SavedWod } from '@/types';
import { STORAGE_KEYS } from '@/constants/localStorage';

interface WodState {
  wods: WodEntry[];
  savedWods: SavedWod[];
  addWod: (wod: Omit<WodEntry, 'id'>) => void;
  updateWod: (id: string, updates: Partial<WodEntry>) => void;
  deleteWod: (id: string) => void;
  addSavedWod: (wod: Omit<SavedWod, 'id'>) => void;
  updateSavedWod: (id: string, updates: Partial<SavedWod>) => void;
  deleteSavedWod: (id: string) => void;
}

// 기존 localStorage 키와 호환되는 커스텀 스토리지
const createLegacyStorage = (wodsKey: string, savedWodsKey: string) => {
  return {
    getItem: (_name: string): string | null => {
      try {
        const wods = localStorage.getItem(wodsKey);
        const savedWods = localStorage.getItem(savedWodsKey);
        return JSON.stringify({
          state: {
            wods: wods ? JSON.parse(wods) : [],
            savedWods: savedWods ? JSON.parse(savedWods) : [],
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
          localStorage.setItem(wodsKey, JSON.stringify(parsed.state.wods || []));
          localStorage.setItem(savedWodsKey, JSON.stringify(parsed.state.savedWods || []));
        }
      } catch {
        // 무시
      }
    },
    removeItem: (_name: string): void => {
      localStorage.removeItem(wodsKey);
      localStorage.removeItem(savedWodsKey);
    },
  };
};

export const useWodStore = create<WodState>()(
  persist(
    (set) => ({
      wods: [],
      savedWods: [],

      addWod: (wod) => {
        const newWod = { ...wod, id: crypto.randomUUID() };
        set((state) => {
          const updated = [newWod, ...state.wods];
          window.dispatchEvent(new CustomEvent('wodsUpdated', { detail: updated }));
          return { wods: updated };
        });
      },

      updateWod: (id, updates) => {
        set((state) => ({
          wods: state.wods.map((wod) => (wod.id === id ? { ...wod, ...updates } : wod)),
        }));
      },

      deleteWod: (id) => {
        set((state) => ({
          wods: state.wods.filter((wod) => wod.id !== id),
        }));
      },

      addSavedWod: (wod) => {
        const newWod = { ...wod, id: crypto.randomUUID() };
        set((state) => ({
          savedWods: [newWod, ...state.savedWods],
        }));
      },

      updateSavedWod: (id, updates) => {
        set((state) => ({
          savedWods: state.savedWods.map((wod) =>
            wod.id === id ? { ...wod, ...updates } : wod,
          ),
        }));
      },

      deleteSavedWod: (id) => {
        set((state) => ({
          savedWods: state.savedWods.filter((wod) => wod.id !== id),
        }));
      },
    }),
    {
      name: 'wod-storage',
      storage: createJSONStorage(() =>
        createLegacyStorage(STORAGE_KEYS.WODS, STORAGE_KEYS.WOD_ADMIN_SAVED),
      ),
      partialize: (state) => ({
        wods: state.wods,
        savedWods: state.savedWods,
      }),
    },
  ),
);

// storage 이벤트 리스너 (다른 탭에서 변경 시 동기화)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.WODS || e.key === STORAGE_KEYS.WOD_ADMIN_SAVED) {
      const wods = JSON.parse(localStorage.getItem(STORAGE_KEYS.WODS) || '[]');
      const savedWods = JSON.parse(localStorage.getItem(STORAGE_KEYS.WOD_ADMIN_SAVED) || '[]');
      useWodStore.setState({ wods, savedWods });
    }
  });

  window.addEventListener('wodsUpdated', () => {
    const wods = JSON.parse(localStorage.getItem(STORAGE_KEYS.WODS) || '[]');
    useWodStore.setState({ wods });
  });
}

