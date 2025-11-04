import { Link } from 'react-router';
import { SignupForm } from '@/components/forms/SignupForm';

export default function Signup() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 bg-white">
      <div className="text-center mb-12">
        <img src="/icons/Logo-column.svg" alt="WOD 로고" />
      </div>

      <SignupForm />

      <div className="mt-6 text-sm text-gray-400">
        이미 계정이 있으신가요?
        <Link to="/auth/login" className="ml-2 text-black font-medium">
          로그인
        </Link>
      </div>
    </div>
  );
}
