# ARTI 웹 프론트엔드 (React + TypeScript)

「5. 화면(UI) 설계」 문서를 기준으로 구현한 ARTI 사용자 모바일 웹(U-01 ~ U-15)과 관리자 데스크톱 웹(A-01 ~ A-06)입니다.

## 실행

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # 타입 체크 + 프로덕션 빌드 (dist/)
```

- 화면 목록 바로가기: `http://localhost:5173/screens`
- 데모 계정 — 사용자 `demo@arti.kr / arti1234`, 관리자 `admin / admin1234`
- 모바일 화면은 브라우저 개발자도구의 모바일 뷰(예: iPhone 14)로 보는 것을 권장합니다.

## 화면 ID ↔ URL

| 화면 ID | 화면명 | URL |
|---|---|---|
| U-01 | 서비스 시작 | `/`, `/exhibition/:id` (전시 URL·입구 QR) |
| U-02 | 로그인 선택 | `/start` |
| U-03 | 로그인 | `/login` (`?next=` 인증 후 복귀) |
| U-04 | 회원가입 | `/signup` |
| U-05 | 취향 파악 | `/taste` |
| U-06 | 저장 취향 확인 | `/taste/saved` |
| U-07 | 관람 시간 선택 | `/time` |
| U-08 | 개인화 작품 추천 | `/recommend` |
| U-09 | 추천 관람 경로(2D 지도) | `/route` |
| U-10 | 작품 감상 | `/view` |
| U-11 | AI 자유 질문 | `/ask` |
| U-12 | 아트 영수증 | `/receipt`, `/history/:id` (조회 모드) |
| U-13 | 관람기록 | `/history` (미로그인 시 U-03 → 복귀) |
| U-14 | 비밀번호 찾기 | `/forgot-password` |
| U-15 | 새 비밀번호 설정 | `/reset-password?token=…` |
| A-01 | 관리자 로그인 | `/admin/login` |
| A-02 | 관리자 대시보드 | `/admin` |
| A-03 | 전시 관리 | `/admin/exhibitions` |
| A-04 | 작품 등록·수정 | `/admin/artworks`, `/admin/artworks/:id`, `/admin/artworks/new` |
| A-05 | 위치·지도 관리 | `/admin/map` |
| A-06 | 회원 조회 | `/admin/members` |

## 구조

```
src/
├─ api/index.ts          # 목업 API (localStorage 기반). 백엔드 연동 시 이 파일만 fetch로 교체
├─ data/mock.ts          # 전시·작품·평면도·취향 옵션·데모 계정 목업 데이터
├─ store/                # AuthContext(로그인/관리자), VisitContext(관람 세션 상태)
├─ utils/recommend.ts    # 취향+시간 기반 추천, 입구 기준 관람 순서(최근접 이웃) 계산
├─ components/           # MobileLayout, FloorMap(2D 평면도), ArtImage, ReceiptCard, Icons
├─ hooks/useSpeech.ts    # Web Speech API 기반 TTS(음성 설명)
└─ pages/user|admin/     # 화면 ID별 페이지 컴포넌트
```

## 구현 메모

- **화면 전환**은 설계서 5.5.1 주요 화면 전환표를 따릅니다. U-10에서 남은 작품이 있으면 U-09로, 없으면 U-12로 이동합니다.
- **로그인은 선택 기능**입니다. 비회원도 추천·지도·감상 기능을 모두 사용할 수 있고, 로그인 사용자는 취향과 아트 영수증이 저장됩니다.
- **관리자에서 수정한 작품·위치 데이터는 사용자 화면 추천/지도에 바로 반영**됩니다(같은 목업 DB 사용).
- **AI 응답(U-11, AI 맞춤 설명)은 목업**입니다. 실제 구현에서는 `api.askAI`를 검수된 작품 자료를 근거로 답하는 백엔드 API 호출로 교체합니다.
- **작품 이미지**는 저작권 이슈를 피하기 위해 팔레트 기반 플레이스홀더를 그립니다. 관리자 화면에서 이미지 URL을 입력하면 실제 이미지가 표시됩니다.
- 비밀번호 재설정 메일은 데모에서 실제로 발송하지 않고, U-14 화면에 재설정 링크를 바로 보여줍니다.
- `/screens`의 「데모 데이터 초기화」로 목업 데이터를 처음 상태로 되돌릴 수 있습니다.
