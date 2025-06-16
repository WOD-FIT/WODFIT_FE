// src/routes/router.tsx
import { createBrowserRouter } from 'react-router';

import { navRoutes } from '@/constants/routes';

import Layout from '@/layouts/Layout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: navRoutes,
  },
  {
    path: '/auth',
    element: <Layout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
]);
