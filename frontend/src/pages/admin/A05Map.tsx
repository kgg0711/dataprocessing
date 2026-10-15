// A-05 위치·지도 관리: 2D 평면도와 작품 위치 정보 관리
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as api from '../../api';
import FloorMap, { type MapMarker } from '../../components/FloorMap';
import { roomName } from '../../data/mock';
import type { Artwork, Exhibition, Point } from '../../types';
import { AdminPageHead } from './AdminLayout';

export default function A05Map() {
  const [params, setParams] = useSearchParams();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [exId, setExId] = useState('');
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const selectedId = params.get('artwork');

  useEffect(() => {
    Promise.all([api.adminGetExhibitions(), api.getArtworks()]).then(([exs, arts]) => {
      setExhibitions(exs);
      setArtworks(arts);
      const fromArtwork = arts.find((a) => a.id === selectedId)?.exhibitionId;
      setExId(fromArtwork ?? exs.find((e) => e.status === '운영 중')?.id ?? exs[0]?.id ?? '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = artworks.filter((a) => a.exhibitionId === exId);
  const select = (id: string) => setParams({ artwork: id }, { replace: true });

  const markers: MapMarker[] = list
    .filter((a) => a.position)
    .map((a) => ({
      id: a.id,
      label: String(list.indexOf(a) + 1),
      position: a.position!,
      state: a.id === selectedId ? 'selected' : 'default',
    }));

  const onMapClick = async (p: Point, roomId: string | null) => {
    if (!selectedId) return setMsg({ text: '먼저 오른쪽 목록에서 작품을 선택하세요.', error: true });
    if (!roomId) return setMsg({ text: '전시실 영역 안을 클릭해 주세요.', error: true });
    await api.adminSetArtworkPosition(selectedId, roomId, p);
    setArtworks((arts) => arts.map((a) => (a.id === selectedId ? { ...a, position: p, roomId } : a)));
    const title = artworks.find((a) => a.id === selectedId)?.title;
    setMsg({ text: `‘${title}’ 위치를 ${roomName(roomId)} (${p.x}, ${p.y})로 저장했습니다.` });
  };

  return (
    <>
      <AdminPageHead
        title="위치·지도 관리"
        desc="2D 평면도 위에 작품 위치와 관람 순서 계산에 사용할 위치 정보를 등록합니다."
        actions={
          <select className="a-select" value={exId} onChange={(e) => setExId(e.target.value)} aria-label="전시 선택">
            {exhibitions.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        }
      />
      <div className="a-map-grid">
        <section className="a-card">
          <FloorMap markers={markers} onMapClick={onMapClick} onMarkerClick={select} className="floor-map--admin" />
          {msg && <p className={msg.error ? 'error' : 'ok'}>{msg.text}</p>}
        </section>
        <aside className="a-card">
          <h2 className="a-h3">작품 위치</h2>
          <ul className="a-loc-list plain-list">
            {list.map((a, i) => (
              <li key={a.id}>
                <button type="button" className={`a-loc ${a.id === selectedId ? 'is-selected' : ''}`} onClick={() => select(a.id)}>
                  <span className="a-loc__num">{i + 1}</span>
                  <span className="a-loc__title">{a.title} · {roomName(a.roomId)}</span>
                  {!a.position && <span className="badge badge--warn">미등록</span>}
                </button>
                {a.id === selectedId && <Link className="link small a-loc__edit" to={`/admin/artworks/${a.id}`}>작품 정보 수정 →</Link>}
              </li>
            ))}
            {list.length === 0 && <li className="muted small">이 전시에 등록된 작품이 없습니다.</li>}
          </ul>
          <p className="note">작품을 선택한 뒤 지도 위치를 클릭하여 지정합니다.</p>
        </aside>
      </div>
    </>
  );
}
