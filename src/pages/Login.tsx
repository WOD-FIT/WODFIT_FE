import { Link } from 'react-router';
import { LoginForm } from '@/components/forms/LoginForm';

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-white">
      <div className="text-center mb-12">
        <img src="/icons/Logo-column.svg" alt="WOD 로고" />
      </div>

      <LoginForm />

      <div className="mt-6 text-sm text-gray-400">
        서비스가 처음이신가요?
        <Link to="/auth/signup" className="ml-2 text-black font-medium">
          회원가입
        </Link>
      </div>
    </div>
  );
}
