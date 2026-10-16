# ARTI 백엔드 (Node.js + Express + TypeScript + SQLite)

`frontend/`의 화면(U-01~U-15, A-01~A-06)이 쓰는 REST API 서버입니다.

## 실행

Node.js **22.13 이상**이 필요합니다(내장 SQLite `node:sqlite` 사용 → 별도 DB 설치·네이티브 빌드 없음).

```bash
cd backend
npm install
cp .env.example .env     # 필요하면 값 수정 (안 해도 기본값으로 동작)
npm run dev              # http://localhost:4000/api  (코드 수정 시 자동 재시작)
```

다른 터미널에서 프론트엔드를 띄우면 `/api` 요청이 자동으로 이 서버로 전달됩니다(Vite 프록시).

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (tsx watch) |
| `npm run build` / `npm start` | 컴파일(`dist/`) 후 실행 |
| `npm test` | API 통합 테스트 19개 (메모리 DB, 외부 호출 없음) |
| `npm run typecheck` | 타입 검사 |
| `npm run db:reset` | DB 파일 삭제 → 다음 실행 때 목업 데이터로 다시 생성 |

### 데모 계정 (처음 실행 시 자동 생성)
| 구분 | ID | 비밀번호 |
|---|---|---|
| 사용자 | demo@arti.app | arti1234 |
| 관리자 | admin | admin1234 |

> 운영 전에 관리자 비밀번호를 반드시 바꾸고 `DEMO_MODE=false`로 설정하세요.

## 환경 변수 (`.env`)

| 변수 | 기본값 | 설명 |
|---|---|---|
| `PORT` | 4000 | 서버 포트 |
| `DB_PATH` | data/arti.db | SQLite 파일 경로. 없으면 생성 후 `src/seed.ts` 데이터로 초기화 |
| `DEMO_MODE` | true (`NODE_ENV=production`이면 false) | 비밀번호 재설정 링크를 메일 대신 응답으로 돌려줌 |
| `SESSION_TTL_DAYS` | 14 | 로그인 유지 기간 |
| `CORS_ORIGIN` | (비움) | 프론트를 다른 주소에서 띄울 때만 설정 |
| `ANTHROPIC_API_KEY` | (비움) | 넣으면 AI 질문·맞춤 설명이 Claude로 동작. 비우면 규칙 기반 답변 |
| `ARTI_AI_MODEL` | claude-opus-5-5 | 사용할 Claude 모델 |

## 폴더 구조

```
src/
├── index.ts          서버 진입점
├── app.ts            Express 앱 구성 (라우터 연결, 에러 처리)
├── config.ts         환경 변수
├── db.ts             SQLite 스키마 · 초기 데이터 입력
├── repo.ts           DB 행 ↔ 도메인 타입 변환 + 쿼리 (라우트는 SQL을 직접 쓰지 않음)
├── http.ts           인증 미들웨어, 에러 형식, 요청 횟수 제한
├── schemas.ts        요청 검증(zod) — 한국어 에러 메시지
├── types.ts          도메인 타입 (frontend/src/types.ts와 동일)
├── seed.ts           초기 데이터 (전시 2, 작품 12, 회원 3, 관람기록 3)
├── lib/
│   ├── recommend.ts  추천 + 관람 순서(입구 기준 최근접 이웃)
│   ├── ai.ts         AI 질문/맞춤 설명 (Claude 또는 규칙 기반)
│   ├── password.ts   scrypt 비밀번호 해시, 토큰
│   └── josa.ts       한국어 조사 처리
└── routes/
    ├── catalog.ts    전시·작품 조회, 추천, AI
    ├── auth.ts       회원가입·로그인·취향·비밀번호 재설정
    ├── visits.ts     관람 기록(아트 영수증)
    └── admin.ts      관리자 API
test/api.test.ts      통합 테스트
```

## API 목록

에러 응답은 모두 `{ "error": "한국어 메시지" }` 형식이고, 프론트는 이 메시지를 그대로 화면에 보여 줍니다.

**인증 헤더** — 사용자: `Authorization: Bearer <token>` / 관리자: `X-Admin-Token: <token>`

| 메서드 | 경로 | 권한 | 화면 | 설명 |
|---|---|---|---|---|
| GET | `/api/health` | - | - | 서버 상태, AI 모드 |
| GET | `/api/exhibitions` | - | A-02, A-03 | 전시 목록 |
| GET | `/api/exhibitions/:id` | - | U-01, U-09 | 전시 상세(전시실·입구 좌표 포함) |
| GET | `/api/artworks?exhibitionId=` | - | U-08, A-04 | 작품 목록 |
| GET | `/api/artworks/:id` | - | U-10 | 작품 상세 |
| POST | `/api/recommendations` | - | U-08 | `{exhibitionId, tastes, duration}` → 추천 + 관람 순서 |
| POST | `/api/artworks/:id/explanation` | - | U-10 | `{tastes}` → AI 맞춤 설명 |
| POST | `/api/artworks/:id/ask` | - | U-11 | `{question}` → AI 답변(+출처) |
| POST | `/api/auth/signup` | - | U-04 | → `{user, token}` |
| POST | `/api/auth/login` | - | U-03 | → `{user, token}` |
| POST | `/api/auth/logout` | 사용자 | U-13 | 세션 종료 |
| GET | `/api/auth/me` | 사용자 | - | 내 정보 |
| PUT | `/api/users/:id/tastes` | 본인/관리자 | U-05 | 취향 저장 |
| POST | `/api/auth/password-reset/request` | - | U-14 | `{email}` → `{demoToken}` (데모 모드에서만 값 있음) |
| POST | `/api/auth/password-reset/confirm` | - | U-15 | `{token, password}` |
| POST | `/api/visits` | 선택 | U-12 | 로그인 시 저장, 비회원은 저장 없이 영수증만 반환 |
| GET | `/api/users/:id/visits` | 본인/관리자 | U-13, A-06 | 관람기록 목록 |
| GET | `/api/visits/:id` | 본인/관리자 | U-12(조회) | 관람기록 상세 |
| POST | `/api/admin/login` | - | A-01 | → `{name, token}` |
| POST | `/api/admin/logout` | 관리자 | - | |
| POST / PUT | `/api/admin/exhibitions[/:id]` | 관리자 | A-03 | 전시 등록 / 수정 |
| POST / PUT | `/api/admin/artworks[/:id]` | 관리자 | A-04, A-05 | 작품 등록 / 수정(위치 지정 포함) |
| GET | `/api/admin/members?q=` | 관리자 | A-06 | 회원 검색 + 관람 횟수 |

## 설계 메모

- **비밀번호**는 scrypt 해시로만 저장하고, **로그인 토큰·재설정 토큰**도 DB에는 SHA-256 해시만 저장합니다(DB가 유출돼도 바로 쓸 수 없음).
- 로그인 실패 메시지는 "이메일이 없음/비밀번호 틀림"을 구분하지 않고, 재설정 요청도 가입 여부와 무관하게 같은 응답을 돌려줍니다(가입 여부 노출 방지).
- 비밀번호를 재설정하면 그 계정의 기존 로그인 세션은 모두 끊깁니다. 재설정 링크는 30분 유효, 1회용입니다.
- 관람 기록의 소유자(`userId`)는 요청 본문이 아니라 **로그인 토큰**으로 정합니다. 남의 기록은 본인·관리자만 볼 수 있습니다.
- 로그인·회원가입·재설정은 IP당 분당 10회, AI 요청은 분당 20회로 제한합니다(메모리 기반, 서버 1대 기준).
- **추천**은 검수 완료(`approved`) + 위치 등록된 작품만 대상으로 합니다(설계서: 검증된 데이터만 서비스).
- **AI**: `ANTHROPIC_API_KEY`가 있으면 Claude가 등록된 작품 자료(해설·관찰 포인트·출처)만 근거로 답하도록 지시받고 답합니다. 키가 없거나, 호출이 실패하거나, 요청이 거절되면 규칙 기반 답변으로 자동 대체되어 화면이 멈추지 않습니다. 같은 작품·취향 조합의 맞춤 설명은 메모리에 캐시해 비용을 줄입니다.
- 비밀번호 재설정 **메일 발송은 아직 없습니다.** 데모 모드에서는 링크를 화면에 보여 주고, 서버 콘솔에도 링크를 출력합니다. 운영 시 `routes/auth.ts`의 TODO 위치에 메일 서비스를 연결하세요.
