import { api } from './axios';

export const signup = async (
  email: string,
  password: string,
  nickname: string,
  role: 'member' | 'coach' = 'member',
) => {
  try {
    const response = await api.post('/auth/signup', { email, password, nickname, role });
    return response.data;
  } catch (error) {
    // 목업 폴백: 서버가 없거나 실패 시 로컬에 사용자 저장
    const usersRaw = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersRaw) as Array<{
      email: string;
      password: string;
      nickname: string;
      role?: 'member' | 'coach';
    }>;
    if (users.find((u) => u.email === email)) throw error;
    users.push({ email, password, nickname, role });
    localStorage.setItem('users', JSON.stringify(users));

    // 회원가입 시 기본 프로필 정보 생성 (사용자별로 분리)
    const defaultProfile = {
      name: nickname,
      heightCm: '',
      weightKg: '',
      muscleKg: '',
      age: '',
      boxName: '',
    };
    const profileKey = `member_profile_${email}`;
    localStorage.setItem(profileKey, JSON.stringify(defaultProfile));

    return { ok: true, mock: true } as any;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    const usersRaw = localStorage.getItem('users') || '[]';
    let users: Array<{
      email: string;
      password: string;
      nickname: string;
      role?: 'member' | 'coach';
    }>;

    try {
      users = JSON.parse(usersRaw);
    } catch {
      users = [];
    }

    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    return { accessToken: 'mock-token', user: found } as any;
  }
};
