// U-07 관람 시간 선택: 관람 가능 시간에 따라 추천 작품 수 결정
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import MobileLayout from '../../components/MobileLayout';
import { useVisit } from '../../store/VisitContext';
import type { VisitDuration } from '../../types';
import { DURATION_OPTIONS, recommend } from '../../utils/recommend';

export default function U07Time() {
  const navigate = useNavigate();
  const visit = useVisit();
  const [selected, setSelected] = useState<VisitDuration>(visit.duration ?? '60m');
  const [loading, setLoading] = useState(false);

  if (!visit.tastes.length) return <Navigate to="/taste" replace />;

  const onSubmit = async () => {
    setLoading(true);
    visit.setDuration(selected);
    const exhibition = visit.exhibition ?? (await api.getCurrentExhibition());
    if (!visit.exhibition) visit.setExhibition(exhibition);
    const artworks = await api.getArtworks(exhibition.id);
    visit.setRecommendations(recommend(artworks, visit.tastes, selected));
    navigate('/recommend');
  };

  return (
    <MobileLayout
      title="관람 시간"
      footer={
        <button className="btn btn--primary" disabled={loading} onClick={onSubmit}>
          {loading ? '추천 작품을 고르는 중…' : '추천 받기'}
        </button>
      }
    >
      <div className="page-head">
        <h1 className="h1">오늘 얼마나 관람할까요?</h1>
        <p className="sub">선택한 시간에 맞춰 추천 작품 수와 관람 순서를 구성합니다.</p>
      </div>

      <div className="stack-12" role="radiogroup" aria-label="관람 시간">
        {DURATION_OPTIONS.map((o) => {
          const on = o.id === selected;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`option ${on ? 'is-selected' : ''}`}
              onClick={() => setSelected(o.id)}
            >
              <span className="radio" />
              <span>
                <span className="option__title">{o.label}</span>
                <span className="option__desc">{o.desc} · 약 {o.count}작품</span>
              </span>
            </button>
          );
        })}
      </div>
    </MobileLayout>
  );
}
