# 페이퍼토리 디자인 시스템 — Design.md

> 팀명: Com4nent, 디자인 시스템 작성자 : 김아영 (Design Ops)

한국경제 모바일 서비스 개선안인 신규 앱 '페이퍼토리'의 디자인 토큰 체계를 정리한 문서임. 신뢰감 있는 브랜드 블루와 발랄한 포인트 라임을 중심으로, Primitive → Semantic 2단 구조로 설계되어 있음. 컬러·타이포·스페이싱·Radius·그림자/이펙트까지 전체 화면 톤을 이 토큰만으로 구성함.

## 목차

1. [컬러 시스템](#1-컬러-시스템) (Primitive · Semantic · Data Visualization)
2. [타이포그래피](#2-타이포그래피)
3. [Spacing / Layout Grid](#3-spacing--layout-grid)
4. [Corner Radius](#4-corner-radius)
5. [Effect Styles (Elevation)](#5-effect-styles-elevation)
6. [Overlay / Dimming](#6-overlay--dimming)
7. [Iconography & System UI](#7-iconography--system-ui)
8. [컴포넌트](#8-컴포넌트)
9. [사용 가이드](#9-사용-가이드)

---

## 1. 컬러 시스템

### 구조 원칙

- **Primitive Colors**: 절대 직접 사용 금지. Semantic Token을 통해서만 참조함
- **Semantic Tokens**: 컴포넌트와 화면에는 항상 이 레이어를 사용함
- **★ 표시**: 해당 Primitive 스텝이 Semantic 레이어에서 가장 빈번히 참조되는 기준 스텝임

---

### 1.1 Primitive Colors

#### Primary · Blue

| Token | Hex | 참조 Semantic |
|---|---|---|
| primary/100 | #F1F5FF | — |
| primary/200 | #CBD9FF | — |
| primary/300 | #A5BDFF | — |
| primary/400 | #80A0FF | — |
| primary/500 ★ | #6083F5 | brand/primary, bg/brand-bold, text/brand, border/brand |
| primary/600 | #4664CB | text/brand-strong |
| primary/700 | #2D45A3 | — |
| primary/800 | #17277C | — |
| primary/900 | #070657 | — |

#### Secondary · Lime

| Token | Hex | 참조 Semantic |
|---|---|---|
| lime/100 | #F2F9DB | — |
| lime/200 ★ | #E6F997 | brand/secondary, bg/accent-bold |
| lime/300 | #C4D580 | — |
| lime/400 | #AABB5F | — |
| lime/500 | #92A33A | — |
| lime/600 | #72802B | — |
| lime/700 | #545E1C | — |
| lime/800 | #353C0B | — |
| lime/900 | #1B2002 | — |
| lime/200-10 ~ 200-60 | #E6F997 alpha 10~60% | 형광펜·하이라이트 틴트 |

#### Neutral · Blue Gray

| Token | Hex | 참조 Semantic |
|---|---|---|
| gray/100 | #DBE2EB | border/default 파생 |
| gray/200 | #C4CBD4 | text/disabled |
| gray/300 | #ADB3BD | — |
| gray/400 | #949AA4 | — |
| gray/500 | #7A8089 | text/tertiary |
| gray/600 ★ | #5F656E | — |
| gray/700 ★ | #464C55 | — |
| gray/800 | #2F363E | — |
| gray/900 | #1C222A | text/primary, bg/inverse |

#### Status · Info (Slate Blue)

| Token | Hex |
|---|---|
| info/light | #ECF0F9 |
| info/strong | #5E8ABF |

#### Status · Success (Sage)

| Token | Hex |
|---|---|
| success/light | #E7F2EC |
| success/strong | #4A9468 |

#### Status · Warning (Sand)

| Token | Hex |
|---|---|
| warning/light | #F8F1E4 |
| warning/strong | #C49540 |

#### Status · Error (Rose)

| Token | Hex |
|---|---|
| error/light | #F6E8EA |
| error/strong | #BF5055 |

---

### 1.2 Semantic Tokens

#### Brand

| Token | Primitive | 사용처 |
|---|---|---|
| brand/primary | primary/500 | 주 브랜드 컬러, 주요 액션·강조 |
| brand/primary-light | Blue 파생 (#D0DAFC) | 브랜드 라이트 배경 |
| brand/secondary | lime/200 | 형광펜·하이라이트 등 가볍고 발랄한 포인트 |

#### Background

| Token | Primitive | 사용처 |
|---|---|---|
| bg/primary | #F8F9FB | 앱 전체 기본 화면 |
| bg/brand | Blue 파생 (#EDF0FD) | 브랜드 강조 영역 배경 |
| bg/brand-bold | primary/500 | 강조 배너, CTA 배경 |
| bg/accent-bold | lime/200 | 형광펜, 스피치 버블 배경 |
| bg/inverse | gray/900 | 다크 배경, 역상 UI |
| bg/card | #EFF1F5 | AI 카드 배경 |
| bg/brand-light | primary/100 | AI 버블 배경 |
| bg/surface | #FFFFFF | 카드, 메뉴 아이템, 패널 배경 |

#### Text

| Token | Primitive | 사용처 |
|---|---|---|
| text/primary | gray/900 | 제목, 본문 기본 텍스트 |
| text/secondary | #7D828A | 부제목, 보조 텍스트, 기자명, 날짜 |
| text/tertiary | gray/500 | 캡션, 메타 정보 |
| text/disabled | gray/200 | 비활성 텍스트 |
| text/inverse | #F8F9FB | 다크 배경 위 텍스트 |
| text/brand | primary/500 | 링크, 강조 텍스트 |
| text/brand-strong | primary/600 | 칩/링크 강조 |
| text/indigo | #161F85 | AI 요약 강조 텍스트 |

#### Border

| Token | Primitive | 사용처 |
|---|---|---|
| border/default | #EBECEF | 기본 구분선, 디바이더 |
| border/strong | #1A2535 | 강조 테두리 |
| border/accent | #D6EE8D | 라임 액센트 테두리 (진행률, 선택 상태) |
| border/brand | primary/500 | 브랜드 테두리 |

#### Status

| Token | Primitive | 사용처 |
|---|---|---|
| status/info-bg | info/light | 정보 알림 배경 |
| status/info | info/strong | 정보 강조 |
| status/success-bg | success/light | 성공 배경, 구분선 |
| status/success | success/strong | 성공 강조 |
| status/warning-bg | warning/light | 경고 배경 |
| status/warning | warning/strong | 경고 강조 |
| status/error-bg | error/light | 에러 배경 |
| status/error | error/strong | 에러 강조 |

---

### 1.3 Data Visualization

차트/그래프용 색상 세트임. 발표 슬라이드에도 동일하게 활용함.

#### Sequential — 순차 데이터

**Blue** (예: 읽기 기록 히트맵) — `#EDF0FD → #D0DAFC → #AFC1FA → #809CF7 → #6083F5 → #496DE0 → #3654B8 → #263D94`

| Date Cell state | 매핑 색상 |
|---|---|
| Empty | bg/surface (읽은 기록 없음) |
| Future | text/disabled 톤 (아직 오지 않은 날짜) |
| Today | border/brand 강조 (당일 표시) |
| Level 1 | Sequential Blue 1~2단계 (`#EDF0FD`~`#D0DAFC`) |
| Level 2 | Sequential Blue 3단계 (`#AFC1FA`) |
| Level 3 | Sequential Blue 4~5단계 (`#809CF7`~`#6083F5`) |
| Level 4 | Sequential Blue 6단계 (`#496DE0`) |
| Level 5 | Sequential Blue 7~8단계 (`#3654B8`~`#263D94`, 최다 열독) |

> Date Cell(→ 8.8 컴포넌트)의 Level 1~5 state는 이 Sequential Blue 8단계를 5구간으로 압축해 매핑한 것임. 읽은 기사 수가 많을수록 진한 블루로 표시됨.

**Lime** (예: 진행도 뱃지) — `#FCFFF1 → #F5FCE0 → #E6F997 → #DEFF71 → #C8E54C → #A8C832 → #6A8A18 → #354B0E`

#### Diverging — 증감 데이터 (하락 ↔ 상승)

| 강한 하락 | 하락 | 약한 하락 | 중립 | 약한 상승 | 상승 | 강한 상승 |
|---|---|---|---|---|---|---|
| #0B3DA3 | #1E64E6 | #64A0F5 / #B3D1FF | #F8F9FB | #FFB3B4 | #FF383C | #CC2428 / #A31418 |

> 시장 지표(코스피, 종목 등락률 등) 표시에 사용함. 파랑 계열은 하락, 붉은 계열은 상승을 의미함 — 국내 증시 관행에 맞춰 적용함.

---

## 2. 타이포그래피

### 폰트 패밀리

| 역할 | 폰트 | 용도 | Weight |
|---|---|---|---|
| Primary | Paperlogy | 제목, 뱃지, 날짜, 네비게이션, UI 텍스트 | Medium(5) / SemiBold(6) / Bold(7) / ExtraBold(8) |
| Secondary | Open Sans | 본문 텍스트, 긴 단락, 보조 설명 | Regular / Bold |

### Type Scale

| 스타일명 | 폰트 스펙 | 사용처 |
|---|---|---|
| Headline 1 | Paperlogy ExtraBold(8) / 24px / LH 34px | 예: "한국은행, 기준금리 동결 결정" — 헤드라인 뉴스 타이틀 |
| Title/Button | Paperlogy Bold(7) / 20px / LH auto | 예: "오늘의 증시 브리핑" — 화면/섹션 타이틀, 버튼 텍스트 |
| Subtitle | Paperlogy Bold(7) / 16px / LH auto | 예: "주요 경제 지표 요약" — 서브 타이틀 |
| Body 1 (요약 view) | Open Sans Regular / 20px / LH 32px / LS -2% / Indent 8px | 뉴스 랜딩페이지 요약 모드 본문, 이해관계자 시각 본문, AI에게 질의응답하기 본문 |
| Body 2 (원문 view) | Open Sans Regular / 16px / LH 24px / LS -2% / Indent 8px | 뉴스 원문 모드 본문 |
| Label | Paperlogy Bold(7) / 14px / LH auto | 예: "속보 · 단독" — 뱃지·라벨 |
| Caption | Paperlogy Medium(5) / 12px / LH auto | 예: "2026.07.24 오전 09:32 · 경제부" — 기자명, 날짜 |

> Body 1·2는 문단 들여쓰기(Indent) 8px과 자간 -2%가 적용되어 있어, 코드 구현 시 `text-indent: 8px`을 함께 지정해야 함.

---

## 3. Spacing / Layout Grid

### 기준 화면

- 화면 너비: **393px** (iPhone 14 Pro 기준)

### 영역별 좌우 패딩

| 영역 | 패딩 |
|---|---|
| 상태바 | 24px |
| 헤더 / 앱바 | 16px |
| 드로어 콘텐츠 | 24px |
| 카드 내부 | 16px |
| 뉴스 카드 영역 좌우 | 20px |
| 랜딩 좌우 | 16px |
| 리스트 아이템 간격 | 4~12px (영역별 상이) |

### 컴포넌트별 패딩 (padding)

| 컴포넌트 | 값 (top/right/bottom/left) |
|---|---|
| status-bar | [0, 24, 0, 24] |
| main-header | [0, 16, 0, 16] |
| 뉴스 카드 | [16, 20, 16, 20] |
| dropdown-tab | [12, 20, 12, 24] |
| Lead 영역 | [16, 16, 16, 16] |
| Today_News 상단 | [32, 0, 0, 0] |
| 바텀시트/모달 | [40, 0, 40, 0] |
| 전체 메뉴 상단 | [32, 20, 0, 20] |

---

## 4. Corner Radius

| Token | 값 | 사용처 |
|---|---|---|
| radius/sm | 12px | 카드, 이미지, 홈 내비게이션 드로어, AI 카드 |
| radius/lg | 24px | 칩, 드롭다운 탭, 스피치 버블, pill형 요소 |
| radius/xl | 36px | 바텀시트, 화면 레벨 컨테이너 |
| radius/full | 999px | 완전 원형 |

### radius/full 세부 적용 크기

| 크기 | 사용처 |
|---|---|
| 16–20px | 슬라이더 도트, 인디케이터 |
| 40px | Lead/Trail 버튼, 라운드 버튼 |
| 64px | FAB |

---

## 5. Effect Styles (Elevation)

| 스타일명 | Shadow 값 | 사용처 |
|---|---|---|
| News Row Shadow | offset (0, -4) · blur 4.8 · spread 0 · opacity 100% | news-row 컴포넌트, 뉴스 리스트 아이템 상단 구분선 효과 |
| Card Shadow | offset (2, 4) · blur 8 · spread 0 · opacity 100% | Mascot_Banner, 카드형 요소 그림자 |
| Sticky Note Shadow | offset (0, 2) · blur 4 · spread 0 · opacity 6% | sticky-note, 스크랩북 메모 그림자 |
| 토리 AI Shadow | offset (2, 2) · blur 8 · spread 0 · #D3D8E9 100% | AI-Insight-Card-QnA, AI 인사이트 카드 전용 |

### Glass Effect (복합 이펙트)

버튼·드롭다운·FAB에 사용하는 5겹 글래스모피즘 효과임.

| 레이어 | 값 |
|---|---|
| ① Glass | radius 20 · refraction 0.36 · depth 25 · lightAngle 32° |
| ② Drop Shadow | offset (4, 4) · blur 16 · #000000 12% |
| ③ Inner Shadow | offset (0, 13) · blur 12 · spread 4 · #FFFFFF 20% |
| ④ Drop Shadow | offset (0, 0) · blur 0.3 · #DBDBDB 25% |
| ⑤ Inner Shadow | offset (3, 4) · blur 4 · #FFFFFF 100% |

> 사용처: dropdown-tab, FAB, 아이콘 버튼

---

## 6. Overlay / Dimming

| Token | 값 | 사용처 |
|---|---|---|
| overlay/light | #1A2535 @ 20% | 토스트, 툴팁 |
| overlay/medium | #1A2535 @ 35% | 드로어, 사이드메뉴 |
| overlay/heavy | #1A2535 @ 60% | 모달 |
| overlay/black | #1A2535 @ 80% | 이미지 뷰어 |

---

## 7. Iconography & System UI

### Iconography

- 아이콘 라이브러리는 **Lucide Icon Library**를 추가해서 사용함
- 디자인 시스템/화면에 정의된 아이콘과 **동일한 이름의 Lucide 아이콘**을 찾아 그대로 매칭해서 가져옴 (예: `arrow-right`, `alert-triangle`, `check-circle`, `x-circle` 등 기존 명명 규칙 그대로 유지)
- 별도 커스텀 아이콘 세트를 새로 만들지 않고, Lucide에 없는 아이콘만 예외적으로 커스텀 제작함

### System Status Bar

- 상단 상태바(시간, 신호, 배터리 등)는 디자인 시스템 토큰을 따르지 않고 **일반적인 iOS 기본 스타일**을 그대로 사용함
- 즉, `design.md`에 정의된 컬러/타이포/스페이싱 토큰의 영향을 받지 않는 시스템 영역으로 별도 취급함
- 다크모드 등 상태바 색상 반전이 필요한 경우도 iOS 시스템 기본 동작을 따름 (앱 자체 토큰으로 오버라이드하지 않음)

---

## 8. 컴포넌트

Figma "Components / Iconography" 섹션(node 467:3402) 기준. 화면 단위가 아닌 재사용 컴포넌트 라이브러리임.

### 8.1 뉴스 뷰 (News)

| 컴포넌트 | Variant / 구성 |
|---|---|
| News/TopAppBar | — |
| News/TopBarButtonOption | Default / 2set / 1set |
| News/MainHeader, HeroImage, NewsImage, ImageLayout | — |
| News/CategoryChip | 카테고리칩v1 / 카테고리v2 / 썸네일 이미지 슬롯 3종 |
| News/NewsRows | 산업 · 정치 · 경제 · 국제 · 오피니언 · 부동산 · 테크 · 코리안마켓 · 글로벌마켓 (9개 카테고리 row) |
| News/NewsCard, NewsTitle, Date, NewsCaption, ArticleInfo | — |
| News/DropdownTab | Default / 텍스트버전 |
| News/NewsText | 랜딩 / 본문 |
| News/SliderAiMode, SliderOriginal, SliderEasyRead | 원문·AI 요약·쉬운말 3가지 읽기 모드 슬라이더 |
| News/Badge | Default / Variant2 |
| News/AiSummaryCard, AiCardContent, CategoryChipInline, ArticleOriginalText | AI 요약 카드 세트 |
| News/Menu, MenuHeader | — |

### 8.2 토리 (AI 챗봇 마스코트)

| 컴포넌트 | 설명 |
|---|---|
| Tori/Chat, AiChatTopBar, AiChatInput | AI 챗봇 대화 화면 뼈대 |
| Tori/ToriMessage, UserMessage | 챗봇 응답 / 사용자 메시지 버블 |
| Tori/RecommendedQuestion | 추천 질문 칩 |
| Tori/AiSummary, NewsOriginalCard, ToriCard | AI 요약·원문 카드, 토리 카드 |
| Tori/DrawerFooter, AcornSpeechBubble | 드로어 하단 영역, 도토리 스피치 버블(리워드 안내) |

### 8.3 스크랩 (Scrap)

| 컴포넌트 | Variant / 구성 |
|---|---|
| Scrap/PenBar | 원문 / 스크랩 / Variant3 |
| Scrap/PenTool | Lucide 아이콘 21종 (highlighter, pencil, eraser, scissors, undo-2, keyboard, clipboard, picker, bold, case-sensitive, italic, list, list-todo, paperclip, pipette, save, table, text-align-* 등) |
| Scrap/Picker, PenDetail, FloatingActionButton | 색상 피커, 펜 상세 옵션, FAB |
| Scrap/Item | Default / Variant2 |
| Scrap/CombinedTab, BottomSheetClipActive | 스크랩 조각 탭, 바텀시트 클립 활성 상태 |

### 8.4 꾸미기 상점 (Shop) — 진행 중

| 컴포넌트 | Variant / 구성 |
|---|---|
| Shop/Tabs | 테이프활성화 / 스티커활성화 |
| Shop/MaskingTapeCard, ToriStickerCard | 활성화 / 비활성화 2 state |
| Shop/ToriSticker | 웃는토리 / 안경토리 / 우는토리 / 화난토리 (감정 4종) |
| Shop/MaskingTape | 마스킹1~6 (패턴 6종) |
| Shop/CardItemContainer | — |

> 이 섹션은 Figma 상에서 "수정중"으로 표시되어 있어 최종 스펙이 아닐 수 있음.

### 8.5 아이콘 (Iconography)

`Icon/Icons` 프레임에 등록된 27개 아이콘 전부 **Lucide 라이브러리 아이콘명과 1:1로 매칭됨** — `chevron-left/right/down/up`, `arrow-left/right`, `square-arrow-up-right`, `arrow-up-right`, `move-right`, `star`, `notebook-pen`, `loader`, `settings`, `share-2`, `stamp`, `heart`, `menu`, `highlighter`, `message-circle`, `message-circle-more`, `x`, `list-filter`, `paperclip`, `folder-open`, `file-pen`, `trending-up` 등. `Icon/RoundButton`에는 토리 마스코트 등 브랜드 커스텀 아이콘이 섞여 있어 이 부분만 예외적으로 커스텀 제작함 (→ 7. Iconography & System UI 원칙과 연결).

### 8.6 온보딩 (Onboarding)

| 컴포넌트 | 설명 |
|---|---|
| Onboarding/StartContent, TitleGroup, ToriMascot | 시작 화면 콘텐츠, 타이틀 그룹, 토리 마스코트 일러스트 |

### 8.7 리워드 (Reward)

| 컴포넌트 | Variant / 구성 |
|---|---|
| Reward/RoundButton | 모은도토리 / 리워드on / 리워드off |
| Reward/RewardCard | Default / Variant2 / Variant3 + 구분선 |
| Reward/OtherCard | Default / Variant2 |
| Reward/AcornCollect, ShopButton | 도토리 수집 뷰, 상점 이동 버튼 |

### 8.8 내비게이션 & 공통

| 컴포넌트 | 설명 |
|---|---|
| Navigation/FullMenu, Hamburger | 전체 메뉴, 햄버거 메뉴 |
| Common/HomeIndicator | iOS 홈 인디케이터 (→ 7. System UI 원칙 적용 대상) |
| Common/CategoryCardExpanded | 카테고리 카드 확장 뷰 |
| ReadingHistory/SubHeader, ReadingHistoryCard | 읽기 기록 캘린더 상세 뷰 |
| Date Cell | 캘린더 날짜 셀 — Empty / Future / Today / Level 1~5 (8 state, Data Viz Sequential Blue와 연동) |

### 8.9 컴포넌트 적용 예시

| 컴포넌트 | Fill | Text | Radius / 기타 |
|---|---|---|---|
| Category Chip | bg/brand | text/brand | radius/lg (pill) |
| AI 요약 Card | bg/card | text/primary | radius/sm, Card Shadow |
| Speech Bubble (도토리 등) | bg/accent-bold | text/inverse | radius/lg |
| News Card | bg/primary | text/primary | radius/sm, News Row Shadow |
| Menu Item | bg/surface | text/primary | border/default |
| 진행률 강조 카드 | bg/surface | text/secondary | border/accent |
| 스크랩북 메모 | bg/surface | text/primary | Sticky Note Shadow + Glass Effect |
| AI 인사이트 카드 (토리) | bg/card | text/indigo | 토리 AI Shadow |
| 드롭다운 탭 / FAB | Glass Gradient | text/primary | radius/full, Glass Effect |
| Info 배너/화면 | status/info-bg | status/info | 상태 배너 공통 패턴 |
| Success 배너/화면 | status/success-bg | status/success | 완료 화면 |
| Warning 배너/화면 | status/warning-bg | status/warning | 만료·경고 화면 |
| Error 배너/화면 | status/error-bg | status/error | 실패 화면 |

---

## 9. 사용 가이드

### 컬러 원칙

1. 컴포넌트에는 반드시 Semantic Token 사용 — `brand/primary`, `text/primary` 등
2. Primitive는 직접 사용 금지 — 팔레트 문서 표시 및 Semantic 레이어 정의 용도로만 존재함
3. Status 4종(Info/Success/Warning/Error)은 항상 `-bg`(배경)와 기본(강조) 2단계를 세트로 사용함
4. Data Visualization 팔레트는 UI 시맨틱 팔레트와 분리 관리함 — 차트/그래프 전용으로만 사용함

### 타이포그래피 원칙

- 제목·뱃지·날짜·네비게이션 = Paperlogy 계열만 사용, Open Sans 혼용 금지
- 본문·긴 단락 = Open Sans, 자간 -2% + Indent 8px 규칙 유지
- Headline 1은 헤드라인 뉴스 타이틀 전용 — 일반 화면 제목에는 Title/Subtitle 사용

### Spacing 원칙

- 카드 내부 기본 패딩은 16px, 카드 섹션 간 간격은 20px을 기준으로 함
- 화면 좌우 기본 패딩은 헤더 16px / 드로어·상태바 24px로 구분해서 적용함
- 대형 섹션 간 간격(24px)과 소형 아이템 간격(4~12px)을 혼용하지 않음

### Radius / Effect 원칙

- 카드류: `radius/sm` (12px), 칩·pill 요소: `radius/lg` (24px), 완전 원형: `radius/full`
- 모든 카드형 요소는 최소 `Card Shadow` 또는 `News Row Shadow` 중 하나를 적용함
- Glass Effect는 인터랙션 가능한 플로팅 요소(FAB, 드롭다운)에만 적용 — 정적 카드에는 사용 금지

### 화면 타입별 색상 조합

| 화면 타입 | 주요 배경 | 강조 색상 |
|---|---|---|
| 홈/피드 | bg/primary | brand/primary, brand/secondary |
| 달력/읽기 기록 | bg/surface | Sequential Blue (Data Viz) |
| 시세/시장 화면 | bg/surface | Diverging (Data Viz) |
| 로딩/처리중 | bg/surface + status/info-bg | status/info |
| 완료 화면 | bg/surface + status/success-bg | status/success |
| 경고 화면 | bg/surface + status/warning-bg | status/warning |
| 오류 화면 | bg/surface + status/error-bg | status/error |
| 드로어/사이드메뉴 | overlay/medium + bg/surface | border/accent |
 
---

*Generated from Figma Design System — GROUP ACT / 페이퍼토리 (zNDuyelMmDqxbUhBk3Tdog), "디자인 시스템 + UI 통합본" 페이지 (Color System 467:2145 · Typography 467:3268 · Radius/Spacing/Layout 467:3312 · Effects Styles 467:3375)*
