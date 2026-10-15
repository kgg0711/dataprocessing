// U-13 관람기록: 로그인 사용자의 이전 관람 기록 확인
// 관람기록 URL로 직접 진입 시 미로그인 상태이면 U-03 인증 후 복귀
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { IconChevron } from '../../components/Icons';
import MobileLayout from '../../components/MobileLayout';
import { fmtDate } from '../../components/ReceiptCard';
import { useAuth } from '../../store/AuthContext';
import type { VisitRecord } from '../../types';

export default function U13History() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [records, setRecords] = useState<VisitRecord[] | null>(null);

  useEffect(() => {
    if (user) api.getVisitHistory(user.id).then(setRecords);
  }, [user]);

  if (!user) return <Navigate to="/login?next=/history" replace />;

  return (
    <MobileLayout
      title="관람기록"
      right={<button className="link small" onClick={() => { logout(); navigate('/'); }}>로그아웃</button>}
    >
      <div className="page-head">
        <h1 className="h1">{user.nickname || '회원'} 님의 관람기록</h1>
        <p className="sub">지난 관람과 아트 영수증을 다시 확인할 수 있어요.</p>
      </div>

      {records === null && <p className="muted">불러오는 중…</p>}
      {records?.length === 0 && (
        <div className="card card--soft center">
          <p>아직 저장된 관람기록이 없어요.</p>
          <button className="link small" onClick={() => navigate('/')}>관람 시작하기</button>
        </div>
      )}

      <ul className="stack-12 plain-list">
        {records?.map((r) => (
          <li key={r.id}>
            <button className="history-card" onClick={() => navigate(`/history/${r.id}`)}>
              <span className="history-card__body">
                <span className="label">{fmtDate(r.date)}</span>
                <span className="strong">{r.exhibitionTitle}</span>
                <span className="muted small">{r.venue}</span>
                <span className="history-card__stats">
                  <span>작품 {r.viewedCount}점</span>
                  <span>관람 {r.durationMin}분</span>
                  <span>👍 {r.likeCount}</span>
                </span>
              </span>
              <span className="history-card__cta">아트 영수증 <IconChevron width={16} height={16} /></span>
            </button>
          </li>
        ))}
      </ul>
    </MobileLayout>
  );
}
