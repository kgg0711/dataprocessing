// U-08 개인화 작품 추천: 취향+시간 기반 추천 작품 목록과 추천 이유 제시
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ArtImage from '../../components/ArtImage';
import { IconChevron } from '../../components/Icons';
import MobileLayout from '../../components/MobileLayout';
import { roomName } from '../../data/mock';
import { useVisit } from '../../store/VisitContext';

export default function U08Recommend() {
  const navigate = useNavigate();
  const visit = useVisit();
  const [open, setOpen] = useState<string | null>(null);

  if (!visit.recommendations.length) return <Navigate to="/time" replace />;

  return (
    <MobileLayout
      title="추천 작품"
      back="/time"
      footer={<button className="btn btn--primary" onClick={() => navigate('/route')}>2D 지도에서 경로 보기</button>}
    >
      <div className="page-head">
        <h1 className="h1">오늘은 이 작품들을 만나보세요</h1>
        <p className="sub">취향과 관람 시간을 바탕으로 {visit.recommendations.length}개 작품을 골랐습니다.</p>
      </div>

      <ol className="stack-12 plain-list">
        {visit.recommendations.map((r, i) => {
          const expanded = open === r.artwork.id;
          return (
            <li key={r.artwork.id}>
              <button
                type="button"
                className={`rec-card ${expanded ? 'is-open' : ''}`}
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : r.artwork.id)}
              >
                <ArtImage className="rec-card__img" seed={r.artwork.id} palette={r.artwork.palette} imageUrl={r.artwork.imageUrl} alt={r.artwork.title} />
                <span className="rec-card__body">
                  <span className="rec-card__title">{i + 1}. {r.artwork.title}</span>
                  <span className="rec-card__artist">{r.artwork.artist}</span>
                  <span className="pill">{r.reasonShort}</span>
                </span>
                <IconChevron className="rec-card__chev" />
              </button>
              {expanded && (
                <div className="rec-card__detail">
                  <p>{r.reason}</p>
                  <p className="muted small">{roomName(r.artwork.roomId)} · {r.artwork.year}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </MobileLayout>
  );
}
