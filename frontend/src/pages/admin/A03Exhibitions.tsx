// A-03 전시 관리: 전시 등록·수정 및 운영 상태 관리
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import type { Artwork, Exhibition, ExhibitionStatus } from '../../types';
import { AdminPageHead } from './AdminLayout';

const EMPTY: Exhibition = { id: '', title: '', subtitle: '', venue: '', startDate: '', endDate: '', status: '준비 중' };
const STATUSES: ExhibitionStatus[] = ['운영 중', '준비 중', '종료'];

export default function A03Exhibitions() {
  const navigate = useNavigate();
  const [list, setList] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [editing, setEditing] = useState<Exhibition | null>(null);

  const reload = () => {
    api.adminGetExhibitions().then(setList);
    api.getArtworks().then(setArtworks);
  };
  useEffect(reload, []);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await api.adminSaveExhibition(editing);
    setEditing(null);
    reload();
  };

  const set = <K extends keyof Exhibition>(k: K, v: Exhibition[K]) => setEditing((x) => (x ? { ...x, [k]: v } : x));

  return (
    <>
      <AdminPageHead
        title="전시 관리"
        desc="MVP 대상 전시의 기본 정보와 운영 상태, 전시별 작품 구성을 관리합니다."
        actions={<button className="a-btn a-btn--primary" onClick={() => setEditing({ ...EMPTY })}>+ 전시 등록</button>}
      />
      <div className="a-card">
        <table className="a-table">
          <thead>
            <tr><th>전시명</th><th>기간</th><th>장소</th><th>작품 수</th><th>운영 상태</th><th /></tr>
          </thead>
          <tbody>
            {list.map((ex) => (
              <tr key={ex.id}>
                <td><strong>{ex.title}</strong><br /><span className="muted small">{ex.subtitle}</span></td>
                <td>{ex.startDate} ~ {ex.endDate}</td>
                <td>{ex.venue}</td>
                <td>{artworks.filter((a) => a.exhibitionId === ex.id).length}</td>
                <td><span className={`badge ${ex.status === '운영 중' ? 'badge--ok' : ex.status === '종료' ? '' : 'badge--info'}`}>{ex.status}</span></td>
                <td className="a-table__actions">
                  <button className="a-btn" onClick={() => setEditing(ex)}>수정</button>
                  <button className="a-btn" onClick={() => navigate(`/admin/artworks?exhibition=${ex.id}`)}>작품 관리</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal" role="dialog" aria-modal onClick={() => setEditing(null)}>
          <form className="modal__panel a-card" onSubmit={onSave} onClick={(e) => e.stopPropagation()}>
            <h2 className="a-h2">{editing.id ? '전시 수정' : '전시 등록'}</h2>
            <label className="a-field"><span>전시명</span>
              <input value={editing.title} onChange={(e) => set('title', e.target.value)} required />
            </label>
            <label className="a-field"><span>부제</span>
              <input value={editing.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
            </label>
            <label className="a-field"><span>장소</span>
              <input value={editing.venue} onChange={(e) => set('venue', e.target.value)} required />
            </label>
            <div className="a-grid-2">
              <label className="a-field"><span>시작일</span>
                <input type="date" value={editing.startDate} onChange={(e) => set('startDate', e.target.value)} required />
              </label>
              <label className="a-field"><span>종료일</span>
                <input type="date" value={editing.endDate} min={editing.startDate} onChange={(e) => set('endDate', e.target.value)} required />
              </label>
            </div>
            <label className="a-field"><span>운영 상태</span>
              <select value={editing.status} onChange={(e) => set('status', e.target.value as ExhibitionStatus)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <div className="modal__actions">
              <button type="button" className="a-btn" onClick={() => setEditing(null)}>취소</button>
              <button type="submit" className="a-btn a-btn--primary">저장</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
