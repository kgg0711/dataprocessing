import type { MouseEvent } from 'react';
import { ENTRANCE, ROOMS } from '../data/mock';
import type { Point } from '../types';

export interface MapMarker {
  id: string;
  label: string;
  position: Point;
  state?: 'done' | 'current' | 'upcoming' | 'selected' | 'default';
}

interface Props {
  markers: MapMarker[];
  /** 마커 순서대로 경로선을 그린다 */
  showRoute?: boolean;
  /** 관람자의 현재 위치(직전 감상 작품 또는 입구) */
  here?: Point | null;
  onMapClick?: (p: Point, roomId: string | null) => void;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

/** 전시실 2D 평면도. 실시간 실내 내비게이션이 아닌, 작품 위치·순서를 시각적으로 안내하는 수준 */
export default function FloorMap({ markers, showRoute, here, onMapClick, onMarkerClick, className }: Props) {
  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!onMapClick) return;
    // viewBox 좌표로 변환 (SVG가 레터박스로 그려져도 정확하도록 CTM 사용)
    const svg = e.currentTarget;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const p = { x: Math.round(pt.x * 10) / 10, y: Math.round(pt.y * 10) / 10 };
    const room = ROOMS.find((r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
    onMapClick(p, room?.id ?? null);
  };

  const routePts = markers.map((m) => `${m.position.x},${m.position.y}`).join(' ');

  return (
    <svg
      className={`floor-map ${onMapClick ? 'floor-map--editable' : ''} ${className ?? ''}`}
      viewBox="0 0 100 100"
      onClick={handleClick}
      role="img"
      aria-label="전시실 평면도"
    >
      {ROOMS.map((r) => (
        <g key={r.id}>
          <rect className="floor-map__room" x={r.x} y={r.y} width={r.w} height={r.h} rx={1.2} />
          <text className="floor-map__room-label" x={r.x + 2} y={r.y + 4.5}>{r.name}</text>
        </g>
      ))}
      <g className="floor-map__entrance">
        <rect x={ENTRANCE.x - 7} y={ENTRANCE.y - 3} width={14} height={4} rx={1} />
        <text x={ENTRANCE.x} y={ENTRANCE.y - 0.2} textAnchor="middle">입구</text>
      </g>
      {showRoute && markers.length > 1 && <polyline className="floor-map__route" points={routePts} />}
      {here && (
        <g className="floor-map__here">
          <circle cx={here.x} cy={here.y} r={3.2} className="floor-map__here-pulse" />
          <circle cx={here.x} cy={here.y} r={1.6} />
        </g>
      )}
      {markers.map((m) => (
        <g
          key={m.id}
          className={`floor-map__marker floor-map__marker--${m.state ?? 'default'}`}
          onClick={(e) => {
            if (onMarkerClick) {
              e.stopPropagation();
              onMarkerClick(m.id);
            }
          }}
        >
          <circle cx={m.position.x} cy={m.position.y} r={3.6} />
          <text x={m.position.x} y={m.position.y + 1.3} textAnchor="middle">{m.label}</text>
        </g>
      ))}
    </svg>
  );
}
