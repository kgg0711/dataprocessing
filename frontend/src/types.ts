// ARTI 도메인 타입 정의

export type TasteId = 'vivid' | 'calm' | 'abstract' | 'soft' | 'emotion' | 'portrait';

export interface TasteOption {
  id: TasteId;
  label: string;
  /** 취향 카드에 그릴 예시 색 팔레트 */
  palette: string[];
}

export type ReviewStatus = '검수 대기' | '출처 확인' | '검수 완료';
export type ExhibitionStatus = '운영 중' | '준비 중' | '종료';

export interface Point {
  /** 평면도 좌표 (0~100) */
  x: number;
  y: number;
}

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Exhibition {
  id: string;
  title: string;
  subtitle: string;
  venue: string;
  startDate: string;
  endDate: string;
  status: ExhibitionStatus;
}

export interface Artwork {
  id: string;
  exhibitionId: string;
  title: string;
  artist: string;
  year: string;
  roomId: string;
  position: Point | null;
  tags: TasteId[];
  description: string;
  guidedLooking: string[];
  source: string;
  referenceUrl: string;
  reviewStatus: ReviewStatus;
  /** 작품 이미지 URL (없으면 팔레트 기반 플레이스홀더 렌더링) */
  imageUrl?: string;
  palette: string[];
  updatedAt: string;
}

export type VisitDuration = '30m' | '60m' | 'free';

export interface Recommendation {
  artwork: Artwork;
  reason: string;
  reasonShort: string;
}

export type Reaction = 'like' | 'dislike';

export interface VisitRecord {
  id: string;
  exhibitionTitle: string;
  venue: string;
  date: string;
  durationMin: number;
  viewedCount: number;
  recommendedCount: number;
  likeCount: number;
  longestArtwork: string;
  keywords: string[];
  artworks: { title: string; artist: string; reaction?: Reaction }[];
}

export interface User {
  id: string;
  email: string;
  nickname: string;
  tastes: TasteId[];
  createdAt: string;
  status: '정상' | '휴면';
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}
