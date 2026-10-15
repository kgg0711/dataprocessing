import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBack } from './Icons';

interface Props {
  title?: ReactNode;
  /** 뒤로가기 동작. 문자열이면 해당 경로로, 함수면 실행, 생략 시 브라우저 뒤로가기, false면 숨김 */
  back?: string | (() => void) | false;
  right?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** 모바일 웹 공통 레이아웃: 상단 헤더 + 스크롤 본문 + 하단 고정 CTA */
export default function MobileLayout({ title, back, right, footer, children, className }: Props) {
  const navigate = useNavigate();
  const onBack = () => {
    if (typeof back === 'string') navigate(back);
    else if (typeof back === 'function') back();
    else navigate(-1);
  };
  return (
    <div className="m-shell">
      <header className="m-header">
        <div className="m-header__side">
          {back !== false && (
            <button type="button" className="icon-btn" aria-label="뒤로가기" onClick={onBack}>
              <IconBack width={26} height={26} />
            </button>
          )}
        </div>
        <div className="m-header__title">{title}</div>
        <div className="m-header__side m-header__side--right">{right}</div>
      </header>
      <main className={`m-body ${className ?? ''}`}>{children}</main>
      {footer && <footer className="m-footer">{footer}</footer>}
    </div>
  );
}
