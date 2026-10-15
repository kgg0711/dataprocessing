// A-02 관리자 대시보드: 전시·작품·검수 상태 요약
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { roomName } from '../../data/mock';
import type { Artwork, Exhibition } from '../../types';
import { AdminPageHead } from './AdminLayout';

export default function A02Dashboard() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    api.adminGetExhibitions().then(setExhibitions);
    api.getArtworks().then(setArtworks);
  }, []);

  const running = exhibitions.filter((e) => e.status === '운영 중').length;
  const reviewed = artworks.filter((a) => a.reviewStatus === '검수 완료').length;
  const located = artworks.filter((a) => a.position).length;
  const pending = artworks.length - reviewed;

  const recent = [...artworks].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  return (
    <>
      <AdminPageHead title="대시보드" desc="등록된 전시와 작품, 데이터 검수 상태를 한눈에 확인합니다." />
      <div className="stat-grid">
        <Stat label="운영 전시" value={running} sub={`전체 ${exhibitions.length}개`} to="/admin/exhibitions" />
        <Stat label="등록 작품" value={artworks.length} sub={`검수 완료 ${reviewed}`} to="/admin/artworks" />
        <Stat label="위치 등록" value={located} sub={`미등록 ${artworks.length - located}`} to="/admin/map" />
        <Stat label="검수 대기" value={pending} sub="출처 확인 필요" to="/admin/artworks?status=pending" warn={pending > 0} />
      </div>

      <h2 className="a-h2">최근 데이터 상태</h2>
      <div className="a-card">
        <table className="a-table">
          <thead>
            <tr><th>구분</th><th>이름</th><th>전시실</th><th>상태</th><th>수정일</th><th>담당</th></tr>
          </thead>
          <tbody>
            {recent.map((a) => (
              <tr key={a.id} className="clickable" onClick={() => navigate(`/admin/artworks/${a.id}`)}>
                <td>작품</td>
                <td>{a.title}</td>
                <td>{a.position ? roomName(a.roomId) : <span className="badge badge--warn">위치 미등록</span>}</td>
                <td><StatusBadge status={a.reviewStatus} /></td>
                <td>{a.updatedAt.slice(5).replace('-', '/')}</td>
                <td>관리자</td>
              </tr>
            ))}
            {exhibitions.map((e) => (
              <tr key={e.id} className="clickable" onClick={() => navigate('/admin/exhibitions')}>
                <td>전시</td>
                <td>{e.title}</td>
                <td>{e.venue}</td>
                <td><span className={`badge ${e.status === '운영 중' ? 'badge--ok' : ''}`}>{e.status}</span></td>
                <td>{e.startDate.slice(5).replace('-', '/')}</td>
                <td>관리자</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Stat({ label, value, sub, to, warn }: { label: string; value: number; sub: string; to: string; warn?: boolean }) {
  return (
    <Link to={to} className={`stat ${warn ? 'stat--warn' : ''}`}>
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
      <span className="stat__sub">{sub}</span>
    </Link>
  );
}

export function StatusBadge({ status }: { status: Artwork['reviewStatus'] }) {
  const cls = status === '검수 완료' ? 'badge--ok' : status === '출처 확인' ? 'badge--info' : 'badge--warn';
  return <span className={`badge ${cls}`}>{status}</span>;
}
