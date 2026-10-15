// U-04 회원가입: 취향·관람 기록 저장을 위한 계정 생성
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '../../components/MobileLayout';
import { useAuth } from '../../store/AuthContext';
import { EMAIL_RE, MIN_PASSWORD } from '../../utils/validation';

export default function U04Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirm: '', nickname: '', agree: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(form.email)) return setError('올바른 이메일 형식을 입력해 주세요.');
    if (form.password.length < MIN_PASSWORD) return setError(`비밀번호는 ${MIN_PASSWORD}자 이상이어야 합니다.`);
    if (form.password !== form.confirm) return setError('비밀번호 확인이 일치하지 않습니다.');
    if (!form.agree) return setError('약관에 동의해 주세요.');
    setError('');
    setLoading(true);
    try {
      await signup(form.email, form.password, form.nickname);
      navigate('/taste', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout
      title="회원가입"
      footer={
        <button className="btn btn--primary" type="submit" form="signup-form" disabled={loading}>
          {loading ? '가입 중…' : '회원가입'}
        </button>
      }
    >
      <form id="signup-form" className="form" onSubmit={onSubmit} noValidate>
        <div className="page-head">
          <h1 className="h1">취향을 기억해 둘게요</h1>
          <p className="sub">가입하면 취향과 관람 기록을 다음 관람에서 다시 사용할 수 있어요.</p>
        </div>
        <label className="field">
          <span>이메일</span>
          <input type="email" autoComplete="email" value={form.email} onChange={(e) => set('email')(e.target.value)} placeholder="example@email.com" />
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input type="password" autoComplete="new-password" value={form.password} onChange={(e) => set('password')(e.target.value)} placeholder={`${MIN_PASSWORD}자 이상`} />
        </label>
        <label className="field">
          <span>비밀번호 확인</span>
          <input type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => set('confirm')(e.target.value)} placeholder="비밀번호 재입력" />
        </label>
        <label className="field">
          <span>닉네임 <em className="muted">(선택)</em></span>
          <input value={form.nickname} onChange={(e) => set('nickname')(e.target.value)} placeholder="관람 기록에 표시할 이름" maxLength={20} />
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={form.agree} onChange={(e) => set('agree')(e.target.checked)} />
          <span>[필수] 서비스 이용약관 및 개인정보 수집·이용에 동의합니다.</span>
        </label>
        {error && <p className="error">{error}</p>}
      </form>
    </MobileLayout>
  );
}
