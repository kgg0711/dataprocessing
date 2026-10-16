# ARTI

미술 감상 초보자를 위한 개인화 관람 서비스 (졸업 프로젝트)

| 폴더 | 내용 |
|---|---|
| [`frontend/`](frontend/README.md) | React + TypeScript + Vite — 사용자 모바일 웹(U-01~U-15), 관리자 웹(A-01~A-06) |
| [`backend/`](backend/README.md) | Node.js + Express + TypeScript + SQLite — REST API, 추천, AI 질문(Claude) |

## 빠르게 실행하기 (Node.js 22.13 이상)

```bash
# 터미널 1 — API 서버 (http://localhost:4000/api)
cd backend && npm install && npm run dev

# 터미널 2 — 화면 (http://localhost:5173)
cd frontend && npm install && npm run dev
```

데모 계정 — 사용자 `demo@arti.app / arti1234`, 관리자(`/admin`) `admin / admin1234`
