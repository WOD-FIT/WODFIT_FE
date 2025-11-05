import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Profile } from '@/types';
import { STORAGE_KEYS } from '@/constants/localStorage';

interface ProfileState {
  profiles: Record<string, Profile>;
  getProfile: (email: string) => Profile | undefined;
  setProfile: (email: string, profile: Profile) => void;
  removeProfile: (email: string) => void;
}

// 기존 localStorage 키와 호환되는 커스텀 스토리지
// 프로필은 동적 키(member_profile_${email})를 사용하므로 별도 처리
const createProfileStorage = () => {
  return {
    getItem: (_name: string): string | null => {
      try {
        const profiles: Record<string, Profile> = {};
        // 모든 localStorage 키를 순회하며 member_profile_ 로 시작하는 키 찾기
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('member_profile_')) {
            const email = key.replace('member_profile_', '');
            const profile = localStorage.getItem(key);
            if (profile) {
              try {
                profiles[email] = JSON.parse(profile);
              } catch {
                // 무시
              }
            }
          }
        }
        return JSON.stringify({
          state: { profiles },
          version: 0,
        });
      } catch {
        return null;
      }
    },
    setItem: (_name: string, value: string): void => {
      try {
        const parsed = JSON.parse(value);
        if (parsed.state && parsed.state.profiles) {
          // 기존 프로필들 삭제 후 새로 저장
          Object.keys(parsed.state.profiles).forEach((email) => {
            const key = STORAGE_KEYS.MEMBER_PROFILE(email);
            localStorage.setItem(key, JSON.stringify(parsed.state.profiles[email]));
          });
        }
      } catch {
        // 무시
      }
    },
    removeItem: (_name: string): void => {
      // 모든 member_profile_ 키 삭제
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('member_profile_')) {
          localStorage.removeItem(key);
        }
      }
    },
  };
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: {},

      getProfile: (email) => {
        // Store에서 먼저 확인, 없으면 localStorage에서 직접 읽기
        const storeProfile = get().profiles[email];
        if (storeProfile) return storeProfile;

        try {
          const key = STORAGE_KEYS.MEMBER_PROFILE(email);
          const profile = localStorage.getItem(key);
          if (profile) {
            const parsed = JSON.parse(profile);
            // Store에 동기화
            set((state) => ({
              profiles: { ...state.profiles, [email]: parsed },
            }));
            return parsed;
          }
        } catch {
          // 무시
        }
        return undefined;
      },

      setProfile: (email, profile) => {
        set((state) => ({
          profiles: { ...state.profiles, [email]: profile },
        }));
        // localStorage에도 직접 저장 (기존 키 유지)
        try {
          const key = STORAGE_KEYS.MEMBER_PROFILE(email);
          localStorage.setItem(key, JSON.stringify(profile));
        } catch {
          // 무시
        }
      },

      removeProfile: (email) => {
        set((state) => {
          const { [email]: _, ...rest } = state.profiles;
          return { profiles: rest };
        });
        // localStorage에서도 삭제
        try {
          const key = STORAGE_KEYS.MEMBER_PROFILE(email);
          localStorage.removeItem(key);
        } catch {
          // 무시
        }
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => createProfileStorage()),
      partialize: (state) => ({
        profiles: state.profiles,
      }),
    },
  ),
);

// storage 이벤트 리스너 (다른 탭에서 변경 시 동기화)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('member_profile_')) {
      const email = e.key.replace('member_profile_', '');
      try {
        const profile = localStorage.getItem(e.key);
        if (profile) {
          useProfileStore.getState().setProfile(email, JSON.parse(profile));
        } else {
          useProfileStore.getState().removeProfile(email);
        }
      } catch {
        // 무시
      }
    }
  });
}

