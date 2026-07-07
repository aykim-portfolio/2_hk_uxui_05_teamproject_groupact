# 한경 앱 정보 구조(IA) 및 User Flow 정리

## 1. 정보 구조 (IA) 상세 구조 표

### [1] 하단 내비게이션 바 (GNB)

| 메뉴명 | 주요 기능 및 제공 콘텐츠 | 특징 / UX 관점 |
|---|---|---|
| 뉴스 (홈) | 기본 뉴스 피드 구성, 상단 카테고리별 기사 탐색 | 앱의 기본 진입점 |
| 프리미엄 | 유료 구독 서비스('한경 PREMIUM') 전용 콘텐츠 제공 | 독점 콘텐츠 중심의 유료 공간 |
| ALICE (beta) | 대화형 정보 검색이 가능한 AI 경제 챗봇 서비스 | 생성형 AI 결합을 통한 차별화 |
| 마켓 | 국내/외 주요 증시 지수(코스피, 코스닥, 다우, S&P 500 등) 시황 데이터 | 실시간 금융 데이터 중심 피드 |
| 개인 (마이페이지) | 회원 로그인, 알림 관리, 기사 스크랩, 관심종목, 포트폴리오 설정 | 개인 맞춤형 설정 및 자산 관리 |

### [2] 상단 햄버거 메뉴 (전체 메뉴)

| 대분류 | 상세 포함 항목 | 비고 |
|---|---|---|
| 연동 영역 | 한경 PREMIUM 연동 메뉴 | 유료 회원 연결 인터페이스 |
| 카테고리별 뉴스 | Today, 경제, 금융, 집코노미, 유류, 테크, 정치, 문화, 브랜드, 산업, 코리아마켓, 글로벌마켓, 국제, 오피니언, 사회, 골프 | 뉴스 분야별 전면 배치 |
| 전문채널 / 외부 이동 | 마켓인사이트, 한경Law&Biz, 한경BIO Insight, 한경PRICE, ESG 매거진, WAVE, 모닝루틴 등 | 버티컬 전문 미디어 허브 역할 |
| 한경 콘텐츠 | 개인 ALICE Q, 동영상, 인사·부고, 보도자료, 한 장 여행, The Pen, 한경행사 등 | 부가 콘텐츠 및 이벤트 안내 |

## 2. 주요 사용자 흐름 (User Flow) 비교 표

| 구분 | 흐름명 | 주요 이동 단계 (Step-by-Step) | 핵심 UX 목적 |
|---|---|---|---|
| Flow A | 일반 뉴스 및 카테고리 탐색 | 앱 진입 → 카테고리 이동(테크/금융 등) → 헤드라인 기사 선택 → 상세 페이지 소비(좋아요 등 반응) → 뒤로가기로 리스트 복귀 | 전형적인 뉴스 피드 소비 및 서비스 체류 시간 증대 |
| Flow B | 유료 콘텐츠 진입 및 구독 유도 (Paywall) | 기사 탐색 중 PREMIUM 콘텐츠 발견/클릭 → 유료 벽(Paywall) 안내 팝업 조우 → 구독 상품 바텀 시트 확인 → 최종 구독 결제 또는 이탈 | 유료 구독자(한경 PREMIUM) 전환 유도 |
| Flow C | 전체 메뉴를 통한 하위 채널 탐색 | 뉴스 메인 화면 좌상단 '☰' 클릭 → 서비스 전체 라인업 스크롤 탐색 → 최하단 전문채널 및 콘텐츠 영역 이동 → 원하는 메뉴 바로가기 | 뎁스(Depth)를 건너뛰는 빠른 목적지 도달 지원 |

### User Flow 시각화 (Mermaid Flowchart)

```mermaid
graph TD
    %% 스타일 정의
    classDef startEnd fill:#333,stroke:#333,color:#fff,font-weight:bold;
    classDef action fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef decision fill:#fffdf0,stroke:#d4af37,stroke-width:1px;
    classDef premium fill:#ffebe6,stroke:#ff4d4d,stroke-width:1px;

    %% 흐름 시작
    Start([사용자 앱 진입]) :::startEnd --> Home[뉴스 홈 피드 확인] :::action

    %% Flow A: 일반 뉴스 탐색
    Home --> TopTab[상단 카테고리 탭 스와이프/클릭<br>테크, 금융, 집코노미 등] :::action
    TopTab --> ArticleList[기사 리스트 탐색] :::action
    ArticleList --> ClickArticle{기사 클릭} :::decision

    %% Flow B: 프리미엄 구독 유도
    ClickArticle -->|일반 뉴스 기사| DetailPage[기사 상세 페이지 소비] :::action
    DetailPage --> Reaction[하단 좋아요/싫어요/후속기사 반응] :::action
    Reaction --> Home

    ClickArticle -->|PREMIUM 배지 기사| Paywall[유료 벽 Paywall 조우<br>본문 일부 제한] :::premium
    Paywall --> SubscriptionBottomSheet[구독 상품 팝업 노출<br>월간/1년 이용권] :::premium
    SubscriptionBottomSheet --> ClickSubscribe{구독 여부 결정} :::decision
    ClickSubscribe -->|구독하기 클릭| Payment[결제 프로세스 진입] :::action
    ClickSubscribe -->|이탈| Home

    %% Flow C: 전체 메뉴 탐색
    Home --> ClickHamburger[좌상단 전체 메뉴 ☰ 클릭] :::action
    ClickHamburger --> MenuScroll[전체 서비스 라인업 스크롤 탐색] :::action
    MenuScroll --> SelectChannel{이동할 채널 선택} :::decision
    SelectChannel -->|전문 채널/콘텐츠 클릭| ChannelPage[해당 전문 서비스 페이지로 점프] :::action
    SelectChannel -->|닫기| Home

    %% 스타일 적용
    class Start,Payment,ChannelPage startEnd;
```

## 3. 기획/UX 관점의 핵심 요약

- 하이브리드형 내비게이션 구조: 상단(카테고리 탭), 하단(GNB), 좌상단(전체 메뉴)을 유기적으로 교차 활용하여 방대한 언론사 데이터를 빈틈없이 촘촘하게 연결함.
- AI 및 금융 데이터 중심의 플랫폼 진화: 단순 텍스트 뉴스를 넘어, 하단 GNB 중앙에 생성형 AI(ALICE)와 시황 데이터(마켓)를 배치하여 종합 '경제 플랫폼'으로 아이덴티티를 강화하는 UX 전략임.
