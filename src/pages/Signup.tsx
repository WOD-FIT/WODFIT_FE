import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

import { signup } from '@/api/auth';

export default function Signup() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await signup(email, password, nickname);
      console.log(response);

      navigate('/');
    } catch {
      console.error('회원가입 실패'); // 콘솔 확인용
      // const msg = error.response?.data?.message || '알 수 없는 오류';
      // alert('회원가입에 실패했습니다: ' + msg);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-white">
      <div className="text-center mb-9">
        <img src="/icons/Logo-column.svg" alt="WOD 로고" />
      </div>

      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm mb-1 text-black">
            Nickname
          </label>
          <input
            id="nickname"
            type="text"
            placeholder="Enter your Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm mb-1 text-black">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1 text-black">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#6D4C1D] text-white py-3 rounded-xl font-semibold mt-2"
        >
          Sign up
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-400">
        이미 회원이신가요?
        <Link to="/auth/login" className="ml-2 text-black font-medium">
          로그인
        </Link>
      </div>
    </div>
  );
}
