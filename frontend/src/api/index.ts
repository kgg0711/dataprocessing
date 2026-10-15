// 목업 API 계층.
// 모든 화면은 이 모듈의 비동기 함수만 호출하므로, 백엔드가 준비되면
// 각 함수 내부를 fetch('/api/...') 호출로 교체하면 된다.
import { ADMIN_ACCOUNT, ARTWORKS, EXHIBITIONS, SEED_USERS, type StoredUser } from '../data/mock';
import type { Artwork, ChatMessage, Exhibition, Point, TasteId, User, VisitRecord } from '../types';
import { readJSON, today, uid, writeJSON } from '../utils/storage';

const DB_KEY = 'arti.db.v1';

interface DB {
  exhibitions: Exhibition[];
  artworks: Artwork[];
  users: StoredUser[];
  resetTokens: Record<string, string>; // token -> email
}

function load(): DB {
  return readJSON<DB>('local', DB_KEY, {
    exhibitions: EXHIBITIONS,
    artworks: ARTWORKS,
    users: SEED_USERS,
    resetTokens: {},
  });
}

function save(db: DB) {
  writeJSON('local', DB_KEY, db);
}

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const toPublicUser = ({ password: _p, history: _h, ...u }: StoredUser): User => u;

export class ApiError extends Error {}

/* ───────────── 전시 / 작품 (사용자) ───────────── */

export async function getCurrentExhibition(): Promise<Exhibition> {
  await wait(100);
  const db = load();
  return db.exhibitions.find((e) => e.status === '운영 중') ?? db.exhibitions[0];
}

export async function getArtworks(exhibitionId?: string): Promise<Artwork[]> {
  await wait(100);
  const all = load().artworks;
  return exhibitionId ? all.filter((a) => a.exhibitionId === exhibitionId) : all;
}

/* ───────────── 인증 (사용자) ───────────── */

export async function login(email: string, password: string): Promise<User> {
  await wait();
  const u = load().users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!u || u.password !== password) throw new ApiError('이메일 또는 비밀번호가 올바르지 않습니다.');
  return toPublicUser(u);
}

export async function signup(email: string, password: string, nickname: string): Promise<User> {
  await wait();
  const db = load();
  if (db.users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase()))
    throw new ApiError('이미 가입된 이메일입니다.');
  const u: StoredUser = {
    id: uid('u'),
    email: email.trim(),
    password,
    nickname: nickname.trim(),
    tastes: [],
    createdAt: today(),
    status: '정상',
    history: [],
  };
  db.users.push(u);
  save(db);
  return toPublicUser(u);
}

export async function saveTastes(userId: string, tastes: TasteId[]): Promise<void> {
  const db = load();
  const u = db.users.find((x) => x.id === userId);
  if (u) {
    u.tastes = tastes;
    save(db);
  }
}

/** 비밀번호 재설정 링크 요청. 데모에서는 발송 대신 링크 토큰을 반환한다. */
export async function requestPasswordReset(email: string): Promise<string | null> {
  await wait();
  const db = load();
  const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  // 보안상 가입 여부와 무관하게 동일한 안내를 보여주므로 화면에는 토큰 존재 여부를 드러내지 않는다
  if (!u) return null;
  const token = uid('reset');
  db.resetTokens[token] = u.email;
  save(db);
  return token;
}

export async function verifyResetToken(token: string): Promise<boolean> {
  await wait(100);
  return Boolean(load().resetTokens[token]);
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await wait();
  const db = load();
  const email = db.resetTokens[token];
  if (!email) throw new ApiError('만료되었거나 유효하지 않은 링크입니다.');
  const u = db.users.find((x) => x.email === email);
  if (u) u.password = password;
  delete db.resetTokens[token];
  save(db);
}

/* ───────────── 관람 기록 ───────────── */

export async function saveVisitRecord(userId: string, record: VisitRecord): Promise<void> {
  const db = load();
  const u = db.users.find((x) => x.id === userId);
  if (u && !u.history.some((h) => h.id === record.id)) {
    u.history.unshift(record);
    save(db);
  }
}

export async function getVisitHistory(userId: string): Promise<VisitRecord[]> {
  await wait(150);
  return load().users.find((x) => x.id === userId)?.history ?? [];
}

/* ───────────── AI ───────────── */

/**
 * 작품 관련 AI 응답 (목업).
 * 실제 구현에서는 검수된 작품 해설·참고자료를 근거(RAG)로 LLM 응답을 생성하는 백엔드 API를 호출한다.
 */
export async function askAI(artwork: Artwork, question: string, _history: ChatMessage[]): Promise<string> {
  await wait(700);
  const q = question.replace(/\s/g, '');
  if (/색|컬러|노랑|파랑|빨강/.test(q))
    return `${artwork.artist}은(는) 이 작품에서 색을 감정을 전달하는 도구로 사용했어요. 실제 작품 앞에서 가장 밝은 색과 가장 어두운 색이 어디에 놓였는지 찾아보세요. 두 색이 맞닿는 부분에서 화면의 긴장감이 생겨납니다.`;
  if (/먼저|어디|순서|보면/.test(q))
    return `${artwork.guidedLooking[0]} 그다음 한 걸음 물러서서 전체 구도를 보면 처음과 다른 인상을 받을 수 있어요.`;
  if (/작가|누구|화가/.test(q))
    return `${artwork.artist}의 ${artwork.year} 작품입니다. ${artwork.description.split('.')[0]}.`;
  if (/왜|이유|의미/.test(q))
    return `${artwork.description} 정답이 정해진 감상은 없으니, 작품을 보며 떠오른 느낌을 그대로 간직해 보세요.`;
  return `좋은 질문이에요. 「${artwork.title}」은(는) ${artwork.description.split('.')[0]}. 작품을 보면서 ${artwork.guidedLooking[1] ?? artwork.guidedLooking[0]}`;
}

/* ───────────── 관리자 ───────────── */

export async function adminLogin(id: string, password: string): Promise<void> {
  await wait();
  if (id !== ADMIN_ACCOUNT.id || password !== ADMIN_ACCOUNT.password)
    throw new ApiError('관리자 ID 또는 비밀번호가 올바르지 않습니다.');
}

export async function adminGetExhibitions(): Promise<Exhibition[]> {
  await wait(100);
  return load().exhibitions;
}

export async function adminSaveExhibition(ex: Exhibition): Promise<Exhibition> {
  await wait();
  const db = load();
  const saved = ex.id ? ex : { ...ex, id: uid('ex') };
  const idx = db.exhibitions.findIndex((e) => e.id === saved.id);
  if (idx >= 0) db.exhibitions[idx] = saved;
  else db.exhibitions.push(saved);
  save(db);
  return saved;
}

export async function adminGetArtwork(id: string): Promise<Artwork | undefined> {
  await wait(100);
  return load().artworks.find((a) => a.id === id);
}

export async function adminSaveArtwork(a: Artwork): Promise<Artwork> {
  await wait();
  const db = load();
  const saved: Artwork = { ...a, id: a.id || uid('a'), updatedAt: today() };
  const idx = db.artworks.findIndex((x) => x.id === saved.id);
  if (idx >= 0) db.artworks[idx] = saved;
  else db.artworks.push(saved);
  save(db);
  return saved;
}

export async function adminSetArtworkPosition(id: string, roomId: string, position: Point): Promise<void> {
  const db = load();
  const a = db.artworks.find((x) => x.id === id);
  if (a) {
    a.roomId = roomId;
    a.position = position;
    a.updatedAt = today();
    save(db);
  }
}

export interface MemberSummary extends User {
  visitCount: number;
  lastVisit: string | null;
  history: VisitRecord[];
}

export async function adminGetMembers(query = ''): Promise<MemberSummary[]> {
  await wait(150);
  const q = query.trim().toLowerCase();
  return load()
    .users.filter((u) => !q || u.email.toLowerCase().includes(q) || u.nickname.toLowerCase().includes(q))
    .map((u) => ({
      ...toPublicUser(u),
      visitCount: u.history.length,
      lastVisit: u.history[0]?.date ?? null,
      history: u.history,
    }));
}

/** 데모 데이터 초기화 */
export function resetDemoData() {
  writeJSON('local', DB_KEY, null);
}
