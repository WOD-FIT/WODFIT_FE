import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signup } from '@/api/auth';
import { useUserStore } from '@/stores/userStore';
import { isValidEmail, isValidPassword, isValidNickname } from '@/utils/validator';

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    role: 'member' as 'member' | 'coach',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const addUser = useUserStore((state) => state.addUser);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isValidEmail(formData.email)) {
      newErrors.email = '올바른 이메일을 입력해주세요';
    }

    if (!isValidPassword(formData.password)) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!isValidNickname(formData.nickname)) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await signup(formData.email, formData.password, formData.nickname, formData.role);
      // userStore에 사용자 추가
      addUser({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        role: formData.role,
      });
      alert('회원가입이 완료되었습니다!');
      navigate('/auth/login');
      onSuccess?.();
    } catch {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm mb-1 text-gray-800">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="nickname" className="block text-sm mb-1 text-gray-800">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          placeholder="닉네임을 입력하세요"
          value={formData.nickname}
          onChange={(e) => handleChange('nickname', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl ${
            errors.nickname ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm mb-1 text-gray-800">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm mb-1 text-gray-800">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-2 text-gray-800">역할 선택</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="member"
              checked={formData.role === 'member'}
              onChange={(e) => handleChange('role', e.target.value)}
              className="mr-2"
            />
            회원
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="coach"
              checked={formData.role === 'coach'}
              onChange={(e) => handleChange('role', e.target.value)}
              className="mr-2"
            />
            코치
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#63461E] text-white py-3 rounded-xl font-semibold mt-2"
      >
        Sign Up
      </button>
    </form>
  );
};
