// U-01 서비스 시작: 전시 입구 QR 또는 전시 URL 진입 후 서비스 소개
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import MobileLayout from '../../components/MobileLayout';
import { useVisit } from '../../store/VisitContext';

export default function U01Start() {
  const navigate = useNavigate();
  const visit = useVisit();
  const ex = visit.exhibition;

  useEffect(() => {
    api.getCurrentExhibition().then(visit.setExhibition);
  }, []);

  return (
    <MobileLayout
      title={<span className="brand">ARTI</span>}
      footer={
        <>
          <button className="btn btn--primary" onClick={() => navigate('/start')}>관람 시작하기</button>
          <p className="caption center">입구 QR 또는 전시 URL로 접속</p>
        </>
      }
    >
      <div className="hero center">
        <h1 className="h1">나만의 시선으로 만나는 미술관</h1>
        <p className="sub">AI가 추천하고, 작품을 보는 방법까지 안내합니다.</p>
      </div>

      <div className="hero-illust" aria-hidden>
        <svg viewBox="0 0 320 240">
          <rect x="16" y="32" width="64" height="70" fill="#dcd2c3" stroke="#222" strokeWidth="4" transform="translate(0 20)" />
          <rect x="190" y="30" width="72" height="72" fill="#cfdae6" stroke="#222" strokeWidth="4" />
          <circle cx="140" cy="122" r="11" fill="#2b2b2b" />
          <rect x="133" y="130" width="14" height="56" fill="#2b2b2b" />
          <line x1="4" y1="210" x2="316" y2="210" stroke="#c9c4bc" strokeWidth="2" />
        </svg>
      </div>

      <div className="exhibition-info">
        <p className="label">현재 전시</p>
        <p className="exhibition-info__title">{ex?.title ?? '전시 정보를 불러오는 중…'}</p>
        {ex && <p className="muted small">{ex.venue} · {ex.startDate.replace(/-/g, '.')} ~ {ex.endDate.replace(/-/g, '.')}</p>}
      </div>
    </MobileLayout>
  );
}
