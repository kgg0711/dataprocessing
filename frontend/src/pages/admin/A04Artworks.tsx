// A-04 작품 등록·수정: 작품 정보·출처·참고자료·검수 상태 관리
// - /admin/artworks       : 작품 목록 (전시·검수 상태 필터)
// - /admin/artworks/new   : 신규 등록
// - /admin/artworks/:id   : 수정
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as api from '../../api';
import ArtImage from '../../components/ArtImage';
import { ROOMS, TASTE_OPTIONS, roomName } from '../../data/mock';
import type { Artwork, Exhibition, ReviewStatus, TasteId } from '../../types';
import { AdminPageHead } from './AdminLayout';
import { StatusBadge } from './A02Dashboard';

const REVIEW: ReviewStatus[] = ['검수 대기', '출처 확인', '검수 완료'];

export default function A04Artworks() {
  const { artworkId } = useParams();
  return artworkId ? <ArtworkForm artworkId={artworkId} /> : <ArtworkList />;
}

function ArtworkList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const exFilter = params.get('exhibition') ?? '';
  const stFilter = params.get('status') ?? '';

  useEffect(() => {
    api.getArtworks().then(setArtworks);
    api.adminGetExhibitions().then(setExhibitions);
  }, []);

  const shown = artworks.filter(
    (a) =>
      (!exFilter || a.exhibitionId === exFilter) &&
      (!stFilter || (stFilter === 'pending' ? a.reviewStatus !== '검수 완료' : a.reviewStatus === stFilter)),
  );

  const setFilter = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v);
    else p.delete(k);
    setParams(p, { replace: true });
  };

  return (
    <>
      <AdminPageHead
        title="작품 관리"
        desc="작품 정보와 설명, 출처·참고자료, 검수 상태를 함께 관리합니다."
        actions={<button className="a-btn a-btn--primary" onClick={() => navigate(`/admin/artworks/new${exFilter ? `?exhibition=${exFilter}` : ''}`)}>+ 작품 등록</button>}
      />
      <div className="a-filters">
        <select value={exFilter} onChange={(e) => setFilter('exhibition', e.target.value)} aria-label="전시 필터">
          <option value="">전체 전시</option>
          {exhibitions.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <select value={stFilter} onChange={(e) => setFilter('status', e.target.value)} aria-label="검수 상태 필터">
          <option value="">전체 검수 상태</option>
          <option value="pending">검수 미완료</option>
          {REVIEW.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="muted small">{shown.length}건</span>
      </div>
      <div className="a-card">
        <table className="a-table">
          <thead>
            <tr><th /><th>작품명</th><th>작가</th><th>제작연도</th><th>전시실</th><th>검수 상태</th><th>수정일</th></tr>
          </thead>
          <tbody>
            {shown.map((a) => (
              <tr key={a.id} className="clickable" onClick={() => navigate(`/admin/artworks/${a.id}`)}>
                <td><ArtImage className="a-thumb" seed={a.id} palette={a.palette} imageUrl={a.imageUrl} alt="" /></td>
                <td><strong>{a.title}</strong></td>
                <td>{a.artist}</td>
                <td>{a.year}</td>
                <td>{a.position ? roomName(a.roomId) : <span className="badge badge--warn">위치 미등록</span>}</td>
                <td><StatusBadge status={a.reviewStatus} /></td>
                <td>{a.updatedAt}</td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={7} className="center muted">조건에 맞는 작품이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

const blank = (exhibitionId: string): Artwork => ({
  id: '',
  exhibitionId,
  title: '',
  artist: '',
  year: '',
  roomId: ROOMS[0].id,
  position: null,
  tags: [],
  description: '',
  guidedLooking: [],
  source: '',
  referenceUrl: '',
  reviewStatus: '검수 대기',
  imageUrl: '',
  palette: ['#ece7df', '#b8a993', '#6d7f8f', '#d9b48f', '#3f4a59'],
  updatedAt: '',
});

function ArtworkForm({ artworkId }: { artworkId: string }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const exParam = params.get('exhibition');
  const isNew = artworkId === 'new';
  const [form, setForm] = useState<Artwork | null>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [guided, setGuided] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.adminGetExhibitions().then((list) => {
      setExhibitions(list);
      if (isNew) {
        setForm(blank(exParam ?? list[0]?.id ?? ''));
        setGuided('');
      }
    });
    if (!isNew)
      api.adminGetArtwork(artworkId).then((a) => {
        setForm(a ?? null);
        setGuided(a?.guidedLooking.join('\n') ?? '');
      });
  }, [artworkId, isNew, exParam]);

  if (!form) return <p className="muted">불러오는 중…</p>;

  const set = <K extends keyof Artwork>(k: K, v: Artwork[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));
  const toggleTag = (t: TasteId) => set('tags', form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    const saved = await api.adminSaveArtwork({
      ...form,
      guidedLooking: guided.split('\n').map((s) => s.trim()).filter(Boolean),
    });
    setMsg('저장되었습니다.');
    setTimeout(() => setMsg(''), 2000);
    if (isNew) navigate(`/admin/artworks/${saved.id}`, { replace: true });
    else setForm(saved);
  };

  return (
    <form onSubmit={onSave}>
      <AdminPageHead
        title={isNew ? '작품 등록' : '작품 등록·수정'}
        desc="작품 정보와 설명, 출처·참고자료, 검수 상태를 함께 관리합니다."
        actions={
          <>
            <Link className="a-btn" to="/admin/artworks">목록</Link>
            {!isNew && <Link className="a-btn" to={`/admin/map?artwork=${form.id}`}>위치·지도 관리</Link>}
          </>
        }
      />
      <div className="a-form-grid">
        <section className="a-card">
          <h2 className="a-h3">기본 정보</h2>
          <label className="a-field"><span>작품명</span>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} required />
          </label>
          <label className="a-field"><span>작가</span>
            <input value={form.artist} onChange={(e) => set('artist', e.target.value)} required />
          </label>
          <label className="a-field"><span>제작연도</span>
            <input value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="예) 1889" />
          </label>
          <div className="a-grid-2">
            <label className="a-field"><span>전시</span>
              <select value={form.exhibitionId} onChange={(e) => set('exhibitionId', e.target.value)}>
                {exhibitions.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
              </select>
            </label>
            <label className="a-field"><span>전시실 / 위치</span>
              <select value={form.roomId} onChange={(e) => set('roomId', e.target.value)}>
                {ROOMS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </label>
          </div>
          <label className="a-field"><span>작품 이미지 URL</span>
            <input value={form.imageUrl ?? ''} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://… (비우면 플레이스홀더 표시)" />
          </label>
          <ArtImage className="a-preview" seed={form.id || 'new'} palette={form.palette} imageUrl={form.imageUrl || undefined} alt="작품 이미지 미리보기" />
          <div className="a-field">
            <span>취향 태그 <em className="muted">(추천에 사용)</em></span>
            <div className="a-tags">
              {TASTE_OPTIONS.map((t) => (
                <button type="button" key={t.id} className={`a-tag ${form.tags.includes(t.id) ? 'is-on' : ''}`} onClick={() => toggleTag(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="a-card">
          <h2 className="a-h3">설명 및 검수</h2>
          <label className="a-field"><span>작품 해설</span>
            <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </label>
          <label className="a-field"><span>Guided Looking 질문 <em className="muted">(한 줄에 하나)</em></span>
            <textarea rows={4} value={guided} onChange={(e) => setGuided(e.target.value)} />
          </label>
          <label className="a-field"><span>출처</span>
            <input value={form.source} onChange={(e) => set('source', e.target.value)} />
          </label>
          <label className="a-field"><span>참고자료 URL</span>
            <input type="url" value={form.referenceUrl} onChange={(e) => set('referenceUrl', e.target.value)} placeholder="https://" />
          </label>
          <label className="a-field"><span>검수 상태</span>
            <select value={form.reviewStatus} onChange={(e) => set('reviewStatus', e.target.value as ReviewStatus)}>
              {REVIEW.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <p className="note">작품 해설과 AI 응답에 사용할 데이터의 신뢰성을 위해 출처·참고자료·검수 상태를 함께 관리합니다.</p>
          <div className="a-save">
            {msg && <span className="ok">{msg}</span>}
            <button type="submit" className="a-btn a-btn--primary a-btn--lg">저장</button>
          </div>
        </section>
      </div>
    </form>
  );
}
