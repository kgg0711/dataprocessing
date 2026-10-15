// U-02 로그인 선택: 로그인 또는 비회원 이용 선택
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout';
import { useAuth } from '../../store/AuthContext';

export default function U02LoginChoice() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <MobileLayout title="시작하기" back="/">
      <div className="page-head">
        <h1 className="h1">어떻게 관람할까요?</h1>
        <p className="sub">로그인하면 저장된 취향과 관람 기록을 이어서 활용할 수 있어요.</p>
      </div>

      {user ? (
        <div className="card card--soft stack-8">
          <p className="strong">{user.nickname || user.email} 님으로 로그인되어 있어요</p>
          <button className="btn btn--primary" onClick={() => navigate('/taste/saved')}>저장된 취향으로 계속</button>
          <button className="btn btn--text" onClick={logout}>다른 계정으로 이용하기 (로그아웃)</button>
        </div>
      ) : (
        <div className="stack-12">
          <button className="choice" onClick={() => navigate('/login')}>
            <span className="choice__title">로그인</span>
            <span className="choice__desc">저장된 취향을 불러와 바로 추천받아요</span>
          </button>
          <button className="choice" onClick={() => navigate('/taste')}>
            <span className="choice__title">비회원으로 계속</span>
            <span className="choice__desc">간단한 취향 선택 후 바로 관람할 수 있어요</span>
          </button>
        </div>
      )}

      <div className="info-box">
        <p>✓ 비회원도 추천·지도·작품 감상 기능을 모두 이용할 수 있어요.</p>
        <p>✓ 로그인은 취향과 관람 기록을 저장하기 위한 선택 기능이에요.</p>
      </div>

      {!user && (
        <p className="center small muted mt-24">
          아직 계정이 없나요?{' '}
          <button className="link" onClick={() => navigate('/signup')}>회원가입</button>
        </p>
      )}
    </MobileLayout>
  );
}
