import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

type User = {
  email: string;
  nickname: string;
  role: 'member' | 'coach';
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 복원 함수
  const restoreAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('current_user');
    const tokenExpiry = localStorage.getItem('token_expiry');

    // 토큰 만료 시간 체크 (1년 후 만료)
    const now = Date.now();
    if (tokenExpiry && Number(tokenExpiry) < now) {
      // 토큰이 만료된 경우
      console.log('Token expired, logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('current_user');
      localStorage.removeItem('token_expiry');
      setUser(null);
      setIsLoggedIn(false);
      return;
    }

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);

        // 토큰 만료 시간이 없으면 1년 후로 설정
        if (!tokenExpiry) {
          const oneYearLater = now + 365 * 24 * 60 * 60 * 1000; // 1년 후
          localStorage.setItem('token_expiry', oneYearLater.toString());
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('token_expiry');
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // 초기 로그인 상태 복원
    restoreAuth();

    // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시 동기화)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'current_user' || e.key === 'token_expiry') {
        restoreAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 페이지 포커스 시에도 로그인 상태 확인
    const handleFocus = () => {
      restoreAuth();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [restoreAuth]);

  const login = async (email: string, password: string) => {
    try {
      console.log('로그인 시도:', email);
      const { login: loginAPI } = await import('@/api/auth');
      const res = await loginAPI(email, password);

      console.log('로그인 API 응답:', res);

      if (!res || !res.accessToken) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }

      localStorage.setItem('token', res.accessToken);
      if (res.user) {
        const userData = {
          email: res.user.email,
          nickname: res.user.nickname,
          role: res.user.role || 'member',
        };
        localStorage.setItem('current_user', JSON.stringify(userData));

        // 토큰 만료 시간 설정 (1년 후)
        const oneYearLater = Date.now() + 365 * 24 * 60 * 60 * 1000;
        localStorage.setItem('token_expiry', oneYearLater.toString());

        setUser(userData);
        setIsLoggedIn(true);

        console.log('로그인 성공:', userData);
      } else {
        throw new Error('사용자 정보가 없습니다.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('token_expiry');
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = '/auth/login';
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
