import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ReservedWod } from '@/types';
import { STORAGE_KEYS } from '@/constants/localStorage';

interface ReservationState {
  reservations: ReservedWod[];
  setReservations: (reservations: ReservedWod[]) => void;
  addReservation: (reservation: ReservedWod) => void;
  removeReservation: (wodId: string, date: string, userId: string) => void;
  getReservationsByDate: (date: string) => ReservedWod[];
  getReservationsByUser: (userId: string) => ReservedWod[];
  getReservationsByDateAndUser: (date: string, userId: string) => ReservedWod[];
}

// 기존 localStorage 키와 호환되는 커스텀 스토리지
const createLegacyStorage = (key: string) => {
  return {
    getItem: (_name: string): string | null => {
      try {
        const reservations = localStorage.getItem(key);
        return JSON.stringify({
          state: {
            reservations: reservations ? JSON.parse(reservations) : [],
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
          localStorage.setItem(key, JSON.stringify(parsed.state.reservations || []));
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

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      reservations: [],

      setReservations: (reservations) => set({ reservations }),

      addReservation: (reservation) => {
        set((state) => ({
          reservations: [...state.reservations, reservation],
        }));
      },

      removeReservation: (wodId, date, userId) => {
        set((state) => ({
          reservations: state.reservations.filter(
            (r) => !(r.wodId === wodId && r.date === date && r.userId === userId),
          ),
        }));
      },

      getReservationsByDate: (date) => {
        return get().reservations.filter((r) => r.date === date);
      },

      getReservationsByUser: (userId) => {
        return get().reservations.filter((r) => r.userId === userId);
      },

      getReservationsByDateAndUser: (date, userId) => {
        return get().reservations.filter((r) => r.date === date && r.userId === userId);
      },
    }),
    {
      name: 'reservation-storage',
      storage: createJSONStorage(() => createLegacyStorage(STORAGE_KEYS.RESERVED_WODS)),
      partialize: (state) => ({
        reservations: state.reservations,
      }),
    },
  ),
);

// storage 이벤트 리스너 (다른 탭에서 변경 시 동기화)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.RESERVED_WODS) {
      const reservations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVED_WODS) || '[]');
      useReservationStore.setState({ reservations });
    }
  });
}

