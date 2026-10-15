// U-11 AI 자유 질문: 작품 관련 자유 질의응답
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import * as api from '../../api';
import { IconArrowUp } from '../../components/Icons';
import MobileLayout from '../../components/MobileLayout';
import { useVisit } from '../../store/VisitContext';
import type { ChatMessage } from '../../types';
import { readJSON, writeJSON } from '../../utils/storage';

const SUGGESTIONS = ['이 작품의 색은 왜 이렇게 쓰였나요?', '무엇을 먼저 보면 좋을까요?', '작가는 어떤 사람인가요?'];

export default function U11Ask() {
  const visit = useVisit();
  const rec = visit.recommendations[visit.currentIndex];
  const key = `arti.chat.${rec?.artwork.id}`;
  const [messages, setMessages] = useState<ChatMessage[]>(() => readJSON('session', key, []));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    writeJSON('session', key, messages);
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, key]);

  if (!rec) return <Navigate to="/route" replace />;
  const { artwork } = rec;

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || loading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', text: question }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const answer = await api.askAI(artwork, question, next);
      setMessages((m) => [...m, { role: 'ai', text: answer }]);
    } catch {
      setMessages((m) => [...m, { role: 'ai', text: '답변을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <MobileLayout
      title="AI에게 질문하기"
      back="/view"
      footer={
        <form className="chat-input" onSubmit={onSubmit}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="질문을 입력하세요" aria-label="질문 입력" />
          <button type="submit" className="chat-input__send" aria-label="보내기" disabled={!input.trim() || loading}>
            <IconArrowUp width={18} height={18} />
          </button>
        </form>
      }
    >
      <div className="card card--muted">
        <p className="strong">{artwork.title}</p>
        <p className="muted small">{artwork.artist} · {artwork.year}</p>
      </div>

      <p className="strong mt-24">작품을 보면서 궁금한 점을 물어보세요.</p>

      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`bubble bubble--${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="bubble bubble--ai bubble--loading">답변을 준비하고 있어요<span className="dots" /></div>}
        <div ref={endRef} />
      </div>

      <p className="label mt-24">추천 질문</p>
      <div className="stack-8">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="suggest" onClick={() => ask(s)} disabled={loading}>{s}</button>
        ))}
      </div>
      <p className="note">AI 답변은 검수된 작품 해설과 참고자료를 근거로 제공됩니다.</p>
    </MobileLayout>
  );
}
