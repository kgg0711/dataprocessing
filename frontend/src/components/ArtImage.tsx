import { useMemo } from 'react';

interface Props {
  seed: string;
  palette: string[];
  imageUrl?: string;
  alt: string;
  className?: string;
}

function rng(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * 작품 이미지. imageUrl이 없으면 팔레트 기반의 추상 플레이스홀더를 그린다.
 * (목업의 작품 이미지는 예시이며 실제 구현에서는 검증된 작품 이미지로 교체)
 */
export default function ArtImage({ seed, palette, imageUrl, alt, className }: Props) {
  const shapes = useMemo(() => {
    const r = rng(seed);
    const [bg, ...cols] = palette;
    const list = Array.from({ length: 26 }, (_, i) => {
      const fill = cols[Math.floor(r() * cols.length)] ?? '#ccc';
      const x = r() * 120 - 10;
      const y = r() * 90 - 10;
      const s = 10 + r() * 28;
      return r() > 0.5
        ? <circle key={i} cx={x} cy={y} r={s / 2} fill={fill} />
        : <rect key={i} x={x} y={y} width={s} height={s * (0.6 + r())} fill={fill} />;
    });
    return { bg, list };
  }, [seed, palette]);

  if (imageUrl) return <img className={className} src={imageUrl} alt={alt} />;
  return (
    <svg className={className} viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice" role="img" aria-label={alt}>
      <rect width="100" height="75" fill={shapes.bg} />
      {shapes.list}
    </svg>
  );
}
