import { api } from './axios';

export const signup = async (email: string, password: string, nickname: string) => {
  try {
    const response = await api.post('/auth/signup', { email, password, nickname });
    // console.log(response);

    return response.data;
  } catch (error) {
    console.error('회원가입 실패', error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // console.log(response);

    return response.data;
  } catch (error) {
    console.error('로그인 실패', error);
  }
};
