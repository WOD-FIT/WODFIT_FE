import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/stores/userStore';
import { isValidEmail, isValidPassword } from '@/utils/validator';
import { useNavigate } from 'react-router';

type LoginFormProps = {
  onSuccess?: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const addUser = useUserStore((state) => state.addUser);
  const getUser = useUserStore((state) => state.getUser);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!isValidEmail(email)) {
      newErrors.email = '올바른 이메일을 입력해주세요';
    }

    if (!isValidPassword(password)) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('current_user') || '{}');
      const role = user?.role || 'member';

      // userStore에 사용자가 없으면 localStorage의 users에서 가져와서 추가
      if (!getUser(email)) {
        try {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const foundUser = users.find((u: any) => u.email === email);
          if (foundUser) {
            addUser({
              email: foundUser.email,
              password: foundUser.password,
              nickname: foundUser.nickname,
              role: foundUser.role || 'member',
            });
          }
        } catch {
          // 무시
        }
      }

      setTimeout(() => {
        navigate(role === 'coach' ? '/admin/home' : '/');
        onSuccess?.();
      }, 100);
    } catch (error: any) {
      const errorMessage =
        error?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm mb-1 text-gray-800">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm mb-1 text-gray-800">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <button
        type="submit"
        className="w-full bg-[#63461E] text-white py-3 rounded-xl font-semibold mt-2"
      >
        Login
      </button>
    </form>
  );
};
