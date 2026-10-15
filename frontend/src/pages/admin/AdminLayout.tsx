import type { ReactNode } from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const MENU = [
  { to: '/admin', label: '대시보드', end: true },
  { to: '/admin/exhibitions', label: '전시 관리' },
  { to: '/admin/artworks', label: '작품 관리' },
  { to: '/admin/map', label: '위치·지도 관리' },
  { to: '/admin/members', label: '회원 조회' },
];

/** 관리자 데스크톱 웹 공통 레이아웃 (인증 필요) */
export default function AdminLayout() {
  const { isAdmin, adminLogout } = useAuth();
  const navigate = useNavigate();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin">
      <header className="admin__top">
        <div className="admin__brand">ARTI <span>관리자</span></div>
        <div className="admin__account">
          <span>관리자 계정</span>
          <button className="link" onClick={() => { adminLogout(); navigate('/admin/login'); }}>로그아웃</button>
        </div>
      </header>
      <nav className="admin__side">
        {MENU.map((m) => (
          <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
            {m.label}
          </NavLink>
        ))}
      </nav>
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminPageHead({ title, desc, actions }: { title: string; desc: string; actions?: ReactNode }) {
  return (
    <div className="a-head">
      <div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {actions && <div className="a-head__actions">{actions}</div>}
    </div>
  );
}
