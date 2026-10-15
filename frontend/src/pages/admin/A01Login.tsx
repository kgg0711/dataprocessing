// A-01 관리자 로그인
import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export default function A01Login() {
  const navigate = useNavigate();
  const { isAdmin, adminLogin } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await adminLogin(id, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="admin-login">
      <form className="a-card admin-login__card" onSubmit={onSubmit}>
        <p className="admin__brand">ARTI <span>관리자</span></p>
        <h1>관리자 로그인</h1>
        <p className="muted small">전시·작품·위치 데이터 관리를 위해 관리자 계정으로 로그인하세요.</p>
        <label className="a-field">
          <span>관리자 ID</span>
          <input value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required />
        </label>
        <label className="a-field">
          <span>비밀번호</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="a-btn a-btn--primary a-btn--block" type="submit">로그인</button>
        <p className="hint">데모 계정: admin / admin1234</p>
      </form>
    </div>
  );
}
