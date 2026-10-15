// U-06 저장 취향 확인: 기존 회원의 저장 취향 확인·수정
import { Navigate, useNavigate } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout';
import { tasteLabel } from '../../data/mock';
import { useAuth } from '../../store/AuthContext';
import { useVisit } from '../../store/VisitContext';

export default function U06SavedTaste() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const visit = useVisit();

  if (!user) return <Navigate to="/login" replace />;
  const hasTastes = user.tastes.length > 0;

  const onContinue = () => {
    visit.setTastes(user.tastes);
    navigate('/time');
  };

  const onEdit = () => {
    visit.setTastes(user.tastes);
    navigate('/taste');
  };

  return (
    <MobileLayout
      title="저장된 취향"
      back="/start"
      right={<button className="link small" onClick={() => navigate('/history')}>관람기록</button>}
      footer={
        <div className="stack-8">
          <button className="btn btn--primary" disabled={!hasTastes} onClick={onContinue}>이 취향으로 계속</button>
          <button className="btn btn--outline" onClick={onEdit}>취향 수정하기</button>
        </div>
      }
    >
      <div className="page-head">
        <h1 className="h1">{user.nickname || '회원'} 님의 취향</h1>
        <p className="sub">지난 관람에서 저장한 취향이에요. 그대로 사용하거나 이번 관람 전에 수정할 수 있어요.</p>
      </div>

      {hasTastes ? (
        <div className="card">
          <p className="label">저장된 취향 키워드</p>
          <div className="chips">
            {user.tastes.map((t) => (
              <span key={t} className="chip chip--accent"># {tasteLabel(t)}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="card card--soft">
          <p>아직 저장된 취향이 없어요.</p>
          <p className="muted small">‘취향 수정하기’에서 간단히 선택해 주세요.</p>
        </div>
      )}
    </MobileLayout>
  );
}
