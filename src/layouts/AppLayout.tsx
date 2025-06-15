import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
export default function AppLayout() {
  return (
    <div>
      <Header />
      {/* Main content area */}
      <div>
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
