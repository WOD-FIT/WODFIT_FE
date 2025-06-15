import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // 유저 정보 저장 (mock)
    localStorage.setItem('user', JSON.stringify({ email, password: pw }));

    // 로그인 페이지로 이동
    navigate('/auth/login');
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-white">
      <div className="text-center mb-12">
        <img src="/icons/Logo-column.svg" alt="WOD 로고" />
      </div>

      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
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
            className="w-full px-4 py-3 border border-black rounded-xl focus:outline-none"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none placeholder-gray-400"
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
