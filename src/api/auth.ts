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
    // 목업 폴백: 로컬 사용자 조회
    console.log('API 로그인 실패, 로컬 사용자 조회 시도:', email);
    const usersRaw = localStorage.getItem('users') || '[]';
    let users: Array<{
      email: string;
      password: string;
      nickname: string;
      role?: 'member' | 'coach';
    }>;

    try {
      users = JSON.parse(usersRaw);
    } catch (e) {
      console.error('사용자 데이터 파싱 실패:', e);
      users = [];
    }

    console.log('저장된 사용자 수:', users.length);
    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      console.error('사용자를 찾을 수 없음:', email);
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    console.log('로컬 사용자 로그인 성공:', found);
    return { accessToken: 'mock-token', user: found } as any;
  }
};
