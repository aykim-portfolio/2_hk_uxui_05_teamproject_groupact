## 4. 한경 뉴스 숏폼메이커 (참고: 기존 프로젝트)

**폴더**: `news-shortform/` · **포트**: 57919 (autoPort)

세션 초반부터 존재하던 별도 프로젝트로, 한경 기사 URL을 입력하면 숏폼 콘텐츠(대본 등)를 자동 생성하는 Node.js 서버. 본 세션에서는 신규 기획 3종(Whistle, Tycoon, Pixel Factory)과 포트가 겹치지 않도록 격리하는 작업만 수행했으며, 상세 설계는 이 세션에서 다루지 않았다.

---

## 프로젝트 간 연결 구조

```
[news-shortform]         [pixel-factory 확장]
  기사 URL → 숏폼 콘텐츠     기사 원문 안에서 퀴즈 출제
                                    │ 완독 시 랜딩 CTA
                                    ▼
                          [whistle-pixel-battle] ← 최종 허브
                          기사 → 픽셀 배틀 피드 (BULL/BEAR 베팅)
                                    ▲
                                    │ 정보센터에서 기사 원문 이동 후 단서 파밍 → 복귀
                          [yeouido-tycoon]
                          타이쿤 게임의 돌발 투자 퀘스트
```

세 신규 프로젝트(Whistle, Tycoon, Pixel Factory) 모두 최종적으로 **한경 뉴스 원문 또는 Whistle 배틀룸**으로 트래픽을 모으는 구조로 설계되었으며, `.claude/launch.json`에 각각 독립 설정(포트 3457/3458/3459, autoPort)으로 등록되어 있다.

## 뉴스 숏폼 메이커 주소 :https://tiny-tapioca-02ba67.netlify.app/
