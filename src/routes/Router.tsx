// src/routes/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Record from '../pages/Record';
import Reservation from '../pages/Reservation';
import My from '../pages/My';

export const navRoutes = [
  { label: '홈', path: '/', icon: 'home', element: <Home /> },
  { label: 'WOD 기록', path: '/record', icon: 'record', element: <Record /> },
  { label: '수업 예약', path: '/reservation', icon: 'calendar', element: <Reservation /> },
  { label: 'MY', path: '/my', icon: 'my', element: <My /> },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: navRoutes,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
]);
