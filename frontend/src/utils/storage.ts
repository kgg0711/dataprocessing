// localStorage / sessionStorage 접근 헬퍼 (차단된 환경에서도 앱이 동작하도록 예외를 삼킨다)

export function readJSON<T>(storage: 'local' | 'session', key: string, fallback: T): T {
  try {
    const s = storage === 'local' ? window.localStorage : window.sessionStorage;
    const raw = s.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(storage: 'local' | 'session', key: string, value: unknown): void {
  try {
    const s = storage === 'local' ? window.localStorage : window.sessionStorage;
    if (value === null || value === undefined) s.removeItem(key);
    else s.setItem(key, JSON.stringify(value));
  } catch {
    /* 저장 불가 환경에서는 메모리 상태만 유지 */
  }
}

export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const today = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
