// U-03 로그인: 기존 사용자 인증 및 저장 취향 불러오기
import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout';
import { useAuth } from '../../store/AuthContext';

export default function U03Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // 관람기록 URL 등 특수 진입은 인증 후 원래 화면으로 복귀
      navigate(next ?? '/taste/saved', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout
      title="로그인"
      back="/start"
      footer={
        <button className="btn btn--primary" type="submit" form="login-form" disabled={loading}>
          {loading ? '로그인 중…' : '로그인'}
        </button>
      }
    >
      <form id="login-form" className="form" onSubmit={onSubmit}>
        <div className="page-head">
          <h1 className="h1">다시 오셨네요</h1>
          <p className="sub">로그인은 선택사항이에요. 저장된 취향을 이번 관람에 활용합니다.</p>
        </div>
        <label className="field">
          <span>이메일</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" required />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="row-between small">
          <Link className="link" to="/forgot-password">비밀번호 찾기</Link>
          <Link className="link" to="/signup">회원가입</Link>
        </div>
        <p className="hint">데모 계정: demo@arti.kr / arti1234</p>
      </form>
    </MobileLayout>
  );
}
