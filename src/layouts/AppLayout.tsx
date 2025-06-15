import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AppLayout() {
  return (
    <div className="w-full flex justify-center bg-white">
      <div className="w-full max-w-[375px] min-h-screen relative">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
