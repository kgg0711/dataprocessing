// U-14 비밀번호 찾기: 가입 이메일로 비밀번호 재설정 링크 요청
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../api';
import MobileLayout from '../../components/MobileLayout';
import { EMAIL_RE } from '../../utils/validation';

export default function U14ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [demoToken, setDemoToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return setError('올바른 이메일 형식을 입력해 주세요.');
    setError('');
    setLoading(true);
    const token = await api.requestPasswordReset(email);
    setLoading(false);
    setDemoToken(token);
    setSent(true);
  };

  return (
    <MobileLayout
      title="비밀번호 찾기"
      back="/login"
      footer={
        !sent && (
          <button className="btn btn--primary" type="submit" form="forgot-form" disabled={loading}>
            {loading ? '요청 중…' : '재설정 링크 보내기'}
          </button>
        )
      }
    >
      <form id="forgot-form" className="form" onSubmit={onSubmit} noValidate>
        <div className="page-head">
          <h1 className="h1">비밀번호를 잊으셨나요?</h1>
          <p className="sub">가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.</p>
        </div>
        <label className="field">
          <span>이메일</span>
          <input type="email" autoComplete="email" value={email} disabled={sent} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
        </label>
        {error && <p className="error">{error}</p>}
      </form>

      {sent && (
        <div className="card card--soft stack-8">
          <p className="strong">메일을 확인해 주세요</p>
          <p className="small">입력한 이메일이 가입된 계정이라면 재설정 링크가 발송됩니다. 메일함(스팸함 포함)을 확인해 주세요.</p>
          <Link className="link small" to="/login">로그인으로 돌아가기</Link>
          {demoToken && (
            <p className="hint">
              [데모] 메일 발송 대신 링크를 바로 열 수 있어요 →{' '}
              <Link className="link" to={`/reset-password?token=${demoToken}`}>재설정 링크 열기</Link>
            </p>
          )}
        </div>
      )}
    </MobileLayout>
  );
}
