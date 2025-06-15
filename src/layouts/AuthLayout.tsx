import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="w-full flex justify-center bg-white">
      <div className="w-full max-w-[375px] min-h-screen p-4">
        <Outlet />
      </div>
    </div>
  );
}
