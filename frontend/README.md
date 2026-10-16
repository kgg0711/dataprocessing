# ARTI 프론트엔드

「5. 화면(UI) 설계」 문서의 사용자 모바일 웹(U-01 ~ U-15)과 관리자 데스크톱 웹(A-01 ~ A-06)을
React + TypeScript + Vite로 구현한 프론트엔드입니다.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 타입 검사 + 배포용 빌드(dist/)
```

휴대폰에서 확인하려면 `npm run dev -- --host` 후 같은 Wi-Fi에서 표시되는 IP 주소로 접속합니다.

### 데모 계정
| 구분 | ID | 비밀번호 |
|---|---|---|
| 사용자 | demo@arti.app | arti1234 |
| 관리자 (`/admin`) | admin | admin1234 |

## 폴더 구조

```
src/
├── App.tsx                 라우팅 표 (화면 ID ↔ URL 매핑 주석 포함)
├── main.tsx                진입점
├── types.ts                도메인 타입 (Artwork, Exhibition, VisitRecord …)
├── api/client.ts           API 계층 (백엔드 REST 호출)
├── data/mock.ts            화면 공통 상수 (취향 라벨·관람 시간 옵션)
├── store/VisitContext.tsx  관람 세션 전역 상태 (Context + useReducer)
├── lib/
│   ├── recommend.ts        이동 시간·추천 이유 문장 (추천 자체는 서버에서)
│   ├── useAsync.ts         비동기 호출 훅
│   ├── useSpeech.ts        TTS(음성 설명) 훅
│   ├── storage.ts          localStorage/sessionStorage 안전 래퍼
│   └── josa.ts             한국어 조사(와/과) 처리
├── components/             MobileShell, FloorMap(2D 평면도), ArtImage, Icon, Field
├── pages/user/             U01Start ~ U15ResetPassword
├── pages/admin/            AdminLayout, A01Login ~ A06Members
└── styles/app.css
```

## URL 설계 (설계서 5.3 외부 URL 진입)

| URL | 화면 | 비고 |
|---|---|---|
| `/exhibitions/:exhibitionId` | U-01 | 전시 입구 QR이 가리킬 주소 |
| `/login` | U-03 | `?redirect=` 로 인증 후 원래 화면 복귀 |
| `/signup` | U-04 | |
| `/history` | U-13 | 미로그인 → `/login?redirect=/history` → 복귀 |
| `/password/reset?token=` | U-15 | 비밀번호 재설정 메일 링크 |

## 화면 전환 규칙 (설계서 5.5)

- 로그인 사용자: U-03 → U-06(저장 취향) → U-07
- 비회원/신규: U-05(취향 파악, 2개 이상 선택) → U-07
- U-10 "다음 작품 안내": 남은 작품 있으면 U-09(같은 지도 화면 재사용), 없으면 U-12
- 👍/👎는 선택사항, 누르지 않아도 다음 작품으로 진행
- 작품별 QR은 MVP 범위에서 제외

## 백엔드 연결

화면은 `src/api/client.ts`를 통해 백엔드(`../backend`) REST API를 호출합니다.
개발 중에는 Vite 프록시가 `/api` 요청을 `http://localhost:4000`으로 넘기므로 **백엔드를 먼저 띄워 주세요.**

```bash
cd ../backend && npm install && npm run dev   # 터미널 1
cd ../frontend && npm install && npm run dev  # 터미널 2 → http://localhost:5173
```

- 다른 주소의 서버를 쓰려면: 개발 프록시 대상은 `VITE_API_PROXY`, 빌드 결과물의 API 주소는 `VITE_API_BASE`(예: `https://api.example.com/api`, 이 경우 백엔드 `CORS_ORIGIN` 설정 필요)
- 로그인 토큰은 localStorage(`arti.token`, 관리자는 `arti.adminToken`)에 저장되고, 만료되면 자동으로 지워집니다.
- 추천·AI 답변·비밀번호 재설정은 모두 서버에서 처리합니다. API 목록과 설계 메모는 [`backend/README.md`](../backend/README.md) 참고.
- 데모 데이터를 처음 상태로 돌리려면 백엔드에서 `npm run db:reset`.
