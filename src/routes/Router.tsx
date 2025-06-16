// src/routes/router.tsx
import { createBrowserRouter } from 'react-router-dom';

import { navRoutes } from '@/constants/routes';

import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

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
