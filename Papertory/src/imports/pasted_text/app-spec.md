Build a mobile web app called 페이퍼토리 with the following screens and interactions. Use a blue-purple (#6B6FD4) primary color, yellow-green (#C8E64C) accent, and white background. Korean UI text throughout.

---

## SCREEN 1 — Start (Splash)
- Full-screen blue-purple background
- Centered squirrel mascot illustration holding an acorn (line-art style, yellow-green stroke)
- App name "페이퍼토리" in bold white below the mascot
- Subtitle "토리가 오늘의 경제 뉴스를 모아왔어요!" in small white text
- "POWERED BY COM4NENT" in tiny white text at the bottom
- After 3 seconds, automatically navigate to Screen 2 (Today Landing)

---

## SCREEN 2 — Today Landing
- Status bar + header with logo left, notification icon right
- Below the header: a dropdown button labeled "Today ▾" — tapping opens Screen 3 (Category Select)
- Hero news card (full width):
  - Category chip (e.g. "산업")
  - Large bold headline (2 lines)
  - Thumbnail image
  - 3-line article summary text
- Section title "오늘의 산업·IT 주요뉴스" below the hero card
- List of 5 news rows, each with: number, headline, category chip
- Tapping any news row navigates to Screen 5 (Article Original)

---

## SCREEN 3 — Category Select
- Header same as Screen 2
- 4 large category cards arranged in a staggered/overlapping layout (carousel feel):
  - 산업, IT, 금융, 부동산
- Each card has a colored background, category name, and a brief description
- Tapping "산업" card navigates to Screen 4 (Category Landing — 산업)
- Other cards are tappable but can show the same layout with different label

---

## SCREEN 4 — Category Landing (산업)
- Same layout as Screen 2 (Today Landing) but filtered to 산업 category
- Dropdown now shows "산업 ▾"
- Hero card and news list show 산업 articles only
- Tapping a news row navigates to Screen 5

---

## SCREEN 5 — Article Detail (기사 원문)
- Header with back arrow (returns to previous screen) + logo
- 3-tab slider below the header: [기사 원문] [AI 모드] [쉽게 읽기]
  - Default selected: 기사 원문
  - Switching tabs changes the content area below without a full page reload
- Content area for "기사 원문" tab:
  - Category chip
  - Bold headline (2 lines)
  - Reporter name + publish date (e.g. "한경 산업부 기자 · 2026.07.20 09:12")
  - Full-width article image
  - Full article body text (3–4 paragraphs)
- Floating Action Button (FAB) in the bottom-right corner (circular, blue-purple)
  - Tapping the FAB reveals Screen 5-T (Toolbar overlay)

---

## SCREEN 5-AI — Article Detail (AI 모드 tab)
- Same header and 3-tab slider, "AI 모드" tab selected
- Content area:
  - "이해관계자 시각" section: 2–3 cards each showing a stakeholder (e.g. 기업, 소비자, 정부) and their perspective on the article
  - Below that: AI 채팅 panel
    - Chat bubble from 토리 mascot with an opening message
    - User input field at the bottom with send button
    - 4 suggested question chips above the input
- FAB same as Screen 5

---

## SCREEN 5-EASY — Article Detail (쉽게 읽기 tab)
- Same header and 3-tab slider, "쉽게 읽기" tab selected
- Content area:
  - Same article structure as 기사 원문 (category chip, headline, image)
  - Article body rewritten at elementary school reading level (simple vocabulary, short sentences, no jargon)
  - No AI summary card — just the rewritten article text
- FAB same as Screen 5

---

## SCREEN 5-T — Toolbar Overlay (FAB 클릭 시)
- A floating pill-shaped toolbar appears above the FAB
- 6 tools in a row with icons:
  1. 형광펜 (highlighter) — highlights selected text in yellow
  2. 펜 (pen) — freehand drawing on the article
  3. 지우개 (eraser) — erases drawn marks
  4. 가위 (scissors) — freeform crop: user draws a shape over the article image, and that cropped region becomes a resource saved to the scrapbook
  5. 되돌리기 (undo) — undoes the last action
  6. 색상 (color picker) — gradient circle, opens a color palette
- A 노트 (note/scrapbook) icon also in the toolbar — tapping navigates to Screen 6 (Scrapbook)
- Tapping outside the toolbar closes it

---

## SCREEN 6 — Scrapbook (스크랩북)
- Header: back arrow (returns to Screen 5) + "스크랩북" title + "저장" button (top right)
- Main canvas area (grid/dot background):
  - Clipped images (from scissors tool) and highlighted text excerpts from the article appear as draggable, resizable sticker-like elements on the canvas
  - User can tap any element to select it, then drag to reposition or pinch/drag corners to resize
- Bottom sheet (slides up):
  - Title: "리소스"
  - Horizontal scrollable list of all saved resources:
    - Cropped images (thumbnails)
    - Highlighted text snippets (text cards)
  - Tapping a resource places it onto the canvas
- Tapping "저장" button:
  - Shows a toast notification: "저장되었습니다 ✓"
  - After 1.5 seconds, navigates back to Screen 5 (기사 원문 tab)

---

## DESIGN SYSTEM
- Primary: #6B6FD4 (blue-purple)
- Accent: #C8E64C (yellow-green)
- Background: #FFFFFF
- Surface: #F5F5F5
- Text primary: #1A1A1A
- Text secondary: #888888
- Border radius: 16px for cards, 32px for chips and buttons
- Font: Pretendard or system-ui
- Mobile viewport: 393px wide
- All interactions should feel native-app-like (smooth tab transitions, bottom sheets slide up with animation)