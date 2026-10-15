// U-05 취향 파악: 신규 사용자·비회원의 간단한 작품 선호 선택
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtImage from '../../components/ArtImage';
import { IconCheck } from '../../components/Icons';
import MobileLayout from '../../components/MobileLayout';
import { TASTE_OPTIONS } from '../../data/mock';
import { useAuth } from '../../store/AuthContext';
import { useVisit } from '../../store/VisitContext';
import type { TasteId } from '../../types';

const MIN_SELECT = 2;

export default function U05Taste() {
  const navigate = useNavigate();
  const visit = useVisit();
  const { user, updateTastes } = useAuth();
  const [selected, setSelected] = useState<TasteId[]>(() => (visit.tastes.length ? visit.tastes : user?.tastes ?? []));

  const toggle = (id: TasteId) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const onDone = async () => {
    visit.setTastes(selected);
    if (user) await updateTastes(selected);
    navigate('/time');
  };

  return (
    <MobileLayout
      title="취향 파악"
      footer={
        <button className="btn btn--primary" disabled={selected.length < MIN_SELECT} onClick={onDone}>
          선택 완료{selected.length > 0 && ` (${selected.length})`}
        </button>
      }
    >
      <div className="page-head">
        <h1 className="h1">더 끌리는 작품을 골라주세요</h1>
        <p className="sub">장르명을 몰라도 괜찮아요. 선택 결과로 취향을 파악합니다.</p>
      </div>

      <div className="taste-grid">
        {TASTE_OPTIONS.map((t) => {
          const on = selected.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              className={`taste-card ${on ? 'is-selected' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(t.id)}
            >
              <ArtImage className="taste-card__img" seed={`taste-${t.id}`} palette={t.palette} alt={t.label} />
              <span className="taste-card__foot">
                <span className="taste-card__label">{t.label}</span>
                <span className="radio-dot">{on && <IconCheck width={14} height={14} strokeWidth={3} />}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="caption">{MIN_SELECT}개 이상 선택</p>
    </MobileLayout>
  );
}
