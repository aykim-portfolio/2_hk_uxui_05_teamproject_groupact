# Screenshot Archive — 현황 분석 자료

현재 서비스(한국경제 뉴스) 현황 분석을 위한 캡처 아카이브입니다. SNS 반응과 실제 유저들의 소비패턴 파악에 사용할 근거 자료를 보관합니다.

## 폴더 구조

```
docs/images/screenshot/
  service/       # 현재 서비스 화면 현황 (랜딩페이지, 기사 뷰, 모바일/데스크톱)
  sns-reaction/  # SNS·커뮤니티 반응 캡처 (댓글, 공유 반응, 언급)
  user-pattern/  # 유저 소비패턴 근거 자료 (트래픽/행동 데이터, 이용 흐름)
```

## 파일명 규칙

`YYYY.MM.DD_출처_설명.png`

예시:
- `2026.07.07_hankyung_랜딩페이지_모바일.png`
- `2026.07.07_instagram_한경기사_공유반응.png`
- `2026.07.07_ga_유입경로_주간.png`

## 문서에서 참조하는 법

분석 문서(`docs/deliverables/*.md` 등)에서 상대경로로 삽입:

```markdown
![랜딩페이지 현황](../images/screenshot/service/2026.07.07_hankyung_랜딩페이지_모바일.png)
```

- 포맷: PNG 권장, 용량이 큰 경우 폭 800~1200px로 리사이즈
- 개인정보(닉네임·프로필 등)가 포함된 SNS 캡처는 블러 처리 후 업로드
