// 취향 + 관람 시간 기반 추천 및 관람 순서 계산 (MVP용 규칙 기반 로직)
import { ENTRANCE, tasteLabel } from '../data/mock';
import type { Artwork, Point, Recommendation, TasteId, VisitDuration } from '../types';

export const DURATION_OPTIONS: { id: VisitDuration; label: string; desc: string; count: number }[] = [
  { id: '30m', label: '30분', desc: '핵심 작품 위주로 빠르게', count: 3 },
  { id: '60m', label: '1시간', desc: '추천 작품을 여유 있게', count: 5 },
  { id: 'free', label: '여유롭게', desc: '시간 제한 없이 충분히', count: 8 },
];

export const countForDuration = (d: VisitDuration) => DURATION_OPTIONS.find((o) => o.id === d)?.count ?? 5;

const REASON_PHRASE: Record<TasteId, string> = {
  vivid: '강렬한 색채',
  calm: '고요한 풍경',
  abstract: '추상적인 형태',
  soft: '부드러운 색조',
  emotion: '감정이 표현된 화면',
  portrait: '인물의 표정',
};

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** 평면도 거리 → 예상 이동 시간(분). 평면도 100 = 약 60m, 보행 속도 약 1m/s 가정 */
export const walkMinutes = (a: Point, b: Point) => Math.max(1, Math.round((distance(a, b) * 0.6) / 60));

/** 입구에서 시작하는 최근접 이웃 방식의 관람 순서 */
export function orderByRoute<T extends { artwork: Artwork }>(items: T[]): T[] {
  const rest = items.filter((i) => i.artwork.position);
  const noPos = items.filter((i) => !i.artwork.position);
  const ordered: T[] = [];
  let cur: Point = ENTRANCE;
  while (rest.length) {
    let best = 0;
    rest.forEach((r, idx) => {
      if (distance(cur, r.artwork.position!) < distance(cur, rest[best].artwork.position!)) best = idx;
    });
    const [next] = rest.splice(best, 1);
    ordered.push(next);
    cur = next.artwork.position!;
  }
  return [...ordered, ...noPos];
}

export function recommend(artworks: Artwork[], tastes: TasteId[], duration: VisitDuration): Recommendation[] {
  const scored = artworks
    .map((artwork) => {
      const matched = artwork.tags.filter((t) => tastes.includes(t));
      // 검수 완료 작품을 약간 우선한다 (설명 신뢰성)
      const score = matched.length * 10 + (artwork.reviewStatus === '검수 완료' ? 1 : 0);
      return { artwork, matched, score };
    })
    .sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, countForDuration(duration)).map(({ artwork, matched }) => {
    const keys = (matched.length ? matched : artwork.tags).slice(0, 2);
    const phrases = keys.map((k) => `‘${REASON_PHRASE[k]}’`);
    const reason = matched.length
      ? `당신이 좋아하는 ${phrases.join(', ')} 취향과 관련된 작품입니다.`
      : `${phrases.join(', ')}의 매력을 새롭게 경험해 볼 수 있는 작품입니다.`;
    return { artwork, reason, reasonShort: keys.map((k) => tasteLabel(k)).join(' · ') };
  });

  return orderByRoute(picked);
}
