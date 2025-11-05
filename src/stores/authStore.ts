import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/constants/localStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiry: number | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  restoreAuth: () => void;
}

// 기존 localStorage 키와 호환되는 커스텀 스토리지
const createLegacyStorage = () => {
  return {
    getItem: (_name: string): string | null => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        const tokenExpiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

        return JSON.stringify({
          state: {
            token: token || null,
            user: user ? JSON.parse(user) : null,
            tokenExpiry: tokenExpiry ? Number(tokenExpiry) : null,
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
          if (parsed.state.token) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, parsed.state.token);
          } else {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
          }

          if (parsed.state.user) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(parsed.state.user));
          } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
          }

          if (parsed.state.tokenExpiry) {
            localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, String(parsed.state.tokenExpiry));
          } else {
            localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
          }
        }
      } catch {
        // 무시
      }
    },
    removeItem: (_name: string): void => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    },
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiry: null,
      isLoggedIn: false,

      restoreAuth: () => {
        const state = get();
        const now = Date.now();

        if (state.tokenExpiry && state.tokenExpiry < now) {
          set({ user: null, token: null, tokenExpiry: null, isLoggedIn: false });
          return;
        }

        if (state.token && state.user) {
          if (!state.tokenExpiry) {
            const oneYearLater = now + 365 * 24 * 60 * 60 * 1000;
            set({ tokenExpiry: oneYearLater });
          }
          set({ isLoggedIn: true });
        } else {
          set({ user: null, token: null, tokenExpiry: null, isLoggedIn: false });
        }
      },

      login: async (email: string, password: string) => {
        const { login: loginAPI } = await import('@/api/auth');
        const res = await loginAPI(email, password);

        if (!res?.accessToken) {
          throw new Error('로그인 응답이 올바르지 않습니다.');
        }

        const userData: User = {
          email: res.user.email,
          nickname: res.user.nickname,
          role: res.user.role || 'member',
        };

        const oneYearLater = Date.now() + 365 * 24 * 60 * 60 * 1000;

        set({
          token: res.accessToken,
          user: userData,
          tokenExpiry: oneYearLater,
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          tokenExpiry: null,
          isLoggedIn: false,
        });
        window.location.href = `${window.location.origin}/auth/login`;
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => createLegacyStorage()),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tokenExpiry: state.tokenExpiry,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.restoreAuth();
        }
      },
    },
  ),
);

// 초기 로드 시 복원
if (typeof window !== 'undefined') {
  useAuthStore.getState().restoreAuth();

  // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시 동기화)
  window.addEventListener('storage', (e) => {
    if (
      e.key === STORAGE_KEYS.TOKEN ||
      e.key === STORAGE_KEYS.CURRENT_USER ||
      e.key === STORAGE_KEYS.TOKEN_EXPIRY
    ) {
      useAuthStore.getState().restoreAuth();
    }
  });

  // 페이지 포커스 시에도 로그인 상태 확인
  window.addEventListener('focus', () => {
    useAuthStore.getState().restoreAuth();
  });
}

