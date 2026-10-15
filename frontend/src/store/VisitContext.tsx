// 한 번의 관람 세션 상태 (취향 → 시간 → 추천 → 경로 → 감상 반복 → 영수증)
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { tasteLabel } from '../data/mock';
import type { Exhibition, Reaction, Recommendation, TasteId, VisitDuration, VisitRecord } from '../types';
import { readJSON, today, uid, writeJSON } from '../utils/storage';

const VISIT_KEY = 'arti.visit';

interface VisitState {
  exhibition: Exhibition | null;
  tastes: TasteId[];
  duration: VisitDuration | null;
  recommendations: Recommendation[];
  /** 현재 감상(또는 다음 안내) 대상 작품 인덱스 */
  currentIndex: number;
  reactions: Record<string, Reaction>;
  /** 작품별 누적 감상 시간(ms) */
  viewTimes: Record<string, number>;
  viewedIds: string[];
  startedAt: number | null;
  /** 관람 종료 시 확정된 아트 영수증 */
  record: VisitRecord | null;
}

const initial: VisitState = {
  exhibition: null,
  tastes: [],
  duration: null,
  recommendations: [],
  currentIndex: 0,
  reactions: {},
  viewTimes: {},
  viewedIds: [],
  startedAt: null,
  record: null,
};

interface VisitValue extends VisitState {
  setExhibition: (e: Exhibition) => void;
  setTastes: (t: TasteId[]) => void;
  setDuration: (d: VisitDuration) => void;
  setRecommendations: (r: Recommendation[]) => void;
  startViewing: () => void;
  addViewTime: (artworkId: string, ms: number) => void;
  markViewed: (artworkId: string) => void;
  react: (artworkId: string, r: Reaction | null) => void;
  /** 다음 작품으로 진행. 남은 작품이 있으면 true */
  advance: () => boolean;
  /** 관람 종료: 아트 영수증을 확정한다 */
  finish: () => VisitRecord;
  reset: () => void;
}

const VisitContext = createContext<VisitValue | null>(null);

export function VisitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VisitState>(() => readJSON('session', VISIT_KEY, initial));

  useEffect(() => writeJSON('session', VISIT_KEY, state), [state]);

  const patch = useCallback((p: Partial<VisitState> | ((s: VisitState) => Partial<VisitState>)) => {
    setState((s) => ({ ...s, ...(typeof p === 'function' ? p(s) : p) }));
  }, []);

  const finish = useCallback((): VisitRecord => {
    const s = state;
    if (s.record) return s.record;
    const recs = s.recommendations;
    const longestId = Object.entries(s.viewTimes).sort((a, b) => b[1] - a[1])[0]?.[0];
    const likedTags = recs.filter((r) => s.reactions[r.artwork.id] === 'like').flatMap((r) => r.artwork.tags);
    const keywords = Array.from(new Set([...likedTags, ...s.tastes])).slice(0, 4).map(tasteLabel);
    const record: VisitRecord = {
      id: uid('h'),
      exhibitionTitle: s.exhibition?.title ?? '',
      venue: s.exhibition?.venue ?? '',
      date: today(),
      durationMin: s.startedAt ? Math.max(1, Math.round((Date.now() - s.startedAt) / 60000)) : 0,
      viewedCount: s.viewedIds.length,
      recommendedCount: recs.length,
      likeCount: Object.values(s.reactions).filter((r) => r === 'like').length,
      longestArtwork: recs.find((r) => r.artwork.id === longestId)?.artwork.title ?? '-',
      keywords,
      artworks: recs
        .filter((r) => s.viewedIds.includes(r.artwork.id))
        .map((r) => ({ title: r.artwork.title, artist: r.artwork.artist, reaction: s.reactions[r.artwork.id] })),
    };
    setState((prev) => ({ ...prev, record }));
    return record;
  }, [state]);

  const value = useMemo<VisitValue>(
    () => ({
      ...state,
      setExhibition: (exhibition) => patch({ exhibition }),
      setTastes: (tastes) => patch({ tastes }),
      setDuration: (duration) => patch({ duration }),
      setRecommendations: (recommendations) =>
        patch({ recommendations, currentIndex: 0, reactions: {}, viewTimes: {}, viewedIds: [], startedAt: null, record: null }),
      startViewing: () => patch((s) => ({ startedAt: s.startedAt ?? Date.now() })),
      addViewTime: (id, ms) => patch((s) => ({ viewTimes: { ...s.viewTimes, [id]: (s.viewTimes[id] ?? 0) + ms } })),
      markViewed: (id) => patch((s) => (s.viewedIds.includes(id) ? {} : { viewedIds: [...s.viewedIds, id] })),
      react: (id, r) =>
        patch((s) => {
          const reactions = { ...s.reactions };
          if (r) reactions[id] = r;
          else delete reactions[id];
          return { reactions };
        }),
      advance: () => {
        const hasNext = state.currentIndex + 1 < state.recommendations.length;
        if (hasNext) patch({ currentIndex: state.currentIndex + 1 });
        return hasNext;
      },
      finish,
      reset: () => setState({ ...initial }),
    }),
    [state, patch, finish],
  );

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error('useVisit must be used within VisitProvider');
  return ctx;
}
