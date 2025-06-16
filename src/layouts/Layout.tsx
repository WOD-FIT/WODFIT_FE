import { Outlet, useLocation } from 'react-router';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');

  return (
    <>
      {isAuthPage ? (
        <Outlet />
      ) : (
        <>
          <Header />
          {/* Main content area */}
          <main>
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
