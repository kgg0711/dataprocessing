// U-10 작품 감상: 추천 이유·해설·Guided Looking·AI 설명·TTS·선호 반응
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ArtImage from '../../components/ArtImage';
import {
  IconArrowRight, IconBulb, IconChat, IconClose, IconExpand, IconEye, IconMap, IconSpeaker, IconStop, IconThumbDown, IconThumbUp,
} from '../../components/Icons';
import MobileLayout from '../../components/MobileLayout';
import { tasteLabel } from '../../data/mock';
import { useSpeech } from '../../hooks/useSpeech';
import { useVisit } from '../../store/VisitContext';
import type { Artwork, TasteId } from '../../types';

type Tab = 'desc' | 'guided' | 'ai';
const TABS: { id: Tab; label: string }[] = [
  { id: 'desc', label: '작품 해설' },
  { id: 'guided', label: 'Guided Looking' },
  { id: 'ai', label: 'AI 맞춤 설명' },
];

const FOCUS_HINT: Record<TasteId, string> = {
  vivid: '색이 가장 강하게 부딪히는 지점을 찾아보세요. 보색이 맞닿는 곳에서 화면의 에너지가 생겨납니다.',
  calm: '화면의 수평선과 여백에 주목해 보세요. 고요함은 비워 둔 공간에서 만들어집니다.',
  abstract: '무엇을 그렸는지보다 선과 형태가 만드는 리듬을 따라가 보세요.',
  soft: '색과 색 사이의 경계가 얼마나 부드럽게 이어지는지 살펴보세요.',
  emotion: '붓질의 방향과 속도를 상상해 보세요. 작가의 감정이 붓 자국에 남아 있습니다.',
  portrait: '인물의 시선이 향하는 곳과 빛이 닿는 얼굴의 부분을 살펴보세요.',
};

/** AI 맞춤 설명 (목업): 사용자 취향과 작품 특성을 연결한 설명 */
function personalized(artwork: Artwork, tastes: TasteId[]) {
  const matched = artwork.tags.filter((t) => tastes.includes(t));
  const keys = matched.length ? matched : artwork.tags.slice(0, 1);
  const intro = matched.length
    ? `‘${matched.map(tasteLabel).join('’, ‘')}’에 끌리는 당신에게 「${artwork.title}」은(는) 특히 흥미로울 거예요.`
    : `「${artwork.title}」은(는) 평소 취향과 조금 다른, 새로운 감상 포인트를 가진 작품이에요.`;
  return [intro, ...keys.map((k) => FOCUS_HINT[k])].join(' ');
}

export default function U10View() {
  const navigate = useNavigate();
  const visit = useVisit();
  const { recommendations: recs, currentIndex } = visit;
  const rec = recs[currentIndex];
  const [tab, setTab] = useState<Tab>('desc');
  const [more, setMore] = useState(false);
  const [zoom, setZoom] = useState(false);
  const speech = useSpeech();
  const artworkId = rec?.artwork.id;

  // 감상 시작 기록 및 작품별 감상 시간 측정
  useEffect(() => {
    if (!artworkId) return;
    visit.startViewing();
    visit.markViewed(artworkId);
    const started = Date.now();
    return () => visit.addViewTime(artworkId, Date.now() - started);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworkId]);

  const text = useMemo(() => {
    if (!rec) return '';
    if (tab === 'desc') return rec.artwork.description;
    if (tab === 'guided') return rec.artwork.guidedLooking.map((q, i) => `${i + 1}. ${q}`).join('\n');
    return personalized(rec.artwork, visit.tastes);
  }, [rec, tab, visit.tastes]);

  useEffect(() => {
    speech.stop();
    setMore(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, artworkId]);

  if (!rec) return <Navigate to={recs.length ? '/receipt' : '/time'} replace />;
  const { artwork } = rec;
  const reaction = visit.reactions[artwork.id];
  const isLast = currentIndex === recs.length - 1;

  const onNext = () => {
    speech.stop();
    if (visit.advance()) navigate('/route');
    else navigate('/receipt');
  };

  return (
    <MobileLayout
      back="/route"
      title={
        <div className="progress">
          <span>{currentIndex + 1} / {recs.length}</span>
          <span className="progress__bar">
            {recs.map((r, i) => <i key={r.artwork.id} className={i <= currentIndex ? 'on' : ''} />)}
          </span>
        </div>
      }
      right={
        <button className="chip-btn" onClick={() => navigate('/route')}>
          <IconMap width={18} height={18} /> 지도 보기
        </button>
      }
      footer={
        <button className="btn btn--primary" onClick={onNext}>
          {isLast ? '관람 마치기' : '다음 작품 안내'} <IconArrowRight width={20} height={20} />
        </button>
      }
    >
      <div className="artwork-hero">
        <ArtImage className="artwork-hero__img" seed={artwork.id} palette={artwork.palette} imageUrl={artwork.imageUrl} alt={artwork.title} />
        <button className="artwork-hero__zoom" aria-label="크게 보기" onClick={() => setZoom(true)}>
          <IconExpand width={18} height={18} />
        </button>
      </div>

      <h1 className="artwork-title">{artwork.title}</h1>
      <p className="artwork-meta">{artwork.artist} <span className="sep">|</span> {artwork.year}</p>

      <div className="reason-box">
        <IconBulb className="reason-box__icon" />
        <div>
          <p className="strong">이 작품이 추천된 이유</p>
          <p>{rec.reason}</p>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>
            {t.id === 'desc' && tab === t.id && <IconEye width={18} height={18} />}
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {tab === 'guided' ? (
          <ol className="guided-list">
            {artwork.guidedLooking.map((q) => <li key={q}>{q}</li>)}
          </ol>
        ) : (
          <p className={more ? '' : 'clamp-3'}>
            {text}{' '}
          </p>
        )}
        {tab !== 'guided' && text.length > 90 && (
          <button className="link small" onClick={() => setMore((m) => !m)}>{more ? '접기' : '더보기'}</button>
        )}
        {tab === 'desc' && <p className="source">출처: {artwork.source}</p>}
      </div>

      <div className="grid-2">
        <button
          className="btn btn--outline"
          disabled={!speech.supported}
          onClick={() => (speech.speaking ? speech.stop() : speech.speak(`${artwork.title}. ${text}`))}
        >
          {speech.speaking ? <IconStop width={20} height={20} /> : <IconSpeaker width={20} height={20} />}
          {speech.speaking ? '재생 중지' : '음성 설명 듣기'}
        </button>
        <button className="btn btn--outline" onClick={() => navigate('/ask')}>
          <IconChat width={20} height={20} /> AI에게 질문하기
        </button>
      </div>

      <div className="reactions">
        <span className="muted small">이 작품, 마음에 드셨나요? (선택)</span>
        <button
          className={`round-btn ${reaction === 'like' ? 'is-on' : ''}`}
          aria-pressed={reaction === 'like'}
          aria-label="좋아요"
          onClick={() => visit.react(artwork.id, reaction === 'like' ? null : 'like')}
        >
          <IconThumbUp />
        </button>
        <button
          className={`round-btn ${reaction === 'dislike' ? 'is-on' : ''}`}
          aria-pressed={reaction === 'dislike'}
          aria-label="별로예요"
          onClick={() => visit.react(artwork.id, reaction === 'dislike' ? null : 'dislike')}
        >
          <IconThumbDown />
        </button>
      </div>

      {zoom && (
        <div className="lightbox" role="dialog" aria-label={artwork.title} onClick={() => setZoom(false)}>
          <ArtImage className="lightbox__img" seed={artwork.id} palette={artwork.palette} imageUrl={artwork.imageUrl} alt={artwork.title} />
          <button className="lightbox__close" aria-label="닫기"><IconClose /></button>
        </div>
      )}
    </MobileLayout>
  );
}
