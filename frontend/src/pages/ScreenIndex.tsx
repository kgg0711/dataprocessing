// 발표·검토용 화면 목록 (화면 ID → URL 바로가기)
import { Link } from 'react-router-dom';
import { SCREENS } from '../screens';
import { resetDemoData } from '../api';

export default function ScreenIndex() {
  const onReset = () => {
    resetDemoData();
    sessionStorage.clear();
    localStorage.removeItem('arti.user');
    window.location.href = '/screens';
  };

  return (
    <div className="screen-index">
      <h1>ARTI 화면 목록</h1>
      <p className="muted">화면 설계서 5.1.1의 화면 ID 기준. 일부 화면은 이전 단계(취향·시간 선택 등)를 거쳐야 데이터가 표시됩니다.</p>
      <table className="a-table">
        <thead><tr><th>화면 ID</th><th>화면명</th><th>URL</th></tr></thead>
        <tbody>
          {SCREENS.map((s) => (
            <tr key={s.id}>
              <td><strong>{s.id}</strong></td>
              <td>{s.name}</td>
              <td>{s.path.includes('…') ? <code>{s.path}</code> : <Link className="link" to={s.path}>{s.path}</Link>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="small muted">데모 계정 — 사용자: demo@arti.kr / arti1234 · 관리자: admin / admin1234</p>
      <button className="a-btn" onClick={onReset}>데모 데이터 초기화</button>
    </div>
  );
}
