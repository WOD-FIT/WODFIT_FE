import Home from "@/pages/Home";
import My from "@/pages/My";
import Record from "@/pages/Record";
import Reservation from "@/pages/Reservation";

export const navRoutes = [
  { label: '홈', path: '/', icon: 'home', element: <Home /> },
  { label: 'WOD 기록', path: '/record', icon: 'record', element: <Record /> },
  { label: '수업 예약', path: '/reservation', icon: 'calendar', element: <Reservation /> },
  { label: 'MY', path: '/my', icon: 'my', element: <My /> },
];