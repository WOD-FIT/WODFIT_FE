// src/routes/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
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
    element: <App />,
    children: navRoutes,
  },
]);
