// U-09 추천 관람 경로(2D 지도): 추천 작품 위치·관람 순서 및 다음 작품 위치 확인
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import FloorMap, { type MapMarker } from '../../components/FloorMap';
import MobileLayout from '../../components/MobileLayout';
import { ENTRANCE, roomName } from '../../data/mock';
import { useVisit } from '../../store/VisitContext';
import { walkMinutes } from '../../utils/recommend';

export default function U09Route() {
  const navigate = useNavigate();
  const visit = useVisit();
  const { recommendations: recs, currentIndex } = visit;
  const [focusId, setFocusId] = useState<string | null>(null);

  if (!recs.length) return <Navigate to="/time" replace />;

  const current = recs[currentIndex];
  const prev = recs[currentIndex - 1];
  const here = prev?.artwork.position ?? ENTRANCE;
  const isFirst = visit.viewedIds.length === 0;

  const markers: MapMarker[] = recs
    .filter((r) => r.artwork.position)
    .map((r) => {
      const idx = recs.indexOf(r);
      return {
        id: r.artwork.id,
        label: String(idx + 1),
        position: r.artwork.position!,
        state: idx < currentIndex ? 'done' : idx === currentIndex ? 'current' : 'upcoming',
      };
    });

  const focus = recs.find((r) => r.artwork.id === focusId) ?? current;
  const focusIdx = recs.indexOf(focus);

  const onStart = () => {
    visit.startViewing();
    navigate('/view');
  };

  return (
    <MobileLayout
      title="추천 관람 경로"
      back="/recommend"
      footer={
        <button className="btn btn--primary" onClick={onStart}>
          {isFirst ? '관람 시작하기' : `${currentIndex + 1}번째 작품 감상하기`}
        </button>
      }
    >
      <p className="label">추천 작품 {currentIndex + 1}/{recs.length}</p>

      <div className="map-card">
        <FloorMap markers={markers} showRoute here={here} onMarkerClick={setFocusId} />
        <div className="next-card">
          <div>
            <p className="label">{focus === current ? '다음 작품' : `${focusIdx + 1}번 작품`}</p>
            <p className="strong">{focus.artwork.title} · {roomName(focus.artwork.roomId)}</p>
          </div>
          {focus === current && current.artwork.position && (
            <span className="muted small nowrap">약 {walkMinutes(here, current.artwork.position)}분</span>
          )}
        </div>
      </div>

      <div className="legend">
        <span><i className="dot dot--here" />현재 위치</span>
        <span><i className="dot dot--current" />다음 작품</span>
        <span><i className="dot dot--done" />감상 완료</span>
      </div>

      <p className="note">실시간 실내 내비게이션이 아닌, 추천 작품의 위치와 관람 순서를 안내합니다.</p>

      <ol className="route-list plain-list">
        {recs.map((r, i) => (
          <li key={r.artwork.id} className={i < currentIndex ? 'is-done' : i === currentIndex ? 'is-current' : ''}>
            <span className="route-list__num">{i + 1}</span>
            <span className="route-list__title">{r.artwork.title}</span>
            <span className="muted small">{roomName(r.artwork.roomId)}</span>
          </li>
        ))}
      </ol>
    </MobileLayout>
  );
}
