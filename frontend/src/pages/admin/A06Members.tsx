// A-06 회원 조회: 회원 기본 정보·관람 기록 조회 (우선순위 낮음)
import { useEffect, useState, type FormEvent } from 'react';
import * as api from '../../api';
import { tasteLabel } from '../../data/mock';
import { AdminPageHead } from './AdminLayout';

export default function A06Members() {
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<api.MemberSummary[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const search = (q = query) => api.adminGetMembers(q).then(setMembers);
  useEffect(() => {
    search('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    search();
  };

  const detail = members.find((m) => m.id === selected);

  return (
    <>
      <AdminPageHead title="회원 조회" desc="로그인 사용자의 기본 정보와 저장된 관람 기록을 조회합니다." />
      <form className="a-filters" onSubmit={onSearch}>
        <input className="a-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이메일 또는 닉네임 검색" />
        <button className="a-btn a-btn--primary" type="submit">검색</button>
        <span className="muted small">{members.length}명</span>
      </form>
      <div className={`a-members ${detail ? 'has-detail' : ''}`}>
        <div className="a-card">
          <table className="a-table">
            <thead>
              <tr><th>회원 ID</th><th>닉네임</th><th>가입일</th><th>관람 횟수</th><th>최근 관람일</th><th>계정 상태</th></tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className={`clickable ${m.id === selected ? 'is-selected' : ''}`} onClick={() => setSelected(m.id)}>
                  <td>{m.email}</td>
                  <td>{m.nickname || <span className="muted">-</span>}</td>
                  <td>{m.createdAt}</td>
                  <td>{m.visitCount}회</td>
                  <td>{m.lastVisit ?? '-'}</td>
                  <td><span className={`badge ${m.status === '정상' ? 'badge--ok' : ''}`}>{m.status}</span></td>
                </tr>
              ))}
              {members.length === 0 && <tr><td colSpan={6} className="center muted">검색 결과가 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>

        {detail && (
          <aside className="a-card">
            <div className="row-between">
              <h2 className="a-h3">{detail.nickname || detail.email}</h2>
              <button className="link small" onClick={() => setSelected(null)}>닫기</button>
            </div>
            <p className="muted small">{detail.email} · 가입 {detail.createdAt}</p>
            <p className="a-label">저장 취향</p>
            <div className="a-tags">
              {detail.tastes.length ? detail.tastes.map((t) => <span key={t} className="a-tag is-on">{tasteLabel(t)}</span>) : <span className="muted small">없음</span>}
            </div>
            <p className="a-label">관람 기록</p>
            <ul className="plain-list a-history">
              {detail.history.map((h) => (
                <li key={h.id}>
                  <strong>{h.date}</strong> {h.exhibitionTitle}
                  <br />
                  <span className="muted small">작품 {h.viewedCount}점 · {h.durationMin}분 · 👍 {h.likeCount} · {h.keywords.join(', ')}</span>
                </li>
              ))}
              {detail.history.length === 0 && <li className="muted small">관람 기록이 없습니다.</li>}
            </ul>
          </aside>
        )}
      </div>
    </>
  );
}
