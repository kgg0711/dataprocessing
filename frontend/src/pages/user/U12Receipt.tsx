// U-12 아트 영수증: 관람 결과·작품 목록·취향 요약 확인
// - /receipt          : 방금 끝난 관람 (관람 완료 시 세션 종료)
// - /history/:id      : U-13에서 진입하는 과거 기록 조회 모드
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as api from '../../api';
import MobileLayout from '../../components/MobileLayout';
import ReceiptCard, { fmtDate } from '../../components/ReceiptCard';
import { useAuth } from '../../store/AuthContext';
import { useVisit } from '../../store/VisitContext';
import type { VisitRecord } from '../../types';

export default function U12Receipt() {
  const { recordId } = useParams();
  return recordId ? <HistoryReceipt recordId={recordId} /> : <CurrentReceipt />;
}

function CurrentReceipt() {
  const navigate = useNavigate();
  const visit = useVisit();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!visit.record && visit.recommendations.length) visit.finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && visit.record) api.saveVisitRecord(user.id, visit.record).then(() => setSaved(true));
  }, [user, visit.record]);

  if (!visit.recommendations.length && !visit.record) return <Navigate to="/" replace />;
  const record = visit.record;

  const onComplete = () => {
    visit.reset();
    navigate('/', { replace: true });
  };

  return (
    <MobileLayout
      title="아트 영수증"
      footer={<button className="btn btn--primary" onClick={onComplete}>관람 완료</button>}
    >
      {record && (
        <>
          <div className="hero center">
            <h1 className="h1">오늘의 관람이 완성됐어요</h1>
            <p className="sub">{fmtDate(record.date)} · 관람 {record.durationMin}분</p>
          </div>
          <ReceiptCard record={record} />
          {user ? (
            <p className="note center">{saved ? '✓ 관람기록에 저장되었어요. ' : '관람기록에 저장 중… '}
              <Link className="link" to="/history">관람기록 보기</Link>
            </p>
          ) : (
            <div className="card card--soft center mt-16">
              <p className="small">로그인하면 이 영수증을 관람기록에 저장하고 다음 관람에 취향을 이어갈 수 있어요.</p>
              <Link className="link small" to="/login?next=/receipt">로그인하고 저장하기</Link>
            </div>
          )}
        </>
      )}
    </MobileLayout>
  );
}

function HistoryReceipt({ recordId }: { recordId: string }) {
  const { user } = useAuth();
  const location = useLocation();
  const [record, setRecord] = useState<VisitRecord | null | undefined>(undefined);

  useEffect(() => {
    if (user) api.getVisitHistory(user.id).then((h) => setRecord(h.find((r) => r.id === recordId) ?? null));
  }, [user, recordId]);

  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;

  return (
    <MobileLayout title="아트 영수증" back="/history">
      {record === undefined && <p className="muted center mt-24">불러오는 중…</p>}
      {record === null && <p className="muted center mt-24">기록을 찾을 수 없어요.</p>}
      {record && (
        <>
          <div className="hero center">
            <h1 className="h1">지난 관람 기록</h1>
            <p className="sub">{fmtDate(record.date)} · 관람 {record.durationMin}분</p>
          </div>
          <ReceiptCard record={record} />
        </>
      )}
    </MobileLayout>
  );
}
