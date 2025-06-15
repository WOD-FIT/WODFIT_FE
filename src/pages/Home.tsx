import { Navigate } from 'react-router-dom';

export default function Home() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  return <div className="p-4">홈 페이지 (로그인됨)</div>;
}
