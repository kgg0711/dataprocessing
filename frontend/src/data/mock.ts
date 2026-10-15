// 화면 구조 검증용 목업 데이터.
// 실제 구현에서는 검증된 전시·작품 데이터(관리자 화면에서 등록)로 교체한다.
import type { Artwork, Exhibition, Room, TasteOption, User, VisitRecord } from '../types';

export const TASTE_OPTIONS: TasteOption[] = [
  { id: 'vivid', label: '강한 색감', palette: ['#d9eae3', '#7fb3a2', '#4c6b5e', '#c98f6b', '#efd9a0'] },
  { id: 'calm', label: '고요한 풍경', palette: ['#f2d6cc', '#d6574a', '#f0b84a', '#8e2b23', '#2f4a5a'] },
  { id: 'abstract', label: '추상적 형태', palette: ['#e8e2d8', '#8c6a4a', '#c99a5a', '#f6efe6', '#2c3550'] },
  { id: 'soft', label: '부드러운 색감', palette: ['#f2ead8', '#e8574e', '#2c3c58', '#e1ae2e', '#ee7b3a'] },
  { id: 'emotion', label: '감정 표현', palette: ['#f4e4d4', '#c2402f', '#1d2b45', '#e89a3c', '#7a2a2a'] },
  { id: 'portrait', label: '인물', palette: ['#efe6d9', '#3a3f5c', '#d9b07a', '#9c5a3c', '#f7f1e6'] },
];

export const tasteLabel = (id: string) => TASTE_OPTIONS.find((t) => t.id === id)?.label ?? id;

/** 2D 평면도의 전시실 구성 (0~100 좌표계) */
export const ROOMS: Room[] = [
  { id: 'r1', name: '1전시실', x: 4, y: 4, w: 36, h: 42 },
  { id: 'r2', name: '2전시실', x: 46, y: 4, w: 50, h: 42 },
  { id: 'r3', name: '3전시실', x: 4, y: 52, w: 44, h: 40 },
  { id: 'r4', name: '4전시실', x: 54, y: 52, w: 42, h: 40 },
];

/** 전시 입구 위치 (QR 진입 지점) */
export const ENTRANCE = { x: 50, y: 98 };

export const roomName = (id: string) => ROOMS.find((r) => r.id === id)?.name ?? '-';

export const EXHIBITIONS: Exhibition[] = [
  {
    id: 'ex-mvp',
    title: '미술 초보자를 위한 맞춤형 관람',
    subtitle: '빛과 색, 감정으로 만나는 근현대 회화',
    venue: 'ARTI 갤러리 본관',
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: '운영 중',
  },
  {
    id: 'ex-next',
    title: '형태의 실험',
    subtitle: '추상 회화의 시작',
    venue: 'ARTI 갤러리 별관',
    startDate: '2027-01-15',
    endDate: '2027-04-30',
    status: '준비 중',
  },
];

const base = { exhibitionId: 'ex-mvp', referenceUrl: '', updatedAt: '2026-10-06' } as const;

export const ARTWORKS: Artwork[] = [
  {
    ...base,
    id: 'a1',
    title: '별이 빛나는 밤',
    artist: '빈센트 반 고흐',
    year: '1889',
    roomId: 'r2',
    position: { x: 62, y: 22 },
    tags: ['vivid', 'emotion', 'calm'],
    description:
      '고흐는 생레미의 요양원 창밖으로 보이던 밤 풍경을 바탕으로 이 작품을 그렸습니다. 소용돌이치는 하늘과 크게 빛나는 별, 화면을 가로지르는 사이프러스 나무가 그의 내면 세계를 강렬하게 드러냅니다.',
    guidedLooking: [
      '먼저 하늘의 소용돌이를 눈으로 따라가 보세요. 어디에서 시작해 어디로 흘러가나요?',
      '별 주변의 붓질 방향을 살펴보세요. 짧은 붓질이 어떤 움직임을 만드나요?',
      '왼쪽의 어두운 사이프러스 나무와 조용한 마을을 비교해 보세요.',
    ],
    source: '전시 도록 및 소장처 공개 자료',
    reviewStatus: '검수 완료',
    palette: ['#1e3a78', '#3b6cb5', '#f2d34f', '#0f1d3b', '#8fb4d9'],
  },
  {
    ...base,
    id: 'a2',
    title: '수련',
    artist: '클로드 모네',
    year: '1906',
    roomId: 'r1',
    position: { x: 18, y: 26 },
    tags: ['calm', 'soft'],
    description:
      '모네는 지베르니 정원의 연못을 수백 번 그렸습니다. 수면에 비친 하늘과 떠 있는 수련이 경계 없이 섞이며, 시간과 빛에 따라 달라지는 순간의 인상을 담고 있습니다.',
    guidedLooking: [
      '수면과 하늘의 경계가 어디인지 찾아보세요.',
      '가까이 다가갔다가 멀어지며 수련이 어떻게 보이는지 비교해 보세요.',
      '화면에서 가장 밝은 부분은 어디인가요?',
    ],
    source: '소장처 공개 작품 해설',
    reviewStatus: '출처 확인',
    palette: ['#d9eae3', '#7fb3a2', '#4c6b5e', '#c98f6b', '#efd9a0'],
  },
  {
    ...base,
    id: 'a3',
    title: '붉은 방',
    artist: '앙리 마티스',
    year: '1908',
    roomId: 'r3',
    position: { x: 30, y: 72 },
    tags: ['vivid', 'abstract'],
    description:
      '벽과 식탁보가 같은 붉은색과 무늬로 이어지면서 공간의 깊이가 사라지고 평면적인 장식처럼 보입니다. 마티스는 색 자체가 화면을 이끄는 힘을 탐구했습니다.',
    guidedLooking: [
      '벽과 식탁의 경계를 찾아보세요. 쉽게 구분되나요?',
      '창밖 풍경의 색과 방 안의 색을 비교해 보세요.',
      '무늬가 반복되는 리듬을 눈으로 따라가 보세요.',
    ],
    source: '전시 도록',
    reviewStatus: '검수 완료',
    palette: ['#f2d6cc', '#d6574a', '#f0b84a', '#8e2b23', '#2f4a5a'],
  },
  {
    ...base,
    id: 'a4',
    title: '풍경 연구',
    artist: '전시 작품',
    year: '연도 미상',
    roomId: 'r3',
    position: { x: 16, y: 82 },
    tags: ['soft', 'calm'],
    description:
      '부드러운 갈색과 크림색이 겹쳐진 풍경 습작입니다. 형태를 단순화하여 색면의 조화와 따뜻한 분위기를 느낄 수 있도록 구성되었습니다.',
    guidedLooking: [
      '가장 먼저 눈에 들어오는 색은 무엇인가요?',
      '둥근 형태와 네모난 형태가 어떻게 배치되어 있는지 살펴보세요.',
    ],
    source: '검수 필요',
    reviewStatus: '검수 대기',
    palette: ['#e8e2d8', '#8c6a4a', '#c99a5a', '#f6efe6', '#2c3550'],
  },
  {
    ...base,
    id: 'a5',
    title: '인상, 해돋이',
    artist: '클로드 모네',
    year: '1872',
    roomId: 'r1',
    position: { x: 30, y: 14 },
    tags: ['calm', 'soft', 'emotion'],
    description:
      '르아브르 항구의 아침 풍경을 빠른 붓질로 그린 작품으로, “인상주의”라는 이름이 이 작품의 제목에서 비롯되었습니다. 안개 속 주황빛 해가 화면의 중심을 잡아 줍니다.',
    guidedLooking: [
      '해의 주황색과 주변 물빛의 색을 비교해 보세요.',
      '배와 사람의 형태는 얼마나 자세히 그려져 있나요?',
    ],
    source: '소장처 공개 작품 해설',
    reviewStatus: '검수 완료',
    palette: ['#9fb3bf', '#5e7488', '#e8743b', '#2e3d4f', '#c6d0d4'],
  },
  {
    ...base,
    id: 'a6',
    title: '절규',
    artist: '에드바르 뭉크',
    year: '1893',
    roomId: 'r2',
    position: { x: 86, y: 34 },
    tags: ['emotion', 'vivid', 'portrait'],
    description:
      '붉게 물든 하늘 아래 귀를 막고 선 인물이 불안과 공포를 온몸으로 표현합니다. 일렁이는 선이 인물과 풍경을 하나로 묶어 감정을 화면 전체로 퍼뜨립니다.',
    guidedLooking: [
      '하늘의 곡선과 인물의 곡선이 어떻게 닮아 있는지 찾아보세요.',
      '다리 위의 직선과 풍경의 곡선이 주는 느낌을 비교해 보세요.',
    ],
    source: '전시 도록',
    reviewStatus: '검수 완료',
    palette: ['#e4572e', '#f3a712', '#1b3a4b', '#7a9e9f', '#2b2d42'],
  },
  {
    ...base,
    id: 'a7',
    title: '구성 VIII',
    artist: '바실리 칸딘스키',
    year: '1923',
    roomId: 'r4',
    position: { x: 70, y: 66 },
    tags: ['abstract', 'vivid'],
    description:
      '원, 삼각형, 직선이 음악처럼 리듬을 이루는 기하학적 추상 작품입니다. 칸딘스키는 색과 형태가 소리처럼 감정을 불러일으킬 수 있다고 믿었습니다.',
    guidedLooking: [
      '가장 큰 원을 찾고, 그 주변에 어떤 형태가 모여 있는지 보세요.',
      '이 그림이 음악이라면 어떤 소리가 날지 상상해 보세요.',
    ],
    source: '출처 확인 중',
    reviewStatus: '출처 확인',
    palette: ['#f1ead9', '#1f2a44', '#d94f3a', '#e8b33c', '#5a8fb8'],
  },
  {
    ...base,
    id: 'a8',
    title: '진주 귀걸이를 한 소녀',
    artist: '요하네스 페르메이르',
    year: '1665년경',
    roomId: 'r4',
    position: { x: 84, y: 82 },
    tags: ['portrait', 'soft', 'calm'],
    description:
      '어두운 배경 속에서 고개를 돌려 바라보는 소녀를 그린 작품입니다. 빛을 받은 진주와 입술, 눈동자의 작은 하이라이트가 생동감을 줍니다.',
    guidedLooking: [
      '빛이 어느 방향에서 들어오는지 찾아보세요.',
      '진주 귀걸이에서 가장 밝은 점은 어디인가요?',
    ],
    source: '소장처 공개 작품 해설',
    reviewStatus: '검수 완료',
    palette: ['#14161c', '#2f4c7a', '#e2c26b', '#c99d7a', '#f4ead6'],
  },
  {
    ...base,
    id: 'a9',
    title: '해바라기',
    artist: '빈센트 반 고흐',
    year: '1888',
    roomId: 'r2',
    position: { x: 54, y: 36 },
    tags: ['vivid', 'emotion'],
    description:
      '노란색의 다양한 변주로 채워진 정물화입니다. 피어나고 시들어 가는 해바라기를 함께 그려 생명의 흐름을 담아냈습니다.',
    guidedLooking: [
      '노란색이 몇 가지나 쓰였는지 세어 보세요.',
      '활짝 핀 꽃과 시든 꽃을 각각 찾아보세요.',
    ],
    source: '전시 도록',
    reviewStatus: '검수 완료',
    palette: ['#f2c94c', '#d9a22b', '#7a5c1e', '#5f8f6a', '#f6e7b0'],
  },
  {
    ...base,
    id: 'a10',
    title: '빨강, 파랑, 노랑의 구성',
    artist: '피트 몬드리안',
    year: '1930',
    roomId: 'r4',
    position: { x: 62, y: 84 },
    tags: ['abstract'],
    description:
      '검은 수직·수평선과 삼원색만으로 화면의 균형을 만든 작품입니다. 몬드리안은 가장 단순한 요소로 보편적인 조화를 표현하고자 했습니다.',
    guidedLooking: [
      '가장 큰 색면은 무엇이고, 나머지와 어떤 균형을 이루나요?',
      '검은 선의 굵기가 모두 같은지 확인해 보세요.',
    ],
    source: '전시 도록',
    reviewStatus: '검수 완료',
    palette: ['#f4f1ea', '#d32f2f', '#1e4fa3', '#f4c20d', '#111111'],
  },
];

export interface StoredUser extends User {
  password: string;
  history: VisitRecord[];
}

/** 데모 계정: demo@arti.kr / arti1234 */
export const SEED_USERS: StoredUser[] = [
  {
    id: 'u1',
    email: 'demo@arti.kr',
    password: 'arti1234',
    nickname: '아티',
    tastes: ['vivid', 'emotion', 'calm'],
    createdAt: '2026-09-12',
    status: '정상',
    history: [
      {
        id: 'h1',
        exhibitionTitle: '미술 초보자를 위한 맞춤형 관람',
        venue: 'ARTI 갤러리 본관',
        date: '2026-10-07',
        durationMin: 58,
        viewedCount: 5,
        recommendedCount: 5,
        likeCount: 3,
        longestArtwork: '별이 빛나는 밤',
        keywords: ['강렬한 색채', '감정 표현', '풍경'],
        artworks: [
          { title: '별이 빛나는 밤', artist: '빈센트 반 고흐', reaction: 'like' },
          { title: '수련', artist: '클로드 모네', reaction: 'like' },
          { title: '붉은 방', artist: '앙리 마티스' },
          { title: '절규', artist: '에드바르 뭉크', reaction: 'like' },
          { title: '풍경 연구', artist: '전시 작품', reaction: 'dislike' },
        ],
      },
      {
        id: 'h2',
        exhibitionTitle: '빛의 정원',
        venue: '시립미술관 2층',
        date: '2026-09-20',
        durationMin: 32,
        viewedCount: 3,
        recommendedCount: 3,
        likeCount: 1,
        longestArtwork: '인상, 해돋이',
        keywords: ['고요한 풍경', '부드러운 색감'],
        artworks: [
          { title: '인상, 해돋이', artist: '클로드 모네', reaction: 'like' },
          { title: '수련', artist: '클로드 모네' },
          { title: '진주 귀걸이를 한 소녀', artist: '요하네스 페르메이르' },
        ],
      },
    ],
  },
  {
    id: 'u2',
    email: 'museum.lover@example.com',
    password: 'test1234',
    nickname: '그림산책',
    tastes: ['abstract'],
    createdAt: '2026-09-28',
    status: '정상',
    history: [],
  },
  {
    id: 'u3',
    email: 'sleepy@example.com',
    password: 'test1234',
    nickname: '',
    tastes: [],
    createdAt: '2026-08-02',
    status: '휴면',
    history: [],
  },
];

/** 관리자 데모 계정 */
export const ADMIN_ACCOUNT = { id: 'admin', password: 'admin1234' };
