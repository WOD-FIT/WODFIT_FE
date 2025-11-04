import { Outlet, useLocation } from 'react-router';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');

  return (
    <div className="app-container">
      {isAuthPage ? (
        <Outlet />
      ) : (
        <>
          <Header />
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto pb-20">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
