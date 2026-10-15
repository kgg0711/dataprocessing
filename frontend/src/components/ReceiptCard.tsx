import type { VisitRecord } from '../types';

export const fmtDate = (d: string) => d.replace(/-/g, '.');

/** 아트 영수증 카드 (U-12 / U-13 조회 모드 공용) */
export default function ReceiptCard({ record }: { record: VisitRecord }) {
  return (
    <div className="receipt">
      <p className="receipt__title">ART RECEIPT</p>
      <p className="receipt__venue">{record.exhibitionTitle}<br />{record.venue}</p>
      <hr />
      <dl className="receipt__rows">
        <div><dt>관람 작품</dt><dd>{record.viewedCount}점</dd></div>
        <div><dt>추천 작품</dt><dd>{record.recommendedCount}점</dd></div>
        <div><dt>선호 표시</dt><dd>{record.likeCount}회</dd></div>
        <div><dt>가장 오래 본 작품</dt><dd>{record.longestArtwork}</dd></div>
      </dl>
      <hr />
      {record.artworks.length > 0 && (
        <>
          <p className="label">오늘 본 작품</p>
          <ul className="receipt__list plain-list">
            {record.artworks.map((a, i) => (
              <li key={i}>
                <span>{a.title} <em className="muted">· {a.artist}</em></span>
                <span aria-label={a.reaction === 'like' ? '좋아요' : a.reaction === 'dislike' ? '별로예요' : '반응 없음'}>
                  {a.reaction === 'like' ? '👍' : a.reaction === 'dislike' ? '👎' : '–'}
                </span>
              </li>
            ))}
          </ul>
          <hr />
        </>
      )}
      <p className="label">오늘의 취향 키워드</p>
      <div className="chips">
        {record.keywords.map((k) => <span key={k} className="chip chip--accent">{k}</span>)}
      </div>
      <p className="receipt__foot">오늘 본 작품을 기억해두세요.</p>
      <div className="receipt__barcode" aria-hidden />
    </div>
  );
}
