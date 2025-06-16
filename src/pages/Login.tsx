import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        password: pw,
      });

      // 로그인 성공 시 토큰 저장
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('isLoggedIn', 'true');

      alert('로그인 성공');
      navigate('/');
    } catch (err: any) {
      alert('로그인에 실패했습니다: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-white">
      <div className="text-center mb-12">
        <img src="/icons/Logo-column.svg" alt="WOD 로고" />
      </div>

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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1 text-gray-800">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#6D4C1D] text-white py-3 rounded-xl font-semibold mt-2"
        >
          Login
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-400">
        서비스가 처음이신가요?
        <Link to="/auth/signup" className="ml-2 text-black font-medium">
          회원가입
        </Link>
      </div>
    </div>
  );
}
