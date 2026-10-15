// U-15 새 비밀번호 설정: 이메일 링크(/reset-password?token=...)를 통해 새 비밀번호 설정
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as api from '../../api';
import MobileLayout from '../../components/MobileLayout';
import { MIN_PASSWORD } from '../../utils/validation';

export default function U15ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.verifyResetToken(token).then(setValid);
  }, [token]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) return setError(`비밀번호는 ${MIN_PASSWORD}자 이상이어야 합니다.`);
    if (password !== confirm) return setError('새 비밀번호 확인이 일치하지 않습니다.');
    try {
      await api.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <MobileLayout
      title="새 비밀번호 설정"
      back="/login"
      footer={
        valid && !done && (
          <div className="stack-8">
            <button className="btn btn--primary" type="submit" form="reset-form">비밀번호 설정</button>
            <button className="btn btn--text" type="button" onClick={() => navigate('/login')}>취소</button>
          </div>
        )
      }
    >
      <div className="page-head">
        <h1 className="h1">새 비밀번호를 설정해 주세요</h1>
        <p className="sub">영문·숫자를 조합해 {MIN_PASSWORD}자 이상으로 설정하는 것을 권장해요.</p>
      </div>

      {valid === null && <p className="muted">링크를 확인하는 중…</p>}
      {valid === false && (
        <div className="card card--soft stack-8">
          <p>만료되었거나 유효하지 않은 링크예요.</p>
          <button className="link small" onClick={() => navigate('/forgot-password')}>재설정 링크 다시 요청하기</button>
        </div>
      )}
      {done && <div className="card card--soft"><p className="strong">비밀번호가 변경되었어요.</p><p className="small muted">로그인 화면으로 이동합니다…</p></div>}
      {valid && !done && (
        <form id="reset-form" className="form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>새 비밀번호</span>
            <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="field">
            <span>새 비밀번호 확인</span>
            <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </MobileLayout>
  );
}
