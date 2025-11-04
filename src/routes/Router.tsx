// src/routes/router.tsx
import { createBrowserRouter } from 'react-router';
import { Outlet, Navigate } from 'react-router';
import React from 'react';

import { navRoutes } from '@/constants/routes';

import Layout from '@/layouts/Layout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Admin from '@/pages/Admin.tsx';
import AdminClass from '@/pages/AdminClass.tsx';
import AdminMy from '@/pages/AdminMy.tsx';
import AdminHome from '@/pages/AdminHome.tsx';
import AdminReservations from '@/pages/AdminReservations.tsx';
import AdminWodCalendar from '@/pages/AdminWodCalendar.tsx';
import AdminClassCalendar from '@/pages/AdminClassCalendar.tsx';
import AdminMembers from '@/pages/AdminMembers.tsx';
import AdminClassDetail from '@/pages/AdminClassDetail.tsx';
import Settings from '@/pages/Settings.tsx';
import NotificationSettings from '@/pages/NotificationSettings.tsx';
import PasswordChange from '@/pages/PasswordChange.tsx';
import MemberProfile from '@/pages/MemberProfile.tsx';
import MemberWod from '@/pages/MemberWod.tsx';
import MemberBenchmarks from '@/pages/MemberBenchmarks.tsx';
import MemberHistory from '@/pages/MemberHistory.tsx';
import MemberAnalysis from '@/pages/MemberAnalysis.tsx';
import CoachWod from '@/pages/CoachWod.tsx';
import CoachMembers from '@/pages/CoachMembers.tsx';
import Leaderboard from '@/pages/Leaderboard.tsx';
import Home from '@/pages/Home.tsx';
import My from '@/pages/My.tsx';
import Record from '@/pages/Record.tsx';
import Reservation from '@/pages/Reservation.tsx';

function RoleGuard({
  allow,
  redirectTo,
  children,
}: {
  allow: Array<'member' | 'coach'>;
  redirectTo: string;
  children?: React.ReactNode;
}) {
  const meRaw = typeof window !== 'undefined' ? localStorage.getItem('current_user') : null;
  const me = meRaw ? (JSON.parse(meRaw) as { role?: 'member' | 'coach' }) : undefined;
  if (!me || !me.role || !allow.includes(me.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...navRoutes,
      // Main pages
      { path: '', element: <Home /> },
      { path: 'my', element: <My /> },
      { path: 'record', element: <Record /> },
      { path: 'reservation', element: <Reservation /> },
      // Admin pages
      {
        path: 'admin/home',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminHome />
          </RoleGuard>
        ),
      },
      {
        path: 'admin',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <Admin />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/class',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminClass />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/my',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminMy />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/reservations',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminReservations />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/wod-calendar',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminWodCalendar />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/class-calendar',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminClassCalendar />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/members',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminMembers />
          </RoleGuard>
        ),
      },
      {
        path: 'admin/class/:classId',
        element: (
          <RoleGuard allow={['coach']} redirectTo="/auth/login">
            <AdminClassDetail />
          </RoleGuard>
        ),
      },
      // Member
      { path: 'member/profile', element: <MemberProfile /> },
      { path: 'member/wod', element: <MemberWod /> },
      { path: 'member/benchmarks', element: <MemberBenchmarks /> },
      { path: 'member/history', element: <MemberHistory /> },
      { path: 'member/analysis', element: <MemberAnalysis /> },
      // Coach
      {
        path: 'coach',
        element: <RoleGuard allow={['coach']} redirectTo="/auth/login" />,
        children: [
          { path: 'wod', element: <CoachWod /> },
          { path: 'members', element: <CoachMembers /> },
        ],
      },
      // Extras
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'settings', element: <Settings /> },
      { path: 'settings/notification', element: <NotificationSettings /> },
      { path: 'settings/password', element: <PasswordChange /> },
    ],
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
