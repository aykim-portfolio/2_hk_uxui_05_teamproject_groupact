## 기사 스크랩 기능 확장프로그램 summary

# ⛏️ Text Miner — 와르르 뉴스 스크랩

크롬 익스텐션. 뉴스 기사에서 텍스트를 드래그한 뒤 **`Shift + Enter`를 6번 연타**하면
"손맛" 이펙트와 함께 텍스트가 스크랩되어 저장되는 인터랙션 툴.

---

## 1. 컨셉

- 뉴스 기사를 읽다가 인상 깊은 문장을 드래그
- 광부가 곡괭이질하듯 `Shift+Enter`를 리드미컬하게 연타(6회)
- 화면 하단에서 스크랩 인벤토리 오버레이가 올라오며 텍스트 블록이 와르르 떨어지는 이펙트
- 저장된 스크랩은 별도 대시보드 탭에서 카드 형태로 모아보기 가능

---

## 2. 기술적 시행착오 (진짜 있었던 일)

### 최초 시도: 맥북 가속도 센서(Sudden Motion Sensor) 기반 "팜레스트 타격 감지"

- 아이디어: 웹/키보드 이벤트가 아니라 **맥북 하판을 실제로 툭 치면** 그 충격을 감지해 스크랩을 트리거하려 함
- `sensor_server.py`: Python + `websockets`로 로컬 서버(포트 8765)를 띄우고, `ctypes`로 macOS `IOKit` 프레임워크를 로드해 가속도계 raw 값(X/Y/Z)을 폴링(100Hz)하는 프로토타입 작성
- **막힌 지점**: M1~M4 애플 실리콘은 인텔 맥북과 커널 구조·보안 모델이 달라 SMS 커널 주소에 대한 저수준 접근이 막혀 있음 → 센서값이 `0`으로 고정되거나 아예 접근 불가
  - 현재 `sensor_server.py`의 `get_macbook_acceleration()`은 이 한계 때문에 **항상 더미값 `(0,0,1.0)`을 반환**하는 상태로 남아있음 (미해결 이슈, 사실상 폐기 예정 코드)
- 부가 문제: 설령 감지가 되어도 실사용 시 하드웨어를 세게 두드려야 해서 (1) 맥북이 상할 위험 (2) 타격 소음으로 인한 UX 저하

### 1차 피벗: 스페이스바 연타

- 브라우저 표준 키보드 이벤트로 100% 감지 가능해서 채택
- **실패 원인**: 기사 읽는 중 스페이스바 = 페이지 스크롤 다운 → 가독성 파괴, 치명적 UX 결함

### 2차 피벗 (최종 채택): `Shift + Enter` 연타

- 스크롤/텍스트 입력 등 기존 브라우저 동작과 충돌하지 않는 조합키
- 0.4초 이내 연속 입력만 "연타"로 인정 → 리듬감 있는 타격 손맛 유지, 6회 도달 시 트리거

**결론: 센서 기반 접근은 폐기되었고, 현재 동작하는 구현은 순수 키보드 이벤트(`Shift+Enter` ×6) 방식이다.**
`sensor_server.py`는 코드베이스에 남아있지만 실제로 익스텐션과 연결되어 사용되지는 않는 것으로 보임 (연결 여부 확인 필요).

---

## 3. 현재 파일 구성

```
text-miner/
├── manifest.json      # MV3 매니페스트. content script + background + action 정의
├── background.js      # 툴바 아이콘 클릭 → dashboard.html 새 탭으로 열기
├── content.js         # 핵심 로직: 드래그 감지, Shift+Enter 연타 감지, 이펙트, 저장
├── styles.css         # 하단에서 올라오는 오버레이 + 텍스트 블록 낙하 애니메이션
├── dashboard.html      # 저장된 스크랩을 카드 그리드로 보여주는 대시보드 페이지
├── dashboard.js        # chrome.storage.local에서 scraps 불러와 렌더링
└── sensor_server.py    # (미사용/폐기 예정) 맥북 가속도 센서 연동 시도 프로토타입
```

### manifest.json

- `manifest_version: 3`
- 권한: `storage`, `activeTab`
- content script를 `<all_urls>`에 주입 (`content.js` + `styles.css`)
- `action` 클릭 시 `background.js`가 대시보드 탭을 오픈

### content.js — 핵심 인터랙션

1. `mouseup` 이벤트로 드래그 선택 텍스트를 `lastSelectedText`에 임시 저장
2. `keydown`에서 `shiftKey + Enter` 감지
   - 이전 타격과 400ms 이내면 `hitCount++`, 아니면 리셋
   - `hitCount >= 6` 이면 `triggerScrapEffect()` + `saveScrapedText()` 실행 후 상태 초기화
3. `triggerScrapEffect(text)`
   - 화면에 `#text-miner-overlay`가 없으면 동적 생성(제목 + 컨테이너)
   - 30자로 텍스트 자르고, 랜덤 X 위치(20~80%) / 랜덤 회전(-20~20deg)을 부여한 블록을 추가
   - 2초 후 오버레이 자동 숨김 (`hideTimeout`으로 중복 타이머 방지)
4. `saveScrapedText(text)`
   - `{ text, url, title, date }` 객체를 `chrome.storage.local`의 `scraps` 배열에 append

### styles.css

- `#text-miner-overlay`: 기본은 `bottom: -180px`로 화면 밖에 숨겨져 있다가 `.active` 클래스 시 `bottom: 0`으로 슬라이드업 (`cubic-bezier` 이징)
- `.miner-text-block`: `fallAndBounce` 키프레임으로 위에서 떨어지며 바운스하는 느낌 연출

### dashboard.html / dashboard.js

- 다크 테마(네온 민트 `#00ffcc` 포인트) 대시보드
- `chrome.storage.local`에서 `scraps` 배열을 읽어 최신순으로 카드 렌더링
- 각 카드: 스크랩 텍스트, 출처 제목, 원문 링크, 저장 일시
- 스크랩이 없으면 빈 상태 안내 문구 표시

### background.js

- 익스텐션 아이콘 클릭 시 `dashboard.html`을 새 탭으로 오픈하는 단 3줄짜리 서비스 워커

### sensor_server.py

- Python `websockets` 서버(로컬 8765 포트)
- `ctypes`로 `IOKit` 로드 시도, `SMSData` 구조체 정의
- `get_macbook_acceleration()`은 Apple Silicon 제약으로 인해 실제 센서값 대신 더미 리턴
- 진동 델타(`> 0.3`)와 쿨타임(0.15s)으로 "HIT" 신호를 웹소켓으로 브로드캐스트하는 구조만 존재 — **크롬 익스텐션 쪽에 이 WebSocket을 구독하는 코드가 현재 content.js에는 없음**

---

## 4. 다음 클로드 코드 작업 시 참고할 미결 사항

- [ ] `sensor_server.py`를 계속 유지/발전시킬지, 완전히 폐기할지 결정 필요 (현재는 사용되지 않는 죽은 코드)
- [ ] 디자인 고도화: 오버레이/대시보드 비주얼, 반응형, 다크/라이트 모드 등
- [ ] `content.js`의 `hitCount` 로직은 전역 변수 기반 — 여러 프레임(iframe) 존재 페이지에서의 동작 검증 필요
- [ ] 스크랩 데이터 관리 기능 (삭제, 검색, 태그, 내보내기 등) 미구현
- [ ] 아이콘 리소스(`icons/` 등) manifest에 없음 — 필요시 추가
