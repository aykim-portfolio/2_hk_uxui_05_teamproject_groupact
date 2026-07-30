// MARKER-MAKE-KIT-INVOKED
// MARKER-MAKE-KIT-DISCOVERY-READ
// MARKER-MAKE-KIT-TOKENS-READ
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import StartScreenImport from "@/imports/Start/index";
import imgArticle from "@/imports/Landing/8db2a969b7cc2690d1ad5bbc3961b54f39a56d49.png";
import imgToriChat from "@/imports/Ai모드/1036bf7c5b4c39f6cf61eba9b8b1c76e90e5dfb0.png";
import imgToriMenu from "@/imports/햄버거메뉴활성화/9db62f1482f6077c23b2aaac03047a53e5f6f50c.png";
import imgAcorn from "@/imports/미션리워드/8135e13e64481f72eb891bb72cb9db8c4c3a5dad.png";
import imgToriAcorn from "@/imports/미션리워드/83c7dbb8da7027e4e62dfad831eaac2ba17cc611.png";
import imgTape from "@/imports/상점적용예시/ea6aea2b073382a238ef9b308be47610b8745314.png";
import imgToriMypage from "@/imports/마이페이지/tori-confetti.png";
import imgToriEmpty from "@/imports/읽기기록달력/tori-empty.png";
import imgSticker1 from "@/imports/스크랩북/sticker-1.png";
import imgSticker2 from "@/imports/스크랩북/sticker-2.png";
import imgSticker3 from "@/imports/스크랩북/sticker-3.png";
import imgSticker4 from "@/imports/스크랩북/sticker-4.png";
import imgToriDeco from "@/imports/스크랩북/tori-deco.png";
import imgBgPaper from "@/imports/스크랩북/bg-paper.png";
import imgScrapColorPicker from "@/imports/기사원문/b3f46f82ad89489d80cc51b271cd3cc0.png";
import articlesData from "./articles.json";

// 실제 한국(KST) 날짜를 "오늘"로 사용 — 목업 데이터(JULY_READS)는 2026년 7월 기준으로 고정돼 있으므로
// 실제 날짜가 그 달을 벗어나면(다른 달/연도) 달력엔 "오늘" 표시가 나타나지 않음.
// toNewsItem(article 목업 변환)이 모듈 로드 시 바로 실행되므로, 이 블록은 그보다 앞에 있어야 함
function getKstToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const map: Record<string, string> = {};
  parts.forEach((p) => (map[p.type] = p.value));
  const weekday = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", weekday: "short" }).format(new Date());
  return { year: Number(map.year), month: Number(map.month), day: Number(map.day), weekday };
}
const KST_TODAY = getKstToday();
const TODAY_YEAR = KST_TODAY.year;
const TODAY_MONTH = KST_TODAY.month;
const TODAY_DAY = KST_TODAY.day;
const TODAY_DATE_STR = `${TODAY_YEAR}.${String(TODAY_MONTH).padStart(2, "0")}.${String(TODAY_DAY).padStart(2, "0")}`;
// 랜딩 히어로 카드 하단 날짜 표기 — 읽기 기록 달력의 "오늘"과 동일하게 실제 KST 날짜 반영
const TODAY_DATE_LABEL = `${TODAY_DATE_STR}  (${KST_TODAY.weekday})`;
// 기사 원문은 실제 수집 기사(전부 2026.07.29자)라 바이라인 날짜는 고정. "오늘"(동적)과 구분됨
const ARTICLE_DATE_STR = "2026.07.29";

type Screen =
  | "start"
  | "landing"
  | "category"
  | "category-landing"
  | "article"
  | "mission"
  | "shop"
  | "mypage"
  | "calendar"
  | "reading-detail"
  | "scrap-library"
  | "scrapbook"
  | "scrap-share"
  | "shared-scrap";
type ArticleTab = "original" | "ai" | "easy";
type ShopTab = "tape" | "sticker";
// 기사 원문 FAB 툴바 — 형광펜(문장 강조)/펜(자유 필기)/지우개/가위(이미지 자르기)
type ArticleTool = "none" | "highlighter" | "pencil" | "eraser" | "scissors";
type ArticleStroke = { id: string; pts: { x: number; y: number }[] };
// 형광펜은 문단 전체가 아니라 드래그로 고른 부분(start~end 문자 오프셋)만 강조한다
type HighlightRange = { id: string; para: number; start: number; end: number; text: string };
type ArticleAction = { t: "highlight"; id: string } | { t: "stroke"; id: string } | { t: "clip"; text: string };

// 문단 안의 텍스트 노드를 순서대로 훑어 node/offset을 "문단 시작부터 문자 수" 오프셋으로 환산
function textOffsetInPara(paraEl: HTMLElement, node: Node, nodeOffset: number): number {
  let offset = 0;
  const walker = document.createTreeWalker(paraEl, NodeFilter.SHOW_TEXT);
  let cur: Node | null;
  while ((cur = walker.nextNode())) {
    if (cur === node) return offset + nodeOffset;
    offset += (cur.textContent || "").length;
  }
  return offset;
}

// 강조 구간들을 하이라이트/일반 구간으로 쪼개 렌더링용 세그먼트 배열로 변환
function paraHighlightSegments(text: string, ranges: HighlightRange[]): { text: string; on: boolean }[] {
  if (!text) return [];
  const mask = new Array(text.length).fill(false);
  for (const r of ranges) {
    for (let i = Math.max(0, r.start); i < Math.min(text.length, r.end); i++) mask[i] = true;
  }
  const segments: { text: string; on: boolean }[] = [];
  let i = 0;
  while (i < text.length) {
    const on = mask[i];
    let j = i;
    while (j < text.length && mask[j] === on) j++;
    segments.push({ text: text.slice(i, j), on });
    i = j;
  }
  return segments;
}
type Category = string;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

// ── Shared primitives ──

const APP_HEADER_HEIGHT = "var(--pt-header-height, 52px)";
const APP_HEADER_TOP = "var(--pt-header-top, 16px)";
const APP_CONTENT_TOP = "var(--pt-header-space, 80px)";
const APP_SAFE_BOTTOM = "var(--pt-safe-bottom, 0px)";
const APP_SAFE_LEFT = "var(--pt-safe-left, 0px)";
const APP_SAFE_RIGHT = "var(--pt-safe-right, 0px)";
const APP_INLINE_START = "var(--pt-page-inline-start, 16px)";
const APP_INLINE_END = "var(--pt-page-inline-end, 16px)";
const APP_PANEL_START = `calc(8px + ${APP_SAFE_LEFT})`;
const APP_PANEL_END = `calc(8px + ${APP_SAFE_RIGHT})`;

function CategoryChip({
  label,
  small,
  compactX,
}: {
  label: string;
  small?: boolean;
  compactX?: boolean;
}) {
  const padding = small ? "4px 12px" : compactX ? "6px 12px" : "6px 24px";
  return (
    // w-fit + shrink-0: 부모 레이아웃과 무관하게 항상 내용 크기로 hug (fill 방지)
    <div
      className="inline-flex items-center shrink-0 w-fit rounded-full"
      style={{
        backgroundColor: "var(--pt-chip-bg)",
        padding,
      }}
    >
      <span className="label whitespace-nowrap" style={{ color: "var(--pt-text-brand-strong)" }}>
        {label}
      </span>
    </div>
  );
}

function GlassBtn({
  onClick,
  children,
  size = 40,
  ariaLabel,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  size?: number;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="relative flex items-center justify-center rounded-full shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        boxShadow:
          "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(161.696deg, rgba(255,255,255,0.2) 31.933%, rgba(235,235,235,0.2) 144.03%)",
        }}
      />
      {children}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow:
            "inset 3px 4px 4px white, inset 0px 13px 12px 4px rgba(255,255,255,0.2)",
        }}
      />
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
      <path
        d="M1 1H15M1 7H15M1 13H15"
        stroke="var(--pt-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
      <path
        d="M7 13L1 7L7 1"
        stroke="var(--pt-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
      <path
        d="M1 1L5 5L9 1"
        stroke="var(--pt-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="var(--pt-text-primary)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function InstallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3V15M7 10L12 15L17 10M5 20H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PwaInstallControl({ visible }: { visible: boolean }) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [installed, setInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      navigatorWithStandalone.standalone === true
    );
  });

  const isIos =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigatorWithStandalone.standalone === true;
    setInstalled(standalone);

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setGuideOpen(false);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!guideOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [guideOpen]);

  const requestInstall = async () => {
    if (!installPrompt) {
      setGuideOpen(true);
      return;
    }

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (outcome === "accepted") setInstalled(true);
  };

  if (!visible || installed) return null;

  return (
    <>
      <button
        type="button"
        className="pt-install-button fixed z-30 flex items-center gap-2 rounded-full px-4 py-3 label"
        style={{
          left: `calc(16px + ${APP_SAFE_LEFT})`,
          bottom: `calc(16px + ${APP_SAFE_BOTTOM})`,
          color: "#ffffff",
          backgroundColor: "var(--pt-brand-primary)",
          boxShadow: "0 8px 24px rgba(70,100,203,0.3)",
        }}
        onClick={requestInstall}
        aria-haspopup={installPrompt ? undefined : "dialog"}
      >
        <InstallIcon />
        앱 설치
      </button>

      {guideOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center p-3 min-[480px]:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-guide-title"
        >
          <button
            type="button"
            className="absolute inset-0"
            style={{ backgroundColor: "var(--pt-overlay-heavy)" }}
            onClick={() => setGuideOpen(false)}
            aria-label="설치 안내 닫기"
          />
          <div
            className="relative z-10 w-full max-w-[420px] rounded-[28px] px-6 py-6"
            style={{
              marginBottom: APP_SAFE_BOTTOM,
              backgroundColor: "var(--pt-bg-surface)",
              boxShadow: "0 16px 48px rgba(26,37,53,0.24)",
            }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p
                  id="pwa-install-guide-title"
                  className="title"
                  style={{ color: "var(--pt-text-primary)" }}
                >
                  페이퍼토리 앱 설치
                </p>
                <p className="caption mt-2" style={{ color: "var(--pt-text-secondary)" }}>
                  {isIos
                    ? "Safari에서 아래 순서대로 홈 화면에 추가해 주세요."
                    : "브라우저 메뉴에서 페이퍼토리를 앱으로 설치할 수 있어요."}
                </p>
              </div>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--pt-bg-card)" }}
                onClick={() => setGuideOpen(false)}
                aria-label="설치 안내 닫기"
              >
                <CloseIcon />
              </button>
            </div>

            <ol className="flex flex-col gap-3">
              {(isIos
                ? ["Safari 하단의 공유 버튼을 누르기", "‘홈 화면에 추가’를 선택하기", "‘웹 앱으로 열기’를 켜고 추가하기"]
                : ["브라우저의 더보기 메뉴(⋮) 열기", "‘앱 설치’ 또는 ‘홈 화면에 추가’ 선택하기", "설치 확인 버튼 누르기"]
              ).map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full label"
                    style={{
                      color: "var(--pt-brand-primary)",
                      backgroundColor: "var(--pt-chip-bg)",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span className="body-1" style={{ color: "var(--pt-text-primary)" }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}

function ArrowRightIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 10.67 10.67" fill="none">
      <path
        d="M2 5.33H8.67M5.33 2L8.67 5.33L5.33 8.67"
        stroke={color}
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
      <path
        d="M1 1L7 7L1 13"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

// Lucide square-pen — 카드 스크랩(노트) 아이콘
function ScrapIcon({ color = "var(--pt-text-secondary)" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon({ colorVar = "var(--pt-brand-primary)" }: { colorVar?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M4 3C4 2.44772 4.44772 2 5 2H17C17.5523 2 18 2.44772 18 3V20L11 16.5L4 20V3Z"
        stroke={colorVar}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lucide highlighter — 원문 스크랩 툴바 아이콘
function HighlighterIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="21" height="18" viewBox="0 0 21 18" fill="none">
      <path
        d="M7 8L1 14V17H10L13 14M20 9L15.4 13.6C15.0261 13.9665 14.5235 14.1717 14 14.1717C13.4765 14.1717 12.9739 13.9665 12.6 13.6L7.4 8.4C7.03355 8.02614 6.82829 7.52351 6.82829 7C6.82829 6.47649 7.03355 5.97386 7.4 5.6L12 1"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lucide pencil — 원문 스크랩 툴바 아이콘
function PencilIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M14 4L18 8M20.174 5.812C20.703 5.284 21 4.567 21 3.819C21 3.072 20.703 2.355 20.174 1.826C19.646 1.297 18.929 1 18.181 1C17.434 1 16.717 1.297 16.188 1.825L2.842 15.174C2.610 15.406 2.438 15.691 2.342 16.004L1.021 20.356C0.995 20.443 0.993 20.535 1.015 20.622C1.037 20.710 1.083 20.790 1.147 20.853C1.211 20.917 1.291 20.962 1.378 20.985C1.466 21.007 1.557 21.004 1.644 20.978L5.997 19.658C6.310 19.563 6.595 19.393 6.827 19.161L20.174 5.812Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lucide eraser — 원문 스크랩 툴바 아이콘
function EraserIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
      <path
        d="M20 19H11.834M11.834 19H7C6.736 19.001 6.475 18.949 6.231 18.848C5.987 18.748 5.766 18.600 5.580 18.413L1.586 14.414C1.211 14.039 1 13.530 1 13C1 12.470 1.211 11.961 1.586 11.586L11.586 1.586C11.771 1.400 11.992 1.253 12.235 1.152C12.477 1.052 12.737 1 13 1C13.263 1 13.523 1.052 13.766 1.152C14.008 1.253 14.229 1.400 14.415 1.586L20.414 7.586C20.789 7.961 20.999 8.470 20.999 9C20.999 9.530 20.789 10.039 20.414 10.414L11.834 19ZM4.082 9.090L12.910 17.918"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lucide scissors — 원문 스크랩 툴바 아이콘
function ScissorsIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
      <path
        d="M6.12 6.12L10 10M18 2L6.12 13.88M12.8 12.8L18 18M7 4C7 5.65685 5.65685 7 4 7C2.34315 7 1 5.65685 1 4C1 2.34315 2.34315 1 4 1C5.65685 1 7 2.34315 7 4ZM7 16C7 17.6569 5.65685 19 4 19C2.34315 19 1 17.6569 1 16C1 14.3431 2.34315 13 4 13C5.65685 13 7 14.3431 7 16Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Lucide undo-2 — 원문 스크랩 툴바 아이콘
function UndoIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M6 1L1 6L6 11M1 6H11.5C12.2223 6 12.9375 6.14226 13.6048 6.41866C14.272 6.69506 14.8784 7.10019 15.3891 7.61091C15.8998 8.12163 16.3049 8.72795 16.5813 9.39524C16.8577 10.0625 17 10.7777 17 11.5C17 12.2223 16.8577 12.9375 16.5813 13.6048C16.3049 14.272 15.8998 14.8784 15.3891 15.3891C14.8784 15.8998 14.272 16.3049 13.6048 16.5813C12.9375 16.8577 12.2223 17 11.5 17H8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropdownTab({
  label,
  onClick,
  showChevron = true,
}: {
  label: string;
  onClick?: () => void;
  showChevron?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex min-w-0 max-w-full gap-2 items-center justify-center rounded-3xl"
      // chevron이 없으면 좌우 여백을 같게 맞춰 라벨이 가운데 오도록 함
      style={{ height: 40, paddingLeft: 24, paddingRight: showChevron ? 20 : 24 }}
    >
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(174.232deg, rgba(255,255,255,0.2) 31.933%, rgba(235,235,235,0.2) 144.03%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none border border-white"
        style={{
          boxShadow:
            "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)",
        }}
      />
      <span
        className="title relative min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ color: "var(--pt-text-primary)" }}
      >
        {label}
      </span>
      {showChevron && <ChevronDownIcon />}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          boxShadow:
            "inset 3px 4px 4px white, inset 0px 13px 12px rgba(255,255,255,0.2)",
        }}
      />
    </button>
  );
}

function ToriAvatar({ onClick }: { onClick?: () => void }) {
  return (
    <GlassBtn onClick={onClick} ariaLabel="새 스크랩북 꾸미기">
      <ScrapIcon color="var(--pt-text-primary)" />
    </GlassBtn>
  );
}

// ── App Header ──
function AppHeader({
  dropdownLabel = "Today",
  showBack = false,
  showDropdown = true,
  showDropdownChevron = true,
  showAvatar = true,
  onDropdownClick,
  onBackClick,
  onMenuOpen,
  onAvatarClick,
}: {
  dropdownLabel?: string;
  showBack?: boolean;
  showDropdown?: boolean;
  showDropdownChevron?: boolean;
  showAvatar?: boolean;
  onDropdownClick?: () => void;
  onBackClick?: () => void;
  onMenuOpen?: () => void;
  onAvatarClick?: () => void;
}) {
  return (
    <div
      className="pt-app-header absolute left-0 right-0 flex min-w-0 items-center gap-2 z-10"
      style={{
        top: APP_HEADER_TOP,
        height: APP_HEADER_HEIGHT,
        paddingLeft: APP_INLINE_START,
        paddingRight: APP_INLINE_END,
        filter: "drop-shadow(0px 2px 1px rgba(181,181,181,0.25))",
      }}
    >
      <GlassBtn
        onClick={showBack ? onBackClick : onMenuOpen}
        ariaLabel={showBack ? "뒤로 가기" : "전체 메뉴 열기"}
      >
        {showBack ? <BackArrowIcon /> : <HamburgerIcon />}
      </GlassBtn>

      <div className="flex min-w-0 flex-1 justify-center">
        {showDropdown ? (
          <DropdownTab
            label={dropdownLabel}
            onClick={onDropdownClick}
            showChevron={showDropdownChevron}
          />
        ) : (
          <div className="w-10" />
        )}
      </div>

      {showAvatar ? <ToriAvatar onClick={onAvatarClick} /> : <div style={{ width: 40 }} />}
    </div>
  );
}

// ── Tab Slider ──
// 3단계 스냅 슬라이더 — 노브를 드래그하면 AI모드/원문/쉽게읽기 중 가장 가까운 지점에 스냅됨
// (SKILL: three-level-snap-slider — Pointer Events + 스냅 + 키보드 접근성, React controlled)
function TabSlider({
  active,
  onChange,
}: {
  active: ArticleTab;
  onChange: (t: ArticleTab) => void;
}) {
  const tabs: { id: ArticleTab; label: string }[] = [
    { id: "ai", label: "AI모드" },
    { id: "original", label: "원문" },
    { id: "easy", label: "쉽게읽기" },
  ];
  const activeIdx = tabs.findIndex((t) => t.id === active);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState(activeIdx * 0.5); // 0..1 (드래그 중 노브 위치)

  // 외부에서 탭이 바뀌면(드래그 중이 아닐 때) 노브를 해당 지점으로
  useEffect(() => {
    if (!dragging) setPos(activeIdx * 0.5);
  }, [activeIdx, dragging]);

  const fracFromEvent = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  };
  const snapIdx = (frac: number) => Math.round(frac * 2); // 0..2
  const select = (idx: number) => onChange(tabs[idx].id);

  const onDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setPos(fracFromEvent(e.clientX));
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragging) setPos(fracFromEvent(e.clientX));
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    select(snapIdx(pos));
  };
  const onKey = (e: React.KeyboardEvent) => {
    let idx = activeIdx;
    if (e.key === "ArrowLeft") idx = Math.max(0, activeIdx - 1);
    else if (e.key === "ArrowRight") idx = Math.min(2, activeIdx + 1);
    else if (e.key === "Home") idx = 0;
    else if (e.key === "End") idx = 2;
    else return;
    e.preventDefault();
    select(idx);
  };

  const knobFrac = dragging ? pos : activeIdx * 0.5;
  const shownIdx = dragging ? snapIdx(pos) : activeIdx;

  return (
    <div className="px-5" style={{ paddingTop: 10, paddingBottom: 12 }}>
      <div className="relative" style={{ height: 56 }}>
        <div className="absolute" style={{ left: 12, right: 12, top: 0, bottom: 0 }}>
          {/* Labels above each stop */}
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => select(i)}
              className="absolute caption"
              style={{
                left: `${i * 50}%`,
                top: 0,
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                color: shownIdx === i ? "var(--pt-brand-primary)" : "var(--pt-text-secondary)",
                fontWeight: shownIdx === i ? 700 : 500,
                transition: "color 150ms",
              }}
            >
              {t.label}
            </button>
          ))}

          {/* Track (draggable) */}
          <div
            ref={trackRef}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="absolute"
            style={{ left: 0, right: 0, top: 32, height: 24, touchAction: "none", cursor: "pointer" }}
          >
            {/* rail */}
            <div
              className="absolute rounded-full"
              style={{ left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: 6, backgroundColor: "var(--pt-brand-secondary)" }}
            />
            {/* inactive stop dots */}
            {[0, 1, 2].map((i) =>
              i === shownIdx ? null : (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{ left: `${i * 50}%`, top: "50%", transform: "translate(-50%,-50%)", width: 8, height: 8, backgroundColor: "var(--pt-border-strong)" }}
                />
              )
            )}
            {/* knob */}
            <div
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={2}
              aria-valuenow={shownIdx}
              aria-valuetext={tabs[shownIdx].label}
              aria-label="읽기 모드 선택"
              onKeyDown={onKey}
              className="absolute rounded-full"
              style={{
                left: `${knobFrac * 100}%`,
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: 22,
                height: 22,
                backgroundColor: "var(--pt-brand-primary)",
                boxShadow: "0 0 0 8px rgba(230,249,151,0.7)",
                transition: dragging ? "none" : "left 180ms ease-out",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── News Row ──
function NewsRow({
  category,
  headline,
  onClick,
}: {
  category: string;
  headline: string;
  onClick?: () => void;
}) {
  // 부동산/코리안마켓은 카테고리 라벨이 길어 헤드라인 공간 확보를 위해 좁은 간격을 씀 (Figma 653:3072 참고)
  const isCompact = category === "부동산" || category === "코리안마켓";
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-tl-xl rounded-tr-xl shrink-0"
      style={{
        backgroundColor: "var(--pt-bg-primary)",
        filter: "drop-shadow(0px -4px 2.4px var(--pt-shadow-card))",
      }}
    >
      <div className={`flex items-center px-4 py-3 ${isCompact ? "gap-3" : "gap-6"}`}>
        <CategoryChip label={category} compactX={category === "코리안마켓"} />
        <span
          className="subtitle flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ color: "var(--pt-text-primary)", fontWeight: 600 }}
        >
          {headline}
        </span>
      </div>
    </button>
  );
}

// ── FAB + Toolbar ──
const ARTICLE_TOOL_ITEMS: { tool: Exclude<ArticleTool, "none">; Icon: typeof HighlighterIcon; label: string }[] = [
  { tool: "highlighter", Icon: HighlighterIcon, label: "형광펜" },
  { tool: "pencil", Icon: PencilIcon, label: "펜" },
  { tool: "eraser", Icon: EraserIcon, label: "지우개" },
  { tool: "scissors", Icon: ScissorsIcon, label: "이미지 자르기" },
];

function FAB({
  onPress,
  showToolbar,
  onCloseToolbar,
  tool,
  onSelectTool,
  onUndo,
  canUndo,
}: {
  onPress: () => void;
  showToolbar: boolean;
  onCloseToolbar: () => void;
  tool: ArticleTool;
  onSelectTool: (t: Exclude<ArticleTool, "none">) => void;
  onUndo: () => void;
  canUndo: boolean;
}) {
  const FabIcon =
    tool === "pencil" ? PencilIcon : tool === "eraser" ? EraserIcon : tool === "scissors" ? ScissorsIcon : HighlighterIcon;

  return (
    <>
      {showToolbar && <div className="pt-fab-overlay absolute inset-0 z-20" onClick={onCloseToolbar} />}
      {showToolbar && (
        <div
          className="pt-fab-toolbar absolute flex items-center gap-5 rounded-full p-5 z-30 overflow-x-auto no-scrollbar"
          style={{
            bottom: `calc(${APP_SAFE_BOTTOM} + 24px)`,
            right: APP_INLINE_END,
            maxWidth: "calc(100% - 24px)",
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow:
              "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          {ARTICLE_TOOL_ITEMS.map(({ Icon, label, tool: t }) => {
            const active = tool === t;
            return (
              <button
                key={label}
                aria-label={label}
                aria-pressed={active}
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, backgroundColor: active ? "var(--pt-brand-secondary)" : "transparent" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTool(t);
                }}
              >
                <Icon color={active ? "var(--pt-brand-primary)" : "var(--pt-text-primary)"} />
              </button>
            );
          })}
          <button
            aria-label="실행 취소"
            disabled={!canUndo}
            className="shrink-0 flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, opacity: canUndo ? 1 : 0.35 }}
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
          >
            <UndoIcon />
          </button>
          <button
            aria-label="색상"
            className="shrink-0 rounded-full overflow-hidden"
            style={{ width: 24, height: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imgScrapColorPicker} alt="" className="size-full object-cover" />
          </button>
        </div>
      )}
      {!showToolbar && (
      <button
        onClick={onPress}
        aria-label="스크랩 도구 열기"
        aria-expanded={showToolbar}
        className="pt-fab-button absolute z-30 flex items-center justify-center rounded-full"
        style={{
          bottom: `calc(${APP_SAFE_BOTTOM} + 24px)`,
          right: APP_INLINE_END,
          width: 64,
          height: 64,
          boxShadow:
            "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)",
          backgroundImage:
            "linear-gradient(161.696deg, rgba(255,255,255,0.2) 31.933%, rgba(235,235,235,0.2) 144.03%)",
          border: tool !== "none" ? "2px solid var(--pt-brand-primary)" : "none",
        }}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 3px 4px 4px white, inset 0px 13px 12px rgba(255,255,255,0.2)" }}
        />
        <FabIcon color="var(--pt-brand-primary)" />
      </button>
      )}
    </>
  );
}

// ── Hero Card ──
function HeroCard({ article, onClick }: { article: NewsItem; onClick?: () => void }) {
  return (
    <div
      className="flex flex-col gap-5 px-4 min-[360px]:px-5 w-full"
      style={{ paddingTop: `calc(${APP_CONTENT_TOP} + 10px)`, paddingBottom: 16 }}
    >
      {/* 헤드라인·썸네일·요약 클릭 시 기사 원문으로 이동 */}
      <button onClick={onClick} className="flex flex-col gap-5 w-full text-left">
        <div className="flex flex-col gap-2 items-start" style={{ paddingTop: 20 }}>
          <CategoryChip label={article.category} />
          <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
            {article.headline}
          </p>
        </div>
        <div className="relative rounded-xl overflow-hidden shrink-0 w-full aspect-[353/181]" style={{ marginBottom: 10 }}>
          <ArticleImage
            src={article.image}
            category={article.category}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <p className="body-1 px-3" style={{ color: "var(--pt-text-primary)", textIndent: 8 }}>
          {article.summary}
        </p>
      </button>
      <p
        className="caption text-center"
        style={{ color: "var(--pt-text-secondary)", paddingTop: 10 }}
      >
        {TODAY_DATE_LABEL}
      </p>
    </div>
  );
}

// ── News data (목업) ──
// 한경 CMS 연동 전까지 흐름 확인용 더미 데이터. 스키마(id/category/headline/image/byline/summary)를
// 먼저 고정해 두고, 실제 연동 시 이 배열만 API 응답으로 교체하면 되도록 구성.
type NewsItem = {
  id: string;
  category: string;
  headline: string;
  image: string;
  byline: string;
  summary: string;
  body?: string[];
  ai?: {
    easyBody?: string[];
    suggestedQuestions?: string[];
    qna?: { q: string; a: string }[];
    stakeholders?: { role: string; perspective: string }[];
  };
};

// 기사 썸네일은 카테고리 지면과 동일한 ImageKit 소스를 재사용
const NEWS_IMG = {
  ipo: imgArticle,
  industry: "https://ik.imagekit.io/cuquvvrdw/%E1%84%89%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%A5%E1%86%B8.png",
  economy: "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%A6.png",
  koreaMarket:
    "https://ik.imagekit.io/cuquvvrdw/%E1%84%8F%E1%85%A9%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A1%E1%84%86%E1%85%A1%E1%84%8F%E1%85%A6%E1%86%BA.png",
  realEstate:
    "https://ik.imagekit.io/cuquvvrdw/%E1%84%8C%E1%85%B5%E1%86%B8%E1%84%8F%E1%85%A9%E1%84%82%E1%85%A9%E1%84%86%E1%85%B5.png",
  opinion:
    "https://ik.imagekit.io/cuquvvrdw/%E1%84%8B%E1%85%A9%E1%84%91%E1%85%B5%E1%84%82%E1%85%B5%E1%84%8B%E1%85%A5%E1%86%AB.png?updatedAt=1784606571536",
};

// 기사 원본 이미지가 없거나 한경 CDN에서 내려간 경우 쓰는 카테고리 대표 이미지
// (img.hankyung.com의 일부 경로는 200을 주면서 본문이 0바이트라 브라우저가 렌더하지 못함)
const CATEGORY_FALLBACK_IMG: Record<string, string> = {
  Today: "https://ik.imagekit.io/cuquvvrdw/%E1%84%92%E1%85%A1%E1%86%AB%E1%84%80%E1%85%AE%E1%86%A8%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%A6.png",
  "한경 프리미엄9": "https://ik.imagekit.io/cuquvvrdw/%E1%84%91%E1%85%B3%E1%84%85%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8B%E1%85%A5%E1%86%B79.png",
  경제: "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%A6.png",
  산업: "https://ik.imagekit.io/cuquvvrdw/%E1%84%89%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%A5%E1%86%B8.png",
  코리아마켓: "https://ik.imagekit.io/cuquvvrdw/%E1%84%8F%E1%85%A9%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A1%E1%84%86%E1%85%A1%E1%84%8F%E1%85%A6%E1%86%BA.png",
  글로벌마켓:
    "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A9%E1%84%87%E1%85%A5%E1%86%AF%E1%84%86%E1%85%A1%E1%84%8F%E1%85%A6%E1%86%BA.png?updatedAt=1784606570958",
  집코노미: "https://ik.imagekit.io/cuquvvrdw/%E1%84%8C%E1%85%B5%E1%86%B8%E1%84%8F%E1%85%A9%E1%84%82%E1%85%A9%E1%84%86%E1%85%B5.png",
  오피니언:
    "https://ik.imagekit.io/cuquvvrdw/%E1%84%8B%E1%85%A9%E1%84%91%E1%85%B5%E1%84%82%E1%85%B5%E1%84%8B%E1%85%A5%E1%86%AB.png?updatedAt=1784606571536",
  국제: "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%AE%E1%86%A8%E1%84%8C%E1%85%A6.png",
  유통: "https://ik.imagekit.io/cuquvvrdw/%E1%84%8B%E1%85%B2%E1%84%90%E1%85%A9%E1%86%BC.png",
};
function fallbackImageFor(category: string): string {
  return CATEGORY_FALLBACK_IMG[category] || CATEGORY_FALLBACK_IMG.Today;
}

// 기사 이미지 — 원본이 깨지면 카테고리 대표 이미지로 자동 교체해 빈 액자가 보이지 않게 한다
function ArticleImage({
  src,
  category,
  className,
  style,
}: {
  src: string;
  category: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const fallback = fallbackImageFor(category);
  const [resolved, setResolved] = useState(src || fallback);

  // 기사가 바뀌면 다시 원본부터 시도
  useEffect(() => {
    setResolved(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={resolved}
      alt=""
      className={className}
      style={style}
      onError={() => setResolved((cur) => (cur === fallback ? cur : fallback))}
    />
  );
}

function toNewsItem(a: (typeof articlesData.articles)[number]): NewsItem {
  return {
    id: a.id,
    category: a.category,
    headline: a.headline,
    image: a.imageUrl || fallbackImageFor(a.category),
    byline: `${a.author} · ${ARTICLE_DATE_STR}`,
    summary: a.ai.summary,
    body: a.body,
    ai: {
      easyBody: a.ai.easyBody,
      suggestedQuestions: a.ai.suggestedQuestions,
      qna: a.ai.qna,
      stakeholders: a.ai.stakeholders,
    }
  };
}

// Today 피드는 카테고리와 무관하게 편집부가 선별한 5개 기사 — id 접두사로 판별하고, 카드에는 각자의 실제 카테고리를 표시
const ALL_NEWS: NewsItem[] = articlesData.articles
  .filter(a => a.id.startsWith('today-'))
  .map(toNewsItem);

// 카테고리별 실제 기사만 필터링 (드롭다운에서 고른 카테고리와 정확히 일치하는 기사만 노출)
function getNewsByCategory(category: string): NewsItem[] {
  return articlesData.articles.filter(a => a.category === category).map(toNewsItem);
}

// ── Landing Screen ──
function LandingScreen({
  category,
  onDropdownClick,
  onNewsClick,
  onMenuOpen,
}: {
  category: Category;
  onDropdownClick: () => void;
  onNewsClick: (article: NewsItem) => void;
  onMenuOpen: () => void;
}) {
  const sectionTitle =
    category === "Today" ? "오늘의 주요뉴스" : `오늘의 ${category} 주요뉴스`;

  // items[0] = 히어로(요약본), 나머지 = 하단 카드 목록
  const [items, setItems] = useState<NewsItem[]>(() =>
    category === "Today" ? ALL_NEWS : getNewsByCategory(category)
  );
  const hero = items[0];
  const cards = items.slice(1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // 직전 히어로가 내려간 카드 위치. 최초 렌더·카테고리 전환 때는 null이라 애니메이션을 건너뜀
  const demotedIdxRef = useRef<number | null>(null);

  useEffect(() => {
    demotedIdxRef.current = null;
    setItems(category === "Today" ? ALL_NEWS : getNewsByCategory(category));
  }, [category]);

  // 카드를 누르면 그 기사를 히어로로 끌어올리고, 기존 히어로는 그 카드 자리로 내려보냄
  const promoteToHero = (cardIdx: number) => {
    demotedIdxRef.current = cardIdx;
    setItems((prev) => {
      const next = [...prev];
      [next[0], next[cardIdx + 1]] = [next[cardIdx + 1], next[0]];
      return next;
    });
    const scroller = scrollRef.current;
    if (scroller && scroller.scrollHeight > scroller.clientHeight + 1) {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const demoted = demotedIdxRef.current;
    demotedIdxRef.current = null;
    if (demoted === null) return;

    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
    const demotedRow = listRef.current?.children[demoted];
    if (demotedRow) {
      gsap.fromTo(
        demotedRow,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.05 }
      );
    }
  }, [items]);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        dropdownLabel={category === "Today" ? "Today" : category}
        onDropdownClick={onDropdownClick}
        onMenuOpen={onMenuOpen}
        showAvatar={false}
      />
      <div
        ref={scrollRef}
        className="pt-content-column pt-scroll h-full overflow-y-auto pb-24"
        style={{ paddingLeft: APP_SAFE_LEFT, paddingRight: APP_SAFE_RIGHT }}
      >
        {hero ? (
          <div ref={heroRef}>
            <HeroCard article={hero} onClick={() => onNewsClick(hero)} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5" style={{ paddingTop: 160 }}>
            <p className="body-1" style={{ color: "var(--pt-text-secondary)" }}>
              아직 준비된 기사가 없어요
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2 pt-8">
          <div className="px-5">
            <p className="subtitle" style={{ color: "var(--pt-text-primary)", fontSize: 18 }}>
              {sectionTitle}
            </p>
          </div>
          <div ref={listRef} className="flex flex-col gap-2.5 py-2">
            {cards.map((n, i) => (
              <NewsRow
                key={n.id}
                category={n.category}
                headline={n.headline}
                onClick={() => promoteToHero(i)}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Category Card ──
function CategoryCard({
  label,
  subtitle,
  image,
  style,
  className,
  onClick,
}: {
  label: string;
  subtitle: string;
  image: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute rounded-xl overflow-hidden text-left${className ? ` ${className}` : ""}`}
      style={{
        width: "min(208px, calc(100% - 32px))",
        height: "min(298px, calc(100% - 32px))",
        border: "1px solid var(--pt-brand-primary)",
        opacity: 0.9,
        boxShadow: "0px 8px 8px rgba(26,37,53,0.25)",
        ...style,
      }}
    >
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <div className="absolute top-3 left-2.5">
        <CategoryChip label={label} />
      </div>
      <p
        className="subtitle absolute bottom-4 right-3 text-right overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ color: "#ECF0F9", maxWidth: 180 }}
      >
        {subtitle}
      </p>
    </button>
  );
}

// ── Category page DB (GA_카테고리페이지템플릿db) ──
// 카테고리,image URL,TITLE,SUBTITLE — "Today"는 다른 카테고리에서 전체 피드로 돌아가는 경로로 포함
const CATEGORY_PAGE_DB: { title: string; subtitle: string; imageUrl: string }[] = [
  {
    title: "Today",
    subtitle: "오늘 주요 뉴스",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%92%E1%85%A1%E1%86%AB%E1%84%80%E1%85%AE%E1%86%A8%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%A6.png",
  },
  {
    title: "한경 프리미엄9",
    subtitle: "국내주식 · 해외주식 · 자산관리",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%91%E1%85%B3%E1%84%85%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8B%E1%85%A5%E1%86%B79.png",
  },
  {
    title: "경제",
    subtitle: "경제정책 · 거시경제 · 세금",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%A7%E1%86%BC%E1%84%8C%E1%85%A6.png",
  },
  {
    title: "산업",
    subtitle: "반도체 · 자동차 · 조선",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%89%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%A5%E1%86%B8.png",
  },
  {
    title: "코리아마켓",
    subtitle: "시장지표 · 컨센서스 · 종목",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%8F%E1%85%A9%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A1%E1%84%86%E1%85%A1%E1%84%8F%E1%85%A6%E1%86%BA.png",
  },
  {
    title: "글로벌마켓",
    subtitle: "미국시세 · 투자의견 · 실적",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A9%E1%84%87%E1%85%A5%E1%86%AF%E1%84%86%E1%85%A1%E1%84%8F%E1%85%A6%E1%86%BA.png?updatedAt=1784606570958",
  },
  {
    title: "집코노미",
    subtitle: "시장동향 · 분양 · 매물",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%8C%E1%85%B5%E1%86%B8%E1%84%8F%E1%85%A9%E1%84%82%E1%85%A9%E1%84%86%E1%85%B5.png",
  },
  {
    title: "오피니언",
    subtitle: "사설 · 칼럼 · 기고",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%8B%E1%85%A9%E1%84%91%E1%85%B5%E1%84%82%E1%85%B5%E1%84%8B%E1%85%A5%E1%86%AB.png?updatedAt=1784606571536",
  },
  {
    title: "국제",
    subtitle: "미국 · 중국 · 유럽",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%AE%E1%86%A8%E1%84%8C%E1%85%A6.png",
  },
  {
    title: "유통",
    subtitle: "백화점 · e커머스 · 뷰티",
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%8B%E1%85%B2%E1%84%90%E1%85%A9%E1%86%BC.png",
  },
];

function CategoryScreen({
  onCategorySelect,
  onBack,
}: {
  onCategorySelect: (cat: Category) => void;
  onBack?: () => void;
}) {
  const cards: { label: Category; subtitle: string; image: string }[] = CATEGORY_PAGE_DB.map(
    (row) => ({ label: row.title, subtitle: row.subtitle, image: row.imageUrl })
  );
  const N = cards.length;

  const containerRef = useRef<HTMLDivElement>(null); // Lenis wrapper / ScrollTrigger scroller
  const contentRef = useRef<HTMLDivElement>(null); // Lenis content / scroll-length spacer
  const [stageHeight, setStageHeight] = useState(0);
  const distancePerCard = Math.min(220, Math.max(140, stageHeight * 0.28));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => setStageHeight(container.clientHeight);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content || stageHeight <= 0) return;

    // 브라우저가 리로드 시 이전 스크롤 위치를 복원하는 경우가 있어, 항상 첫 카드(Today)부터 시작하도록 고정
    container.scrollTop = 0;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 현재 컨테이너 높이에 맞춰 캐스케이드 간격과 진입 거리를 조정한다.
    const STEP_Y = Math.min(132, Math.max(56, stageHeight * 0.16));
    const PUSH = Math.min(46, Math.max(28, stageHeight * 0.06));
    const FADE_RANGE = Math.max(3, Math.min(N - 1, 6));
    const DIM_PER_STEP = 0.35; // 뒤에 가려진 카드일수록 투명도·명도를 낮추는 정도
    const INTRO_DROP = Math.min(380, Math.max(140, stageHeight * 0.45));

    const els = Array.from(content.querySelectorAll<HTMLElement>(".cascade-card"));

    let lenis: Lenis | null = null;
    function raf(time: number) {
      lenis?.raf(time * 1000);
    }
    if (!reduced) {
      lenis = new Lenis({ wrapper: container, content, lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // 스크롤 진행도(progress)만으로 카드별 최종 배치값을 계산하는 순수 함수
    function computeLayout(progress: number) {
      const focusIndex = progress * (N - 1);
      return els.map((_, i) => {
        const pos = i - focusIndex;
        const dist = Math.abs(pos);
        const near = Math.max(0, 1 - dist);
        const falloff = Math.max(0, 1 - dist / 1.8);
        // Math.sign(pos)는 pos가 0을 지날 때 카드가 튀는 원인이라 tanh로 매끄럽게 처리
        const push = Math.tanh(pos * 1.7) * PUSH * falloff;
        // 화면 밖으로 멀어질수록 서서히 사라지는 전체 페이드
        const t = gsap.utils.clamp(0, 1, dist / FADE_RANGE);
        const farFade = 1 - t * t;
        // 바로 뒤에 가려진 카드부터 곧바로 살짝 어둡고 흐리게 — 카드 한 장 거리(dist=1)면 최대로 적용
        const depthT = gsap.utils.clamp(0, 1, dist);
        const dim = 1 - depthT * DIM_PER_STEP;
        return {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: pos * STEP_Y + push,
          scale: 0.94 + near * 0.14,
          opacity: dim * farFade,
          filter: `brightness(${dim})`,
          zIndex: Math.round((1 - dist) * 1000),
        };
      });
    }

    function layout(progress: number) {
      const targets = computeLayout(progress);
      els.forEach((el, i) => gsap.set(el, targets[i]));
    }

    // 진입 인트로가 예약/재생 중인지. 스크롤이 실제로 시작되면 해제하고 스크롤에 제어를 넘김
    let introActive = !reduced;
    let introTween: gsap.core.Tween | null = null;
    let cancelled = false;

    const proxy = { p: 0 };
    const tween = gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        scroller: container,
        trigger: content,
        start: "top top",
        end: () => "+=" + N * distancePerCard,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (N - 1),
          duration: { min: 0.15, max: 0.35 },
          ease: "power2.inOut",
        },
      },
      onUpdate() {
        // 인트로가 카드를 쥐고 있는 동안에는 스크롤 갱신이 배치를 덮어쓰지 않도록 무시
        // (마운트 직후 refresh·snap이 progress를 미세하게 건드려 인트로가 끊기던 문제)
        if (introActive) return;
        layout(proxy.p);
      },
    });

    // 실제 사용자 입력이 들어오면 인트로를 접고 스크롤에 제어를 넘김
    function cancelIntro() {
      if (!introActive) return;
      introActive = false;
      introTween?.kill();
      layout(proxy.p);
    }
    container.addEventListener("wheel", cancelIntro, { passive: true });
    container.addEventListener("touchstart", cancelIntro, { passive: true });

    ScrollTrigger.refresh();

    if (reduced) {
      layout(0);
    } else {
      // 인트로: 카드가 화면 위에서 순서대로 내려와 아래로 쌓이고,
      // 끝나면 progress 0의 기본 배치(첫 카드가 가운데)에 그대로 안착 — 최종 모습은 기존과 동일
      const targets = computeLayout(0);
      // 최종 배치가 한 프레임 비쳤다 사라지지 않도록 시작 상태(화면 위·투명)를 먼저 세팅
      els.forEach((el, i) =>
        gsap.set(el, { ...targets[i], y: targets[i].y - INTRO_DROP, opacity: 0 })
      );

      // 썸네일이 뜨기 전 빈 카드가 떨어지지 않도록 이미지 로드를 잠깐 기다림(최대 600ms)
      const imagesReady = Promise.all(
        els.map((el) => {
          const img = el.querySelector("img");
          if (!img || img.complete) return Promise.resolve();
          return new Promise<void>((res) => {
            img.onload = img.onerror = () => res();
          });
        })
      );
      Promise.race([imagesReady, new Promise((res) => setTimeout(res, 300))]).then(() => {
        if (cancelled || !introActive) return;
        introTween = gsap.to(els, {
          y: (i: number) => targets[i].y,
          opacity: (i: number) => targets[i].opacity,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.11,
          onComplete() {
            introActive = false;
          },
        });
      });
    }

    return () => {
      cancelled = true;
      introTween?.kill();
      container.removeEventListener("wheel", cancelIntro);
      container.removeEventListener("touchstart", cancelIntro);
      tween.scrollTrigger?.kill();
      tween.kill();
      lenis?.destroy();
      gsap.ticker.remove(raf);
    };
  }, [N, distancePerCard, stageHeight]);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{
        background:
          "linear-gradient(162.946deg, #ffffff 2.5%, var(--pt-bg-primary) 50%, #EFF1F5 103%)",
      }}
    >
      <div
        ref={containerRef}
        className="pt-scroll absolute inset-0 overflow-y-auto"
        style={{ paddingLeft: APP_SAFE_LEFT, paddingRight: APP_SAFE_RIGHT }}
      >
        <div
          ref={contentRef}
          style={{
            height: stageHeight > 0 ? stageHeight + N * distancePerCard : "100%",
            opacity: stageHeight > 0 ? 1 : 0,
          }}
        >
          <div className="relative" style={{ position: "sticky", top: 0, height: stageHeight || "100%" }}>
            {cards.map((c) => (
              <CategoryCard
                key={c.label}
                label={c.label}
                subtitle={c.subtitle}
                image={c.image}
                className="cascade-card"
                style={{ top: "50%", left: "50%" }}
                onClick={() => onCategorySelect(c.label)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* 카테고리를 고르지 않고도 이전 지면으로 돌아갈 수 있게 하는 뒤로가기 */}
      <div
        className="pt-app-header absolute left-0 flex items-center z-20"
        style={{
          top: APP_HEADER_TOP,
          height: APP_HEADER_HEIGHT,
          paddingLeft: APP_INLINE_START,
          filter: "drop-shadow(0px 2px 1px rgba(181,181,181,0.25))",
        }}
      >
        <GlassBtn onClick={onBack} ariaLabel="뒤로 가기">
          <BackArrowIcon />
        </GlassBtn>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Original Tab Content ──
// 가위 도구 — 히어로 이미지 위에서 드래그한 사각형을 그대로 잘라 클리핑으로 저장
function ImageCropOverlay({ active, onCropped }: { active: boolean; onCropped: (dataUrl: string) => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  if (!active) return null;

  const clampPt = (e: React.PointerEvent) => {
    const r = overlayRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - r.left, 0), r.width),
      y: Math.min(Math.max(e.clientY - r.top, 0), r.height),
    };
  };

  const onDown = (e: React.PointerEvent) => {
    const p = clampPt(e);
    startRef.current = p;
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!startRef.current) return;
    const p = clampPt(e);
    const s = startRef.current;
    setRect({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) });
  };
  const onUp = () => {
    const r = rect;
    startRef.current = null;
    setRect(null);
    if (!r || r.w < 12 || r.h < 12) return;
    const img = overlayRef.current?.parentElement?.querySelector("img");
    if (!(img instanceof HTMLImageElement) || !img.complete || !img.naturalWidth) return;
    const cw = overlayRef.current!.clientWidth;
    const ch = overlayRef.current!.clientHeight;
    // object-fit: cover 매핑 — 화면 표시 좌표를 원본 이미지 픽셀 좌표로 환산
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const offsetX = (img.naturalWidth * scale - cw) / 2;
    const offsetY = (img.naturalHeight * scale - ch) / 2;
    const sx = (r.x + offsetX) / scale;
    const sy = (r.y + offsetY) / scale;
    const sw = r.w / scale;
    const sh = r.h / scale;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sw));
    canvas.height = Math.max(1, Math.round(sh));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    try {
      onCropped(canvas.toDataURL("image/png"));
    } catch {
      // 캔버스가 오염된 경우(외부 도메인 이미지 등) 조용히 무시
    }
  };

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-10"
      style={{ touchAction: "none", cursor: "crosshair" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {rect && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h,
            border: "2px solid var(--pt-brand-primary)",
            backgroundColor: "rgba(96,131,245,0.18)",
          }}
        />
      )}
    </div>
  );
}

function OriginalContent({
  article,
  tool = "none",
  highlights,
  onHighlightRange,
  onImageCropped,
}: {
  article: NewsItem;
  tool?: ArticleTool;
  highlights?: HighlightRange[];
  onHighlightRange?: (para: number, start: number, end: number, text: string) => void;
  onImageCropped?: (dataUrl: string) => void;
}) {
  const paras = article.body || [];
  const ranges = highlights ?? [];

  // 형광펜 도구일 때만: 드래그로 고른 텍스트 범위를 문단 기준 문자 오프셋으로 환산해 강조
  const handleSelectionUp = () => {
    if (tool !== "highlighter") return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const startEl = (
      range.startContainer.nodeType === 1 ? (range.startContainer as Element) : range.startContainer.parentElement
    )?.closest<HTMLElement>("[data-para-index]");
    const endEl = (
      range.endContainer.nodeType === 1 ? (range.endContainer as Element) : range.endContainer.parentElement
    )?.closest<HTMLElement>("[data-para-index]");
    if (!startEl || !endEl || startEl !== endEl) {
      sel.removeAllRanges();
      return;
    }
    const idx = Number(startEl.dataset.paraIndex);
    const a = textOffsetInPara(startEl, range.startContainer, range.startOffset);
    const b = textOffsetInPara(startEl, range.endContainer, range.endOffset);
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    sel.removeAllRanges();
    if (hi <= lo) return;
    const text = (paras[idx] || "").slice(lo, hi);
    if (text.trim()) onHighlightRange?.(idx, lo, hi, text);
  };

  return (
    <div className="flex flex-col gap-5 px-5 py-4 w-full">
      <div className="flex flex-col gap-2" style={{ minHeight: 144 }}>
        <CategoryChip label={article.category} />
        <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
          {article.headline}
        </p>
        <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>
          {article.byline}
        </p>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full aspect-[353/181]">
        <ArticleImage
          src={article.image}
          category={article.category}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <ImageCropOverlay active={tool === "scissors"} onCropped={(d) => onImageCropped?.(d)} />
      </div>
      <div
        className="rounded-lg px-3 py-2 flex items-center gap-2"
        style={{ backgroundColor: "var(--pt-bg-accent-light)" }}
      >
        <span className="rounded-full" style={{ width: 14, height: 14, backgroundColor: "var(--pt-brand-secondary)" }} />
        <span className="caption" style={{ color: "var(--pt-text-dark-green)" }}>
          {tool === "scissors"
            ? "이미지를 드래그해서 자유롭게 오려보세요"
            : tool === "pencil"
              ? "펜으로 원문 위에 자유롭게 필기해보세요"
              : tool === "eraser"
                ? "형광펜 표시나 펜 필기 위를 눌러 지워보세요"
                : tool === "highlighter"
                  ? "원하는 부분을 드래그하면 그 부분만 형광펜으로 강조돼요 (클립보드에 저장)"
                  : "하단 도구에서 형광펜을 선택하고 문장을 드래그해보세요"}
        </span>
      </div>
      <div className="flex flex-col gap-4" onPointerUp={handleSelectionUp}>
        {paras.map((text, i) => {
          const paraRanges = ranges.filter((r) => r.para === i);
          const segments = paraHighlightSegments(text, paraRanges);
          return (
            <p
              key={i}
              data-para-index={i}
              className="body-2"
              style={{
                color: "var(--pt-text-primary)",
                textIndent: 8,
                letterSpacing: "-0.32px",
                cursor: tool === "highlighter" ? "text" : undefined,
              }}
            >
              {segments.map((seg, si) =>
                seg.on ? (
                  <span
                    key={si}
                    style={{ backgroundColor: "rgba(230,249,151,0.85)", borderRadius: 4, boxDecorationBreak: "clone" }}
                  >
                    {seg.text}
                  </span>
                ) : (
                  <span key={si}>{seg.text}</span>
                )
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// ── AI Tab Content ──
// 내지갑 번역기 목업 — 기사 수치·용어를 "내 자산 관점"으로 풀어주는 카드(PRD P1).
// 보유 종목/해설은 추후 기사별 데이터로 교체 예정이라 상수로 분리해 둠.
const WALLET_TRANSLATION = {
  holding: "아마존·구글 주식 보유중 - 12주",
  body:
    "아마존과 구글은 앤트로픽의 핵심 주주에요.\n앤트로픽이 거대한 기업가치로 상장에 성공하면, 빅테크 기업의 지분 가치 재평가로 인해 주가가 동반 상승하는 수혜를 누릴 가능성이 높아요.",
};

function AiContent({ article }: { article: NewsItem }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ from: "tori" | "user"; text: string }[]>([
    { from: "tori", text: "안녕! 나는 토리야. 궁금한 내용 쉽게 알려줄게!" },
  ]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());

  const sendMessage = () => {
    const q = message.trim();
    if (!q) return;
    const matched = article.ai?.qna?.find((item) => item.q === q);
    const answer = matched?.a ?? "미안, 이 질문은 아직 준비된 답변이 없어! 다른 방식으로 다시 물어봐줄래?";
    setChat((prev) => [
      ...prev,
      { from: "user", text: q },
      { from: "tori", text: answer },
    ]);
    setAskedQuestions((prev) => new Set(prev).add(q));
    setMessage("");
  };

  const suggested = (article.ai?.qna?.map((item) => item.q) ?? []).filter((q) => !askedQuestions.has(q));

  return (
    <div className="flex flex-col gap-5 px-5 py-4 w-full">
      {/* 내지갑 번역기 */}
      <div
        className="rounded-3xl px-4 py-4 flex flex-col gap-3"
        style={{
          backgroundColor: "var(--pt-bg-accent-light)",
          filter: "drop-shadow(2px 2px 4px var(--pt-shadow-card))",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="shrink-0" style={{ width: 28, height: 28, position: "relative" }}>
            <img
              src={imgToriChat}
              alt="토리"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          </div>
          <span className="label" style={{ color: "var(--pt-text-primary)" }}>
            내지갑 번역기
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="title" style={{ color: "var(--pt-text-primary)" }}>
            {WALLET_TRANSLATION.holding}
          </p>
          <p className="label" style={{ color: "var(--pt-brand-primary)" }}>
            {article.headline}
          </p>
        </div>

        <p
          className="caption leading-5 whitespace-pre-line"
          style={{ color: "var(--pt-text-primary)" }}
        >
          {WALLET_TRANSLATION.body}
        </p>
      </div>

      {/* Perspectives card */}
      <div
        className="rounded-3xl px-4 py-3 flex flex-col gap-8"
        style={{
          backgroundColor: "#EFF1F5",
          filter: "drop-shadow(2px 2px 4px var(--pt-shadow-card))",
        }}
      >
        <p className="subtitle opacity-80" style={{ color: "var(--pt-text-indigo)", fontSize: 18 }}>
          다양한 시각 읽어보기
        </p>
        <div className="flex flex-col gap-5">
          {(article.ai?.stakeholders ?? []).map((item) => (
            <div key={item.role} className="flex flex-col gap-3">
              <div
                className="relative flex items-center rounded-full self-start"
                style={{ padding: "4px 24px", backgroundColor: "var(--pt-chip-bg)" }}
              >
                <div className="absolute inset-[-3px] rounded-full pointer-events-none border-[3px] border-white" />
                <span className="label" style={{ color: "var(--pt-text-brand-strong)" }}>
                  {item.role}
                </span>
              </div>
              <p className="caption leading-5 opacity-80 px-1 whitespace-pre-line" style={{ color: "var(--pt-text-indigo)" }}>
                {item.perspective}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div
        className="rounded-[36px] border"
        style={{ borderColor: "#C6C6C6", backgroundColor: "rgba(252,255,238,0.7)" }}
      >
        <div
          className="flex items-center px-8 py-2 rounded-t-[36px] border-b"
          style={{
            backgroundColor: "var(--pt-chip-bg)",
            borderColor: "rgba(198,198,198,0.6)",
            height: 47.6,
          }}
        >
          <span className="body-2" style={{ color: "var(--pt-text-primary)", fontSize: 14 }}>
            AI에게 질문하기
          </span>
        </div>
        <div className="flex flex-col gap-8 px-4 py-3" style={{ minHeight: 180 }}>
          {chat.map((msg, i) => (
            <div key={i} className={`flex items-start gap-2 ${msg.from === "user" ? "justify-end" : ""}`}>
              {msg.from === "tori" && (
                <div className="shrink-0" style={{ width: 37, height: 37 }}>
                  <img src={imgToriChat} alt="Tori" className="w-full h-full object-contain" />
                </div>
              )}
              <div
                className="relative rounded-3xl px-3.5 py-2.5 max-w-[240px]"
                style={{
                  backgroundColor: msg.from === "tori" ? "var(--pt-chip-bg)" : "#D0DAFC",
                  border: msg.from === "tori" ? "1.3px solid var(--pt-border-accent)" : "none",
                }}
              >
                <p className="caption leading-5 opacity-80" style={{ color: "var(--pt-text-primary)" }}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto flex gap-2.5 px-3 py-2 no-scrollbar">
          {suggested.map((q) => (
            <button
              key={q}
              onClick={() => setMessage(q)}
              className="caption shrink-0 rounded-xl px-5 py-2.5 border whitespace-nowrap"
              style={{
                backgroundColor: "var(--pt-chip-bg)",
                borderColor: "rgba(0,0,0,0.1)",
                color: "var(--pt-text-primary)",
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <div className="px-2.5 pb-6 pt-2.5">
          <div
            className="relative flex items-center rounded-full bg-white"
            style={{ height: 40, border: "1.4px solid #ECECEC" }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="질문을 입력하세요"
              className="caption flex-1 min-w-0 px-4 bg-transparent outline-none"
              style={{ color: "var(--pt-text-primary)" }}
            />
            <button
              onClick={sendMessage}
              className="shrink-0 flex items-center justify-center rounded-full mr-2"
              style={{ width: 24, height: 24, backgroundColor: "var(--pt-brand-primary)" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 8V2M2 5L5 2L8 5"
                  stroke="var(--pt-brand-secondary)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Easy Tab Content ──
function EasyContent({ article }: { article: NewsItem }) {
  const easyTexts = article && 'ai' in article && article.ai?.easyBody ? article.ai.easyBody : [];

  return (
    <div className="flex flex-col gap-5 px-5 py-4 w-full">
      <div
        className="rounded-xl flex items-center gap-4 px-4 py-2.5"
        style={{
          backgroundColor: "#FCFFF1",
          filter: "drop-shadow(2px 2px 4px var(--pt-shadow-card))",
        }}
      >
        <div className="flex flex-col flex-1">
          <p className="label opacity-80 leading-5" style={{ color: "#354B0E" }}>
            어려운 경제뉴스, 토리가 읽기 쉽게 바꿨어요!
          </p>
        </div>
        <div className="-scale-x-100 shrink-0" style={{ width: 54, height: 54 }}>
          <img src={imgToriChat} alt="Tori" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="flex flex-col gap-2" style={{ minHeight: 144 }}>
        <CategoryChip label={article.category} />
        <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
          {article.headline}
        </p>
        <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>
          {article.byline}
        </p>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full aspect-[353/181]">
        <ArticleImage
          src={article.image}
          category={article.category}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4">
        {easyTexts.map((text, i) => (
          <p
            key={i}
            className="body-2"
            style={{
              color: "var(--pt-text-primary)",
              textIndent: 8,
              letterSpacing: "-0.32px",
              lineHeight: "26px",
            }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Article Screen ──
function ArticleScreen({
  article,
  activeTab,
  onTabChange,
  onBack,
  onComplete,
  onReadComplete,
  onToggleClip,
  onOpenScrapbook,
  initialHighlights,
  initialStrokes,
  onAnnotationsChange,
}: {
  article: NewsItem;
  activeTab: ArticleTab;
  onTabChange: (t: ArticleTab) => void;
  onBack: () => void;
  onComplete?: () => void;
  onReadComplete?: () => void;
  onToggleClip?: (text: string, on: boolean) => void;
  onOpenScrapbook?: () => void;
  initialHighlights?: HighlightRange[];
  initialStrokes?: ArticleStroke[];
  onAnnotationsChange?: (highlights: HighlightRange[], strokes: ArticleStroke[]) => void;
}) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const completedRef = useRef(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 기사 진입 7초 후 완독 처리 — 최신 콜백을 ref로 참조해 부모 리렌더로 콜백 참조가
  // 바뀌어도(예: 형광펜 클리핑) 타이머가 재시작되지 않도록 함
  const [readToastVisible, setReadToastVisible] = useState(false);
  const onReadCompleteRef = useRef(onReadComplete);
  onReadCompleteRef.current = onReadComplete;
  useEffect(() => {
    const t = window.setTimeout(() => {
      onReadCompleteRef.current?.();
      setReadToastVisible(true);
      window.setTimeout(() => setReadToastVisible(false), 1800);
    }, 7000);
    return () => window.clearTimeout(t);
  }, []);

  // 원문 스크랩 툴바 — 형광펜/펜/지우개/가위(이미지 자르기)/실행취소
  const [tool, setTool] = useState<ArticleTool>("none");
  const [highlights, setHighlights] = useState<HighlightRange[]>(initialHighlights ?? []);
  const [strokes, setStrokes] = useState<ArticleStroke[]>(initialStrokes ?? []);
  const [history, setHistory] = useState<ArticleAction[]>([]);
  const drawingRef = useRef<ArticleStroke | null>(null);
  const erasingRef = useRef(false);
  const [, forceDraw] = useState(0);
  const ERASE_R = 18;

  // 형광펜/볼펜 필기는 기사별로 자동저장 — 나갔다가 같은 기사로 돌아와도 그대로 보이도록.
  // 최초 마운트(초기값 세팅)는 변경으로 치지 않음
  const annotationsMounted = useRef(false);
  useEffect(() => {
    if (!annotationsMounted.current) {
      annotationsMounted.current = true;
      return;
    }
    onAnnotationsChange?.(highlights, strokes);
  }, [highlights, strokes]);
  const uid = () => Math.random().toString(36).slice(2, 9);

  const removeHighlightById = (id: string) => {
    setHighlights((prev) => {
      const found = prev.find((h) => h.id === id);
      if (found?.text) onToggleClip?.(found.text, false);
      return prev.filter((h) => h.id !== id);
    });
  };
  // 지우개로 짚은 문자 위치를 포함하는 강조 구간이 있으면 통째로 제거
  const removeHighlightAt = (para: number, charOffset: number) => {
    setHighlights((prev) => {
      const hit = prev.find((h) => h.para === para && charOffset >= h.start && charOffset < h.end);
      if (!hit) return prev;
      if (hit.text) onToggleClip?.(hit.text, false);
      return prev.filter((h) => h.id !== hit.id);
    });
  };
  const addHighlightRange = (para: number, start: number, end: number, text: string) => {
    const id = uid();
    setHighlights((prev) => [...prev, { id, para, start, end, text }]);
    if (text) onToggleClip?.(text, true);
    setHistory((h) => [...h, { t: "highlight", id }]);
  };
  const addImageClip = (dataUrl: string) => {
    onToggleClip?.(dataUrl, true);
    setHistory((h) => [...h, { t: "clip", text: dataUrl }]);
  };
  const undo = () => {
    setHistory((h) => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      if (last.t === "stroke") setStrokes((v) => v.filter((s) => s.id !== last.id));
      else if (last.t === "highlight") removeHighlightById(last.id);
      else if (last.t === "clip") onToggleClip?.(last.text, false);
      return h.slice(0, -1);
    });
  };

  const pointFromEvent = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const eraseStrokesNear = (p: { x: number; y: number }) =>
    setStrokes((v) => v.filter((s) => !s.pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < ERASE_R)));
  const eraseAt = (e: React.PointerEvent<SVGSVGElement>, p: { x: number; y: number }) => {
    eraseStrokesNear(p);
    // caretPositionFromPoint가 오버레이 자신이 아니라 아래 문단 텍스트를 찾도록 잠시 클릭 통과시킴
    const svg = e.currentTarget;
    const prevPE = svg.style.pointerEvents;
    svg.style.pointerEvents = "none";
    type CaretPosition = { offsetNode: Node; offset: number };
    type DocWithCaret = Document & {
      caretPositionFromPoint?: (x: number, y: number) => CaretPosition | null;
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
    };
    const doc = document as DocWithCaret;
    let caretNode: Node | null = null;
    let caretOffset = 0;
    if (doc.caretPositionFromPoint) {
      const pos = doc.caretPositionFromPoint(e.clientX, e.clientY);
      if (pos) {
        caretNode = pos.offsetNode;
        caretOffset = pos.offset;
      }
    } else if (doc.caretRangeFromPoint) {
      const r = doc.caretRangeFromPoint(e.clientX, e.clientY);
      if (r) {
        caretNode = r.startContainer;
        caretOffset = r.startOffset;
      }
    }
    svg.style.pointerEvents = prevPE;
    const caretEl = (caretNode?.nodeType === 1 ? (caretNode as Element) : caretNode?.parentElement)?.closest<HTMLElement>(
      "[data-para-index]"
    );
    if (caretNode && caretEl) {
      const idx = Number(caretEl.dataset.paraIndex);
      if (!Number.isNaN(idx)) removeHighlightAt(idx, textOffsetInPara(caretEl, caretNode, caretOffset));
    }
  };
  const onCanvasDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = pointFromEvent(e);
    if (tool === "pencil") {
      drawingRef.current = { id: uid(), pts: [p] };
      e.currentTarget.setPointerCapture?.(e.pointerId);
      forceDraw((n) => n + 1);
    } else if (tool === "eraser") {
      erasingRef.current = true;
      eraseAt(e, p);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
  };
  const onCanvasMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = pointFromEvent(e);
    if (drawingRef.current) {
      drawingRef.current.pts.push(p);
      forceDraw((n) => n + 1);
    } else if (erasingRef.current) {
      eraseAt(e, p);
    }
  };
  const onCanvasUp = () => {
    if (drawingRef.current) {
      const s = drawingRef.current;
      if (s.pts.length > 1) {
        setStrokes((v) => [...v, s]);
        setHistory((h) => [...h, { t: "stroke", id: s.id }]);
      }
      drawingRef.current = null;
      forceDraw((n) => n + 1);
    }
    erasingRef.current = false;
  };
  const drawLive = drawingRef.current;

  // AI모드로 넘어가면 FAB이 사라지므로 열려 있던 툴바도 함께 닫아 둔다
  useEffect(() => {
    if (activeTab === "ai") setShowToolbar(false);
  }, [activeTab]);

  useEffect(() => {
    const viewport = window.visualViewport;
    const screenEl = screenRef.current;
    if (!viewport || !screenEl) return;

    const updateInset = () => {
      const visibleBottom = viewport.offsetTop + viewport.height;
      const overlap = Math.max(0, screenEl.getBoundingClientRect().bottom - visibleBottom);
      setKeyboardInset(overlap);

      if (
        overlap > 0 &&
        document.activeElement instanceof HTMLInputElement &&
        screenEl.contains(document.activeElement)
      ) {
        requestAnimationFrame(() => {
          document.activeElement?.scrollIntoView({ block: "center", behavior: "smooth" });
        });
      }
    };

    updateInset();
    viewport.addEventListener("resize", updateInset);
    viewport.addEventListener("scroll", updateInset);
    return () => {
      viewport.removeEventListener("resize", updateInset);
      viewport.removeEventListener("scroll", updateInset);
    };
  }, []);

  useEffect(() => {
    const handleDocumentScroll = () => {
      const remaining =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      if (!completedRef.current && remaining < 24) {
        completedRef.current = true;
        onComplete?.();
      }
    };

    window.addEventListener("scroll", handleDocumentScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleDocumentScroll);
  }, [onComplete]);

  // 기사를 끝까지 스크롤하면 완독 처리 → 오늘 읽기 기록에 반영 (마운트당 1회)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!completedRef.current && el.scrollHeight - el.scrollTop - el.clientHeight < 24) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  return (
    <div
      ref={screenRef}
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        showBack
        showDropdown={false}
        onBackClick={onBack}
        onAvatarClick={onOpenScrapbook}
      />
      <div
        ref={scrollRef}
        className="pt-content-column pt-scroll h-full overflow-y-auto"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(100px + ${APP_SAFE_BOTTOM} + ${keyboardInset}px)`,
          paddingLeft: APP_SAFE_LEFT,
        }}
        onScroll={handleScroll}
      >
        <TabSlider active={activeTab} onChange={onTabChange} />
        <div className="relative w-full">
          {activeTab === "original" && (
            <OriginalContent
              article={article}
              tool={tool}
              highlights={highlights}
              onHighlightRange={addHighlightRange}
              onImageCropped={addImageClip}
            />
          )}
          {activeTab === "ai" && <AiContent article={article} />}
          {activeTab === "easy" && <EasyContent article={article} />}
          {activeTab === "original" && (
            <svg
              className="absolute inset-0 w-full h-full"
              style={{
                zIndex: 15,
                pointerEvents: tool === "pencil" || tool === "eraser" ? "auto" : "none",
                touchAction: tool === "pencil" || tool === "eraser" ? "none" : "auto",
              }}
              onPointerDown={onCanvasDown}
              onPointerMove={onCanvasMove}
              onPointerUp={onCanvasUp}
              onPointerCancel={onCanvasUp}
            >
              {strokes.map((s) => (
                <polyline
                  key={s.id}
                  points={s.pts.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="var(--pt-brand-primary)"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {drawLive && (
                <polyline
                  points={drawLive.pts.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="var(--pt-brand-primary)"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          )}
        </div>
      </div>
      {/* AI모드는 카드·대화형 화면이라 스크랩 도구를 쓸 수 없어 FAB 자체를 숨긴다 */}
      {activeTab !== "ai" && (
        <FAB
          onPress={() => setShowToolbar((v) => !v)}
          showToolbar={showToolbar}
          onCloseToolbar={() => setShowToolbar(false)}
          tool={tool}
          onSelectTool={(t) => {
            setTool((cur) => (cur === t ? "none" : t));
            setShowToolbar(false);
          }}
          onUndo={undo}
          canUndo={history.length > 0}
        />
      )}
      {/* 완독 토스트 — 상점 결제완료 토스트와 동일한 스타일, 하단에서 올라왔다가 다시 내려감.
          이 화면은 document 스크롤(article 콘텐츠가 길면 body 전체가 스크롤)이라 absolute로 두면
          토스트가 화면이 아니라 "기사 맨 아래"에 위치해 스크롤해야만 보이는 문제가 있었음 → fixed로 고정 */}
      <div
        className="fixed left-1/2 z-30 rounded-full"
        style={{
          bottom: `calc(28px + ${APP_SAFE_BOTTOM})`,
          padding: "10px 28px",
          backgroundColor: "var(--pt-bg-accent)",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
          transform: `translate(-50%, ${readToastVisible ? "0" : "140%"})`,
          opacity: readToastVisible ? 1 : 0,
          transition: "transform 0.35s ease, opacity 0.35s ease",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontFamily: "Paperlogy", fontWeight: 700, fontSize: 14, color: "var(--pt-brand-primary)" }}>
          완독했어요!
        </span>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Mission Screen (미션리워드) ──
function MissionScreen({
  acornCount,
  articleMissionDone,
  onMenuOpen,
  onShopPress,
}: {
  acornCount: number;
  articleMissionDone: boolean;
  onMenuOpen: () => void;
  onShopPress: () => void;
}) {
  const missions = [
    { label: "출석체크 하기", reward: 30, done: true },
    { label: "기사 3개 완독하기", reward: 10, done: articleMissionDone },
    { label: "스크랩 공유하기", reward: 20, done: false },
    { label: "스티커 구매하기", reward: 5, done: false },
  ];

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        dropdownLabel="도토리 줍기"
        showDropdown
        showDropdownChevron={false}
        onDropdownClick={() => {}}
        showAvatar={false}
        onMenuOpen={onMenuOpen}
      />

      <div
        className="pt-content-column pt-scroll h-full overflow-y-auto no-scrollbar"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(32px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        {/* 도토리 줍기 section — 페이지명은 헤더 라벨에 있으므로 본문에서는 생략 */}
        <div className="flex flex-col gap-4 px-5 pt-6">
          {/* Collected acorns */}
          <div
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ backgroundColor: "var(--pt-bg-card)" }}
          >
            <span className="caption" style={{ color: "var(--pt-text-primary)" }}>
              수집한 도토리
            </span>
            <div className="flex items-center gap-2 px-2.5">
              <div style={{ width: 20, height: 24, position: "relative" }}>
                <img
                  src={imgAcorn}
                  alt="도토리"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              </div>
              <span className="caption" style={{ color: "var(--pt-text-primary)" }}>
                {acornCount}개
              </span>
            </div>
          </div>

          {/* Mission list */}
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--pt-bg-card)" }}>
            {missions.map((m, i) => (
              <div key={m.label}>
                {i > 0 && (
                  <div
                    className="mx-4"
                    style={{ height: 1, backgroundColor: "var(--pt-border-menu)" }}
                  />
                )}
                <div className="flex items-center justify-between p-4">
                  <span className="caption" style={{ color: "var(--pt-text-primary)" }}>
                    {m.label}
                  </span>
                  <div
                    className="flex items-center justify-center rounded-xl px-6 py-2.5"
                    style={{
                      minWidth: 75,
                      backgroundColor: m.done
                        ? "var(--pt-chip-inactive)"
                        : "var(--pt-brand-primary)",
                    }}
                  >
                    <span
                      className="caption"
                      style={{
                        color: m.done ? "var(--pt-chip-inactive-text)" : "#FCFFF1",
                      }}
                    >
                      {m.reward}개
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acorn notification card */}
        <div
          className="mx-5 mt-4 rounded-xl p-4 flex items-center justify-between opacity-60"
          style={{ backgroundColor: "var(--pt-bg-card)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 40, height: 40 }}
            >
              <div style={{ width: 32, height: 38, position: "relative" }}>
                <img
                  src={imgAcorn}
                  alt="도토리"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="label" style={{ color: "var(--pt-text-primary)" }}>
                도토리 알림 받기
              </p>
              <p className="caption" style={{ color: "var(--pt-text-primary)" }}>
                도토리를 찾으면 알려드릴게요
              </p>
            </div>
          </div>
        </div>

        {/* CTA: Shop button */}
        <div className="mx-5 mt-5">
          <button
            onClick={onShopPress}
            className="w-full flex items-center justify-center gap-2 rounded-3xl py-4"
            style={{ backgroundColor: "var(--pt-brand-secondary)" }}
          >
            <span className="label" style={{ color: "var(--pt-text-dark-green)" }}>
              포인트로 스티커 사러 가기
            </span>
            <ArrowRightIcon color="var(--pt-text-primary)" />
          </button>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Shop Screen (상점적용예시) ──
// ── Shop items ──
// 테이프는 마스킹테이프 시트 한 장에서 각 테이프 영역만 잘라 쓰고, 스티커는 토리 표정 에셋을 사용.
// crop은 시트(1024x1008) 안에서 실제 테이프가 차지하는 픽셀 영역 — 시트의 테이프들이 균등 격자로
// 배치돼 있지 않아, 칸 단위로 자르면 이미지가 한쪽으로 쏠리고 옆 테이프가 비쳐 들어옴.
const TAPE_SHEET = { w: 1024, h: 1008 };
const TAPE_WIDTH = 80; // 카드 안에서 테이프가 그려지는 가로 길이(px)

type ShopItem = {
  id: string;
  name: string;
  price: number;
  crop?: { x: number; y: number; w: number; h: number };
  img?: string;
};

const TAPE_ITEMS: ShopItem[] = [
  { id: "tape-olive", name: "올리브 패턴 테이프", price: 10, crop: { x: 72, y: 81, w: 419, h: 127 } },
  { id: "tape-berry", name: "베리 도트 테이프", price: 12, crop: { x: 521, y: 84, w: 419, h: 122 } },
  { id: "tape-blue-check", name: "블루 체크 테이프", price: 10, crop: { x: 69, y: 262, w: 414, h: 123 } },
  { id: "tape-coral", name: "코랄 퍼즐 테이프", price: 14, crop: { x: 521, y: 261, w: 424, h: 123 } },
  { id: "tape-mint", name: "민트 버블 테이프", price: 11, crop: { x: 85, y: 419, w: 389, h: 144 } },
  { id: "tape-mustard", name: "머스터드 스트라이프 테이프", price: 13, crop: { x: 545, y: 438, w: 377, h: 126 } },
];

const STICKER_ITEMS: ShopItem[] = [
  { id: "sticker-smile", name: "방긋 토리", price: 8, img: imgSticker1 },
  { id: "sticker-glasses", name: "안경 토리", price: 9, img: imgSticker2 },
  { id: "sticker-tears", name: "눈물 토리", price: 9, img: imgSticker3 },
  { id: "sticker-pout", name: "뾰루퉁 토리", price: 10, img: imgSticker4 },
  { id: "sticker-wave", name: "인사하는 토리", price: 15, img: imgToriDeco },
];

function ShopScreen({
  acornCount,
  onPurchase,
  onBack,
  onMenuOpen,
}: {
  acornCount: number;
  onPurchase: (price: number) => void;
  onBack: () => void;
  onMenuOpen: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ShopTab>("tape");
  const items = activeTab === "tape" ? TAPE_ITEMS : STICKER_ITEMS;

  // 구매(보유중 전환) + 결제완료/도토리 부족 토스트 상태
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (message: string, variant: "success" | "error") => {
    setToast({ message, variant });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 1000);
  };

  const handlePurchase = (id: string, price: number) => {
    if (ownedIds.has(id)) return; // 이미 보유중이면 재구매 없음
    if (acornCount < price) {
      showToast("도토리가 부족해요!", "error");
      return;
    }
    setOwnedIds((prev) => new Set(prev).add(id));
    onPurchase(price);
    showToast("결제완료!", "success");
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        dropdownLabel="상점"
        showDropdown
        showDropdownChevron={false}
        onDropdownClick={() => {}}
        onMenuOpen={onMenuOpen}
        showAvatar={false}
      />

      <div
        className="pt-content-column pt-scroll h-full overflow-y-auto no-scrollbar"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(24px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        {/* Tab pills */}
        <div className="flex gap-2.5 px-5 py-2">
          {(["tape", "sticker"] as ShopTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 flex items-center justify-center rounded-3xl py-3 label"
                style={{
                  backgroundColor: isActive ? "var(--pt-brand-primary)" : "var(--pt-chip-bg)",
                  color: isActive ? "#FCFFF1" : "var(--pt-text-brand-strong)",
                }}
              >
                {tab === "tape" ? "테이프" : "스티커"}
              </button>
            );
          })}
        </div>

        {/* Collected acorns */}
        <div
          className="mx-4 mb-4 rounded-xl p-4 flex items-center justify-between"
          style={{ backgroundColor: "var(--pt-bg-card)" }}
        >
          <span className="caption" style={{ color: "var(--pt-text-primary)" }}>
            수집한 도토리
          </span>
          <div className="flex items-center gap-2 px-2.5">
            <div style={{ width: 20, height: 24, position: "relative" }}>
              <img
                src={imgAcorn}
                alt="도토리"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </div>
            <span className="caption" style={{ color: "var(--pt-text-primary)" }}>
              {acornCount}개
            </span>
          </div>
        </div>

        {/* Product grid — 사용 가능한 폭에 따라 열 수를 자동 조정 */}
        <div
          className="grid justify-center gap-x-2.5 gap-y-8 px-2 pt-2 pb-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(0, 114px))" }}
        >
          {items.map((item, i) => {
            const isTape = activeTab === "tape";
            // 잘라낸 영역을 그대로 카드 안에 채우도록 스케일 — 비율 유지라 늘어남/쏠림이 없음
            const scale = item.crop ? TAPE_WIDTH / item.crop.w : 1;
            return (
              <div
                key={`${activeTab}-${i}`}
                className="flex w-full max-w-[114px] flex-col items-center isolate"
                style={{ height: 165 }}
              >
                {/* Handle — 테이프는 블루, 스티커는 라임 */}
                <div
                  className="z-10 flex items-center justify-center"
                  style={{ width: 18.5, height: 32.9, marginBottom: -12 }}
                >
                  <div
                    className="rounded-sm"
                    style={{
                      width: 9,
                      height: 31.7,
                      backgroundColor: isTape
                        ? "var(--pt-tape-handle)"
                        : "var(--pt-border-accent)",
                      transform: "rotate(18.39deg)",
                      boxShadow: "2px 2px 4px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>

                {/* Product card */}
                <button
                  onClick={() => handlePurchase(item.id, item.price)}
                  className="relative rounded-3xl w-full flex-1 flex flex-col overflow-hidden text-left"
                  style={{
                    backgroundColor: isTape
                      ? "var(--pt-tape-card-bg)"
                      : "var(--pt-bg-accent-light)",
                    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                    zIndex: 1,
                  }}
                >
                  <div className="flex-1 flex flex-col items-center gap-2 p-3.5">
                    <p
                      className="caption text-center w-full overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ color: "var(--pt-text-primary)", fontSize: 11, fontWeight: 600 }}
                    >
                      {item.name}
                    </p>

                    {/* Product image */}
                    <div
                      className="rounded-xl overflow-hidden w-full relative shrink-0 flex items-center justify-center"
                      style={{ height: 79, backgroundColor: "var(--pt-bg-primary)" }}
                    >
                      {isTape && item.crop ? (
                        // 시트에서 해당 테이프 영역만 잘라 비스듬히 배치
                        <div
                          style={{
                            width: TAPE_WIDTH,
                            height: item.crop.h * scale,
                            transform: "rotate(-18deg)",
                            backgroundImage: `url(${imgTape})`,
                            backgroundSize: `${TAPE_SHEET.w * scale}px ${TAPE_SHEET.h * scale}px`,
                            backgroundPosition: `-${item.crop.x * scale}px -${item.crop.y * scale}px`,
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                      ) : (
                        <img
                          src={item.img}
                          alt={item.name}
                          className="pointer-events-none"
                          style={{ width: 58, height: 58, objectFit: "contain" }}
                        />
                      )}

                      {ownedIds.has(item.id) && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
                        >
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "var(--pt-bg-accent)", padding: "6px 14px" }}
                          >
                            <span
                              style={{
                                fontFamily: "Paperlogy",
                                fontWeight: 700,
                                fontSize: 12,
                                color: "var(--pt-brand-primary)",
                              }}
                            >
                              보유중
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-0.5">
                      <span
                        style={{
                          fontFamily: "Paperlogy",
                          fontWeight: 600,
                          fontSize: 11,
                          color: "var(--pt-text-primary)",
                          lineHeight: "9.6px",
                        }}
                      >
                        {item.price}
                      </span>
                      <div style={{ width: 9.855, height: 11.737, position: "relative" }}>
                        <img
                          src={imgAcorn}
                          alt="도토리"
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 결제완료/도토리 부족 토스트 — 하단에서 올라왔다가 다시 내려감.
          이 화면도 document 스크롤이라 absolute면 콘텐츠 길이에 따라 화면 밖에 위치할 수 있어 fixed로 고정 */}
      <div
        className="fixed left-1/2 z-30 rounded-full"
        style={{
          bottom: `calc(28px + ${APP_SAFE_BOTTOM})`,
          padding: "10px 28px",
          backgroundColor: toast?.variant === "error" ? "var(--pt-status-error-bg)" : "var(--pt-bg-accent)",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
          transform: `translate(-50%, ${toast ? "0" : "140%"})`,
          opacity: toast ? 1 : 0,
          transition: "transform 0.35s ease, opacity 0.35s ease",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "Paperlogy",
            fontWeight: 700,
            fontSize: 14,
            color: toast?.variant === "error" ? "var(--pt-status-error)" : "var(--pt-brand-primary)",
          }}
        >
          {toast?.message}
        </span>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── My Page Screen (마이페이지) ──
function MyPageScreen({ onMenuOpen }: { onMenuOpen: () => void }) {
  const menuItems = ["프로필", "알림", "설정", "고객센터"];

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        dropdownLabel="마이페이지"
        showDropdown
        showDropdownChevron={false}
        onDropdownClick={() => {}}
        showAvatar={false}
        onMenuOpen={onMenuOpen}
      />

      <div
        className="pt-content-column pt-scroll h-full overflow-y-auto no-scrollbar"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(32px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        {/* Hero — 출석 인사 + 토리 일러스트 */}
        <div
          className="flex items-center w-full"
          style={{
            backgroundColor: "var(--pt-bg-accent-light)",
            padding: "clamp(24px, 7vw, 32px) clamp(16px, 5vw, 20px)",
          }}
        >
          <div className="flex-1 flex items-center justify-between min-w-0" style={{ gap: "clamp(8px, 3vw, 20px)" }}>
            <div className="flex min-w-0 flex-1 flex-col items-start" style={{ gap: "clamp(28px, 8vh, 60px)" }}>
              <p className="title" style={{ color: "var(--pt-text-primary)" }}>
                송토리님 또 오셨군요!
              </p>
              <div className="flex flex-col items-start gap-2.5 w-full">
                <p className="subtitle" style={{ color: "var(--pt-brand-primary)" }}>
                  1일 연속 출석
                </p>
                <p
                  className="body-2"
                  style={{ color: "var(--pt-text-primary)" }}
                >
                  1일 연속으로 도토리를 주웠어요!
                  <br />
                  토리가 도토리를 기다리고 있어요
                </p>
              </div>
            </div>
            <div className="flex items-center shrink-0" style={{ paddingTop: 40 }}>
              <div
                className="relative shrink-0"
                style={{ width: "clamp(72px, 28vw, 122px)", aspectRatio: "122 / 124" }}
              >
                <img
                  src={imgToriMypage}
                  alt="토리"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Menu list */}
        <div className="px-5" style={{ paddingTop: 20 }}>
          <div
            className="rounded-xl overflow-hidden flex flex-col items-center"
            style={{ backgroundColor: "var(--pt-bg-card)" }}
          >
            {menuItems.map((label, i) => (
              <div key={label} className="w-full">
                {i > 0 && (
                  <div
                    className="mx-4"
                    style={{ height: 1, backgroundColor: "var(--pt-border-default)" }}
                  />
                )}
                <button className="w-full flex items-center justify-between p-5 text-left">
                  <span className="caption" style={{ color: "var(--pt-text-primary)" }}>
                    {label}
                  </span>
                  <ChevronRightIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="flex justify-center" style={{ paddingTop: 20 }}>
          <button className="flex items-center justify-center p-4">
            <span className="label" style={{ color: "var(--pt-text-secondary)", fontSize: 15 }}>
              로그아웃
            </span>
          </button>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Reading History data (완독 반영) ──
// 그날 완독한 기사 수. 색 레벨 = min(count,5), count>5도 카드는 실제 개수만큼 표시.
// 메인 피드에서 기사를 끝까지 스크롤(완독)하면 그날 카운트가 +1 되어 달력·기록에 반영됨.
const JULY_READS: Record<number, number> = {
  1: 1, 3: 3, 4: 2, 5: 1, 6: 2, 7: 3, 8: 4, 9: 1, 10: 5, 11: 1, 12: 5,
  15: 2, 16: 7, 17: 1, 18: 1, 19: 5, 20: 1,
};
// 읽기 기록은 "그날 완독한 실제 기사(id) 목록"으로 저장 (HKGA-141: 앤트로픽 목업 → Today 피드 기사 연결).
// 과거 예시 시드는 JULY_READS의 개수를 Today 피드(ALL_NEWS) 기사로 순환 치환해 채운다.
const SEED_READS: Record<number, string[]> = Object.fromEntries(
  Object.entries(JULY_READS).map(([d, n]) => [
    Number(d),
    Array.from({ length: n }, (_, i) => ALL_NEWS[i % Math.max(1, ALL_NEWS.length)]?.id).filter(Boolean) as string[],
  ])
);
const READ_GOAL = 5; // 완성 기준(하루 5개)
const LEVEL_BG = ["", "var(--pt-read-1)", "var(--pt-read-2)", "var(--pt-read-3)", "var(--pt-read-4)", "var(--pt-read-5)"];
const MONTH_BAR_H = [18, 14, 22, 16, 28, 18, 48, 24, 14, 20, 16, 12]; // 연간 독서량 막대(디자인 목업 높이)
const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}
function firstWeekdayMon(y: number, m: number) {
  // 월요일 시작 기준 선행 빈칸 수 (0~6)
  return (new Date(y, m - 1, 1).getDay() + 6) % 7;
}

// 읽기 기록 카드가 표시하는 목업 기사 — 스크랩북 아이콘 클릭 시 이 제목으로 저장된
// 기존 스크랩(SEED_SAVED_SCRAPS)을 찾아 보여준다
const READING_HISTORY_ARTICLE_TITLE = "앤트로픽, 10월 IPO 추진…투자자 미팅 돌입";

// ── Reading History Card ── (그날 완독한 실제 기사 1건)
function ReadingHistoryCard({
  article,
  onClick,
  onScrap,
}: {
  article: NewsItem;
  onClick?: () => void;
  onScrap?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border p-4 flex flex-col gap-2"
      style={{
        borderColor: "var(--pt-border-default)",
        filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.06))",
      }}
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between w-full">
          <CategoryChip label={article.category} />
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onScrap?.();
            }}
            className="flex items-center p-0.5 cursor-pointer"
          >
            <ScrapIcon />
          </span>
        </div>
        <p
          className="subtitle overflow-hidden text-ellipsis whitespace-nowrap w-full"
          style={{ color: "var(--pt-text-primary)" }}
        >
          {article.headline}
        </p>
        <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>
          {article.byline}
        </p>
      </div>
    </button>
  );
}

// ── Calendar Screen (읽기 기록 달력) ──
function CalendarScreen({
  year,
  month,
  reads,
  todayDay,
  onMenuOpen,
  onOpenPicker,
  onDateClick,
}: {
  year: number;
  month: number;
  reads: Record<number, number>;
  todayDay: number | null;
  onMenuOpen: () => void;
  onOpenPicker: () => void;
  onDateClick: (day: number) => void;
}) {
  const lead = firstWeekdayMon(year, month);
  const total = daysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const readTotal = Object.values(reads).reduce((a, b) => a + b, 0);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        dropdownLabel="읽기 기록 달력"
        showDropdown
        showDropdownChevron={false}
        onDropdownClick={() => {}}
        showAvatar={false}
        onMenuOpen={onMenuOpen}
      />

      <div
        className="pt-content-column pt-scroll h-full overflow-y-auto no-scrollbar"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(24px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        <div className="px-3 min-[340px]:px-4 flex flex-col gap-6">
          {/* Title + date picker trigger */}
          <button onClick={onOpenPicker} className="flex items-center gap-2 self-start">
            <span
              style={{
                fontFamily: "var(--pt-font-title)",
                fontWeight: 700,
                fontSize: 24,
                color: "var(--pt-text-primary)",
              }}
            >
              {month}월
            </span>
            <ChevronDownIcon />
          </button>

          {/* Weekday header + grid */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-7">
              {WEEKDAYS.map((w) => (
                <p
                  key={w}
                  className="text-center"
                  style={{ fontFamily: "var(--pt-font-body)", fontSize: 12, color: "var(--pt-text-secondary)" }}
                >
                  {w}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2" style={{ placeItems: "center" }}>
              {cells.map((d, i) => {
                if (d === null)
                  return <div key={i} style={{ width: "min(40px, 100%)", aspectRatio: "4 / 5" }} />;
                const count = reads[d] || 0;
                const lv = Math.min(count, 5);
                const isToday = d === todayDay;
                const isFuture =
                  year > TODAY_YEAR ||
                  (year === TODAY_YEAR && month > TODAY_MONTH) ||
                  (year === TODAY_YEAR && month === TODAY_MONTH && d > TODAY_DAY);
                const bg = isToday
                  ? "var(--pt-brand-secondary)"
                  : lv > 0
                  ? LEVEL_BG[lv]
                  : "transparent";
                const border = isToday
                  ? "1px solid var(--pt-brand-primary)"
                  : lv === 0
                  ? "1px solid var(--pt-border-strong)"
                  : "none";
                const textColor = !isToday && lv >= 4 ? "#f8f9fb" : "var(--pt-text-primary)";
                return (
                  <button
                    key={i}
                    disabled={isFuture}
                    onClick={isFuture ? undefined : () => onDateClick(d)}
                    className="flex w-full max-w-10 items-center justify-center rounded-xl"
                    style={{
                      aspectRatio: "4 / 5",
                      backgroundColor: bg,
                      border,
                      cursor: isFuture ? "default" : "pointer",
                    }}
                  >
                    <span style={{ fontFamily: "var(--pt-font-title)", fontWeight: 700, fontSize: 14, color: textColor }}>
                      {d}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Yearly reading-count bar chart */}
          <div className="grid grid-cols-12 items-end gap-px" style={{ minHeight: 72, paddingTop: 4 }}>
            {MONTH_BAR_H.map((h, idx) => {
              const mm = idx + 1;
              const isCur = mm === month;
              return (
                <div key={mm} className="flex min-w-0 flex-col items-center gap-0.5">
                  {isCur && (
                    <span
                      className="whitespace-nowrap"
                      style={{
                        fontFamily: "var(--pt-font-body)",
                        fontWeight: 700,
                        fontSize: "clamp(7px, 2.4vw, 9px)",
                        color: "var(--pt-text-primary)",
                      }}
                    >
                      {readTotal}건
                    </span>
                  )}
                  <div
                    style={{
                      width: "min(20px, 70%)",
                      height: isCur ? 48 : h,
                      borderRadius: 4,
                      backgroundColor: isCur ? "var(--pt-brand-primary)" : "var(--pt-brand-secondary)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--pt-font-body)",
                      fontWeight: isCur ? 700 : 400,
                      fontSize: "clamp(7px, 2.4vw, 9px)",
                      color: isCur ? "var(--pt-brand-primary)" : "var(--pt-text-secondary)",
                    }}
                    className="whitespace-nowrap"
                  >
                    {mm}월
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Reading Detail Screen (날짜별 읽기 기록) ──
function ReadingDetailScreen({
  month,
  day,
  articles,
  onBack,
  onCardClick,
  onScrapClick,
  onGoFeed,
}: {
  month: number;
  day: number;
  articles: NewsItem[];
  onBack: () => void;
  onCardClick: (a: NewsItem) => void;
  onScrapClick: (a: NewsItem) => void;
  onGoFeed: () => void;
}) {
  const count = articles.length;
  const remaining = Math.max(0, READ_GOAL - count);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader showBack showDropdown={false} showAvatar={false} onBackClick={onBack} />

      <div
        className="pt-content-column pt-scroll flex h-full flex-col overflow-y-auto no-scrollbar"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(32px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        {/* Date header */}
        <div className="flex flex-col items-center" style={{ padding: "16px 20px" }}>
          <p style={{ fontFamily: "var(--pt-font-title)", fontWeight: 700, fontSize: 20, color: "var(--pt-text-secondary)" }}>
            {month}월 {day}일
          </p>
        </div>

        {count === 0 ? (
          /* Empty state */
          <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center gap-8 px-4 py-8">
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative" style={{ width: "min(187px, 58vw)", aspectRatio: "187 / 177" }}>
                <img src={imgToriEmpty} alt="토리" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
              </div>
              <p style={{ fontFamily: "var(--pt-font-title)", fontWeight: 700, fontSize: 20, color: "var(--pt-text-secondary)" }}>
                읽은 기사가 없어요..
              </p>
            </div>
            <button
              onClick={onGoFeed}
              className="rounded-3xl flex items-center justify-center"
              style={{ padding: "14px 24px", backgroundColor: "var(--pt-brand-primary)" }}
            >
              <span className="label" style={{ color: "#ffffff" }}>피드 확인하러가기</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col gap-2 px-4 w-full">
              {articles.map((a, i) => (
                <ReadingHistoryCard key={i} article={a} onClick={() => onCardClick(a)} onScrap={() => onScrapClick(a)} />
              ))}
            </div>
            {count < READ_GOAL && (
              <div
                className="rounded-3xl flex items-center justify-center"
                style={{ padding: "8px 12px", backgroundColor: "var(--pt-brand-secondary)" }}
              >
                <span className="caption" style={{ color: "var(--pt-brand-primary)", fontWeight: 700 }}>
                  {remaining}개만 더 보면 완성돼요!
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Date Picker Sheet (년/월/날짜 선택) ──
function DatePickerSheet({
  year,
  month,
  onChangeMonth,
  onPickDay,
  onClose,
}: {
  year: number;
  month: number;
  onChangeMonth: (y: number, m: number) => void;
  onPickDay: (y: number, m: number, d: number) => void;
  onClose: () => void;
}) {
  const [y, setY] = useState(year);
  const [m, setM] = useState(month);
  const total = daysInMonth(y, m);
  const setYM = (ny: number, nm: number) => {
    setY(ny);
    setM(nm);
    onChangeMonth(ny, nm);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "var(--pt-overlay-medium)" }}
        onClick={onClose}
      />
      <div
        className="fixed left-0 right-0 bottom-0 z-50 flex min-h-0 flex-col overflow-hidden"
        style={{
          backgroundColor: "var(--pt-bg-primary)",
          borderRadius: "36px 36px 0 0",
          paddingTop: 12,
          paddingRight: `calc(clamp(12px, 5vw, 20px) + ${APP_SAFE_RIGHT})`,
          paddingBottom: `calc(20px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: `calc(clamp(12px, 5vw, 20px) + ${APP_SAFE_LEFT})`,
          width: "100%",
          maxWidth: 768,
          marginInline: "auto",
          maxHeight:
            "min(82%, calc(100% - var(--pt-safe-top, 0px) - 8px))",
        }}
      >
        <div
          className="self-center rounded-full"
          style={{ width: 44, height: 5, backgroundColor: "var(--pt-border-strong)", marginBottom: 16 }}
        />
        <p className="subtitle" style={{ color: "var(--pt-text-primary)", marginBottom: 16 }}>
          날짜 선택
        </p>

        {/* Year stepper */}
        <div className="flex items-center justify-center gap-8" style={{ marginBottom: 16 }}>
          <button onClick={() => setYM(y - 1, m)} className="flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <BackArrowIcon />
          </button>
          <span className="title" style={{ color: "var(--pt-text-primary)" }}>{y}년</span>
          <button onClick={() => setYM(y + 1, m)} className="flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <ChevronRightIcon />
          </button>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-6 gap-2" style={{ marginBottom: 16 }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((mm) => {
            const active = mm === m;
            return (
              <button
                key={mm}
                onClick={() => setYM(y, mm)}
                className="rounded-lg py-2 caption"
                style={{
                  backgroundColor: active ? "var(--pt-brand-primary)" : "var(--pt-chip-bg)",
                  color: active ? "#ffffff" : "var(--pt-text-brand-strong)",
                }}
              >
                {mm}월
              </button>
            );
          })}
        </div>

        {/* Day grid */}
        <div className="min-h-0 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-7 gap-1 min-[340px]:gap-1.5">
            {Array.from({ length: total }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => onPickDay(y, m, d)}
                className="rounded-lg flex items-center justify-center"
                style={{ minHeight: 36, height: "min(40px, 10vw)", backgroundColor: "var(--pt-bg-card)" }}
              >
                <span className="caption" style={{ color: "var(--pt-text-primary)" }}>{d}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Scrap: icons ──
function HeartIcon({ filled, color = "var(--pt-text-primary)" }: { filled?: boolean; color?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "var(--pt-brand-primary)" : "none"}>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"
        stroke={filled ? "var(--pt-brand-primary)" : color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon({ color = "var(--pt-text-primary)" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PenTool = "keyboard" | "highlighter" | "pencil" | "eraser" | "clipboard" | "scissors" | "undo";
function PenToolIcon({ name, color = "var(--pt-text-primary)" }: { name: PenTool; color?: string }) {
  const paths: Record<PenTool, React.ReactNode> = {
    keyboard: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M8 16h8" />
      </>
    ),
    highlighter: (
      <>
        <path d="m9 11-6 6v3h3l6-6" />
        <path d="m22 8-5.5 5.5-4-4L18 4a1.4 1.4 0 0 1 2 0l2 2a1.4 1.4 0 0 1 0 2Z" />
      </>
    ),
    pencil: (
      <>
        <path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
        <path d="m15 5 4 4" />
      </>
    ),
    eraser: (
      <>
        <path d="m7 21-4.3-4.3a1.7 1.7 0 0 1 0-2.4l9.6-9.6a1.7 1.7 0 0 1 2.4 0l5.6 5.6a1.7 1.7 0 0 1 0 2.4L13 21" />
        <path d="M22 21H7M5 11l9 9" />
      </>
    ),
    clipboard: (
      <>
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </>
    ),
    scissors: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
      </>
    ),
    undo: <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" />,
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// ── Scrap Library Screen (스크랩 라이브러리) ──
function ScrapLibraryScreen({
  items,
  onMenuOpen,
  onOpen,
  onNew,
  onShare,
}: {
  items: SavedScrap[];
  onMenuOpen: () => void;
  onOpen: (id: number) => void;
  onNew: () => void;
  onShare: (id: number) => void;
}) {
  const [liked, setLiked] = useState<Set<number>>(new Set([1]));
  const toggleLike = (id: number) =>
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // 날짜별 필터링 — 기본은 전체보기, 날짜 선택시트에서 하루를 고르면 그 날짜에 추가된
  // 스크랩만 보여준다. items의 date는 자동저장 시점의 실제 날짜(TODAY_DATE_STR)라서
  // 읽기 기록 달력에서 만든 스크랩도 같은 값으로 자연스럽게 연동된다
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(TODAY_YEAR);
  const [pickerMonth, setPickerMonth] = useState(TODAY_MONTH);
  const visibleItems = dateFilter ? items.filter((it) => it.date === dateFilter) : items;
  const filterLabel = dateFilter
    ? `${Number(dateFilter.split(".")[1])}월 ${Number(dateFilter.split(".")[2])}일`
    : "전체보기";

  return (
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: "var(--pt-bg-primary)" }}>
      <AppHeader
        dropdownLabel="스크랩 라이브러리"
        showDropdown
        showDropdownChevron={false}
        onDropdownClick={() => {}}
        showAvatar={false}
        onMenuOpen={onMenuOpen}
      />

      <div
        className="pt-content-column pt-scroll h-full overflow-y-auto no-scrollbar"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(24px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        <div className="flex flex-col items-center" style={{ padding: "16px 20px" }}>
          <button onClick={() => setPickerOpen(true)} className="flex items-center gap-2">
            <span style={{ fontFamily: "var(--pt-font-title)", fontWeight: 700, fontSize: 20, color: "var(--pt-text-secondary)" }}>
              {filterLabel}
            </span>
            <ChevronDownIcon />
          </button>
          {dateFilter && (
            <button
              onClick={() => setDateFilter(null)}
              className="caption"
              style={{ color: "var(--pt-text-brand)", marginTop: 4 }}
            >
              전체보기로 돌아가기
            </button>
          )}
        </div>

        <div
          className="grid justify-center gap-2 px-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(0, 114px))" }}
        >
          {visibleItems.map((it) => (
            <article
              key={it.id}
              className="bg-white rounded-xl border flex w-full max-w-[114px] flex-col items-end text-left"
              style={{ padding: "20px 12px", borderColor: "var(--pt-border-default)", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.06))", gap: 10 }}
            >
              <button
                onClick={() => onOpen(it.id)}
                className="flex w-full flex-col items-center gap-8 text-left"
              >
                <p className="subtitle overflow-hidden w-full" style={{ color: "var(--pt-text-primary)", height: 75, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                  {it.title}
                </p>
                <p className="caption w-full text-right" style={{ color: "var(--pt-text-secondary)" }}>{it.date}</p>
              </button>
              <div className="flex gap-1.5 items-center">
                <button
                  aria-label={liked.has(it.id) ? `${it.title} 좋아요 취소` : `${it.title} 좋아요`}
                  onClick={() => toggleLike(it.id)}
                  className="flex items-center"
                >
                  <HeartIcon filled={liked.has(it.id)} />
                </button>
                <button
                  aria-label={`${it.title} 공유`}
                  onClick={() => onShare(it.id)}
                  className="flex items-center"
                >
                  <ShareIcon />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* FAB → 새 스크랩북 */}
      <button
        onClick={onNew}
        aria-label="새 스크랩북 만들기"
        className="absolute z-30 flex items-center justify-center rounded-full"
        style={{
          bottom: `calc(${APP_SAFE_BOTTOM} + 24px)`,
          right: APP_INLINE_END,
          width: 60,
          height: 60,
          backgroundColor: "var(--pt-bg-surface)",
          boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)",
        }}
      >
        <ScrapIcon color="var(--pt-brand-primary)" />
      </button>

      {pickerOpen && (
        <DatePickerSheet
          year={pickerYear}
          month={pickerMonth}
          onChangeMonth={(y, m) => {
            setPickerYear(y);
            setPickerMonth(m);
          }}
          onPickDay={(y, m, d) => {
            setDateFilter(`${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <div aria-hidden className="absolute inset-0 pointer-events-none border-4" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
    </div>
  );
}

// ── Scrapbook Editor (스크랩북) ──
type ScrapEl = { id: string; kind: "note" | "text" | "sticker"; x: number; y: number; text?: string; bg?: string; color?: string; src?: string; size?: number; rot?: number };
type ScrapStroke = { id: string; tool: "pencil" | "highlighter"; color: string; width: number; pts: { x: number; y: number }[] };
type ScrapDoc = { elements: ScrapEl[]; strokes: ScrapStroke[]; bg: ScrapBg };
type ScrapBg = "none" | "paper" | "grid" | "lime" | "blue";
type EraserMode = "stroke" | "area" | "all";
type ScrapAction = { t: "stroke" | "el"; id: string } | { t: "clear"; strokes: ScrapStroke[]; els: ScrapEl[] };
// 스크랩 라이브러리에 저장된 한 건 — 표지 제목은 만든 기사 헤드라인(또는 "제목 없음"), 목록은 항상 최신 수정순
type SavedScrap = { id: number; title: string; date: string; doc: ScrapDoc };
const scrapUid = () => Math.random().toString(36).slice(2, 9);
// 기사에서 스크랩북을 처음 열 때 빈 캔버스 대신 기사 제목 + 그 기사에서 형광펜으로
// 표시해둔 문장들을 노트로 미리 올려둔다. 각 노트는 스티커처럼 자유롭게 옮기고
// 크기를 바꾸고 지울 수 있다(ScrapbookScreen의 이동/삭제/크기조절이 kind와 무관하게 동작)
function buildArticleScrapSeed(headline: string, highlights: HighlightRange[]): ScrapDoc {
  const titleEl: ScrapEl = {
    id: scrapUid(),
    kind: "note",
    x: 24,
    y: 16,
    text: headline,
    bg: "var(--pt-brand-primary)",
    color: "#ecf0f9",
  };
  const highlightEls: ScrapEl[] = highlights.map((h, i) => ({
    id: scrapUid(),
    kind: "note",
    x: 24 + (i % 2) * 30,
    y: 140 + i * 130,
    text: h.text.length > 42 ? h.text.slice(0, 42) + "…" : h.text,
    bg: "var(--pt-brand-secondary)",
    color: "#1a1a1a",
  }));
  return { elements: [titleEl, ...highlightEls], strokes: [], bg: "paper" };
}
const PEN_COLORS = ["#1a2535", "#6083f5", "#496de0", "#e6f997", "#ff6b6b", "#ffa94d", "#51cf66", "#845ef7"];
const STICKERS = [imgSticker1, imgSticker2, imgSticker3, imgSticker4, imgToriDeco];
const ERASE_R = 18;
// 기존 목업 스크랩북 4종 — 신규 저장 항목이 없을 때 라이브러리 시드 데이터로도 재사용
const DEFAULT_SCRAP_ELEMENTS: ScrapEl[] = [
  { id: scrapUid(), kind: "note", x: 24, y: 16, text: "부동산 공급 대책", bg: "var(--pt-brand-primary)", color: "#ecf0f9" },
  { id: scrapUid(), kind: "note", x: 60, y: 240, text: "일정한 선의 사회적 합의 필요", bg: "var(--pt-brand-secondary)", color: "#1a1a1a" },
  { id: scrapUid(), kind: "note", x: 40, y: 360, text: "전세가율 반등, 실수요 유입 신호", bg: "var(--pt-brand-primary)", color: "#ecf0f9" },
  { id: scrapUid(), kind: "sticker", x: 250, y: 300, src: imgToriDeco, size: 96 },
];
// 스크랩 라이브러리 시드 — 날짜는 이미 최신순으로 정렬돼 있음(맨 위=가장 최근)
const SEED_SAVED_SCRAPS: SavedScrap[] = [
  { id: 1, title: READING_HISTORY_ARTICLE_TITLE, date: "2026.07.20", doc: { elements: DEFAULT_SCRAP_ELEMENTS, strokes: [], bg: "paper" } },
  { id: 2, title: "삼성전자, HBM4 양산 속도 낸다", date: "2026.07.18", doc: { elements: DEFAULT_SCRAP_ELEMENTS, strokes: [], bg: "paper" } },
  { id: 3, title: "코스피 3,200선 돌파, 외국인 순매수", date: "2026.07.15", doc: { elements: DEFAULT_SCRAP_ELEMENTS, strokes: [], bg: "paper" } },
  { id: 4, title: "서울 아파트 매매가 8주 연속 상승", date: "2026.07.12", doc: { elements: DEFAULT_SCRAP_ELEMENTS, strokes: [], bg: "paper" } },
  { id: 5, title: "한국은행 기준금리 연 3.0% 동결", date: "2026.07.10", doc: { elements: DEFAULT_SCRAP_ELEMENTS, strokes: [], bg: "paper" } },
];
// 편집·미리보기·이미지 저장이 모두 같은 좌표계를 사용한다.
// 화면에서는 이 393×742 문서를 기기 너비에 맞춰 축소하고, 포인터 좌표는 다시 이 좌표계로 환산한다.
const SCRAP_CANVAS_WIDTH = 393;
const SCRAP_CANVAS_HEIGHT = 742;
const BG_OPTIONS: { id: ScrapBg; label: string }[] = [
  { id: "none", label: "기본" },
  { id: "paper", label: "원본" },
  { id: "grid", label: "모눈" },
  { id: "lime", label: "라임" },
  { id: "blue", label: "블루" },
];
function scrapBgStyle(bg: ScrapBg): React.CSSProperties {
  if (bg === "grid")
    return {
      backgroundColor: "var(--pt-bg-primary)",
      backgroundImage: "linear-gradient(#e2e5eb 1px,transparent 1px),linear-gradient(90deg,#e2e5eb 1px,transparent 1px)",
      backgroundSize: "22px 22px",
    };
  if (bg === "lime") return { backgroundColor: "var(--pt-bg-accent-light)" };
  if (bg === "blue") return { backgroundColor: "var(--pt-bg-brand)" };
  return { backgroundColor: "var(--pt-bg-primary)" };
}

function ScrapbookScreen({
  isNew,
  clippings,
  initialDoc,
  onBack,
  onShare,
  onAutoSave,
}: {
  isNew: boolean;
  clippings: string[];
  initialDoc?: ScrapDoc;
  onBack: () => void;
  onShare: (doc: ScrapDoc) => void;
  onAutoSave?: (doc: ScrapDoc) => void;
}) {
  const [tool, setTool] = useState<PenTool | "none">("none");
  const [penColor, setPenColor] = useState("#6083f5");
  const [hlColor, setHlColor] = useState("#e6f997");
  const [penWidth, setPenWidth] = useState(4);
  const [textColor, setTextColor] = useState("#1a2535");
  const [text, setText] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [eraserMode, setEraserMode] = useState<EraserMode>("stroke");
  const [bg, setBg] = useState<ScrapBg>(initialDoc?.bg ?? (isNew ? "none" : "paper"));
  const [bgOpen, setBgOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [strokes, setStrokes] = useState<ScrapStroke[]>(initialDoc?.strokes ?? []);
  const [elements, setElements] = useState<ScrapEl[]>(
    initialDoc?.elements ?? (isNew ? [] : DEFAULT_SCRAP_ELEMENTS)
  );

  // 요소·필기·배경 중 하나라도 바뀌면 자동저장 — 최초 마운트(초기값 세팅)는 변경으로 치지 않음
  const autoSaveMounted = useRef(false);
  useEffect(() => {
    if (!autoSaveMounted.current) {
      autoSaveMounted.current = true;
      return;
    }
    onAutoSave?.({ elements, strokes, bg });
  }, [elements, strokes, bg]);
  const [history, setHistory] = useState<ScrapAction[]>([]);
  const [canvasScale, setCanvasScale] = useState(1);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [, force] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<ScrapStroke | null>(null);
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const erasingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDraw = tool === "pencil" || tool === "highlighter";
  const activeColor = tool === "highlighter" ? hlColor : penColor;
  const selectedEl = elements.find((el) => el.id === selectedId) || null;

  // 문서 좌표는 항상 393×742로 유지하고, 화면 너비에 맞춰 보이는 크기만 조절한다.
  useEffect(() => {
    const viewport = canvasViewportRef.current;
    if (!viewport) return;
    const updateScale = () => {
      const next = Math.min(1, viewport.clientWidth / SCRAP_CANVAS_WIDTH);
      if (next > 0) setCanvasScale(next);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  // iOS Safari와 최신 Android Chrome은 키보드가 Layout Viewport 대신 Visual Viewport만
  // 줄일 수 있으므로, 편집기와 보이는 화면 하단의 겹침만큼 입력 바를 올린다.
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const updateKeyboardInset = () => {
      const editor = editorRef.current;
      if (!editor) return;
      const visibleBottom = viewport.offsetTop + viewport.height;
      const overlap = Math.max(0, editor.getBoundingClientRect().bottom - visibleBottom);
      const next = overlap > 1 ? Math.round(overlap) : 0;
      setKeyboardInset((current) => (current === next ? current : next));
    };
    updateKeyboardInset();
    viewport.addEventListener("resize", updateKeyboardInset);
    viewport.addEventListener("scroll", updateKeyboardInset);
    window.addEventListener("resize", updateKeyboardInset);
    return () => {
      viewport.removeEventListener("resize", updateKeyboardInset);
      viewport.removeEventListener("scroll", updateKeyboardInset);
      window.removeEventListener("resize", updateKeyboardInset);
    };
  }, []);

  // 키보드 도구 선택 시 입력창 포커스 → 모바일 키보드 올라옴
  useEffect(() => {
    if (tool === "keyboard") {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [tool]);

  const pt = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * SCRAP_CANVAS_WIDTH,
      y: ((e.clientY - r.top) / r.height) * SCRAP_CANVAS_HEIGHT,
    };
  };
  const pushHist = (a: ScrapAction) => setHistory((h) => [...h, a]);

  const eraseStroke = (p: { x: number; y: number }) =>
    setStrokes((v) => v.filter((s) => !s.pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < ERASE_R)));
  const erasePartial = (p: { x: number; y: number }) =>
    setStrokes((prev) =>
      prev.flatMap((s) => {
        if (!s.pts.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < ERASE_R)) return [s];
        const segs: ScrapStroke[] = [];
        let cur: { x: number; y: number }[] = [];
        for (const q of s.pts) {
          if (Math.hypot(q.x - p.x, q.y - p.y) < ERASE_R) {
            if (cur.length > 1) segs.push({ ...s, id: scrapUid(), pts: cur });
            cur = [];
          } else cur.push(q);
        }
        if (cur.length > 1) segs.push({ ...s, id: scrapUid(), pts: cur });
        return segs;
      })
    );
  const eraseAll = () => {
    pushHist({ t: "clear", strokes, els: elements });
    setStrokes([]);
    setElements([]);
    setSelectedId(null);
  };

  const onDown = (e: React.PointerEvent) => {
    if (isDraw) {
      const p = pt(e);
      drawingRef.current = { id: scrapUid(), tool: tool as "pencil" | "highlighter", color: activeColor, width: tool === "highlighter" ? 16 : penWidth, pts: [p] };
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      force((n) => n + 1);
    } else if (tool === "eraser") {
      const p = pt(e);
      if (eraserMode === "all") eraseAll();
      else if (eraserMode === "stroke") eraseStroke(p);
      else erasePartial(p);
      erasingRef.current = eraserMode !== "all";
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } else {
      setSelectedId(null); // 빈 캔버스 탭 → 선택 해제
    }
  };
  const onMove = (e: React.PointerEvent) => {
    if (drawingRef.current) {
      drawingRef.current.pts.push(pt(e));
      force((n) => n + 1);
    } else if (erasingRef.current) {
      const p = pt(e);
      eraserMode === "stroke" ? eraseStroke(p) : erasePartial(p);
    } else if (dragRef.current) {
      const p = pt(e);
      const { id, ox, oy } = dragRef.current;
      setElements((els) => els.map((el) => (el.id === id ? { ...el, x: p.x - ox, y: p.y - oy } : el)));
    }
  };
  const onUp = () => {
    if (drawingRef.current) {
      const s = drawingRef.current;
      if (s.pts.length > 1) {
        setStrokes((v) => [...v, s]);
        pushHist({ t: "stroke", id: s.id });
      }
      drawingRef.current = null;
      force((n) => n + 1);
    }
    erasingRef.current = false;
    dragRef.current = null;
  };

  const elDown = (e: React.PointerEvent, el: ScrapEl) => {
    if (tool === "eraser") {
      e.stopPropagation();
      if (eraserMode === "all") { eraseAll(); return; }
      setElements((v) => v.filter((x) => x.id !== el.id));
      return;
    }
    if (tool !== "none") return; // drawing tools: let canvas handle
    e.stopPropagation();
    setSelectedId(el.id);
    const p = pt(e);
    dragRef.current = { id: el.id, ox: p.x - el.x, oy: p.y - el.y };
  };

  const undo = () =>
    setHistory((h) => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      if (last.t === "stroke") setStrokes((v) => v.filter((s) => s.id !== last.id));
      else if (last.t === "el") setElements((v) => v.filter((el) => el.id !== last.id));
      else { setStrokes(last.strokes); setElements(last.els); }
      return h.slice(0, -1);
    });

  const addEl = (el: ScrapEl) => {
    setElements((v) => [...v, el]);
    pushHist({ t: "el", id: el.id });
  };
  const addText = () => {
    if (!text.trim()) return;
    addEl({ id: scrapUid(), kind: "text", x: 40, y: 130, text: text.trim(), color: textColor });
    setText("");
  };
  const addSticker = (src: string) => addEl({ id: scrapUid(), kind: "sticker", x: 140, y: 300, src, size: 72 });
  const addClip = (t: string) => addEl({ id: scrapUid(), kind: "note", x: 40, y: 150, text: t.length > 42 ? t.slice(0, 42) + "…" : t, bg: "var(--pt-brand-secondary)", color: "#1a1a1a" });
  // 스티커는 size를 실제 px 한 변 길이로, 노트/텍스트는 배율(%)로 사용 — 둘 다 같은 +/-16 버튼으로 조절
  const resizeSel = (d: number) =>
    setElements((v) =>
      v.map((el) => {
        if (el.id !== selectedId) return el;
        if (el.kind === "sticker") return { ...el, size: Math.max(32, Math.min(220, (el.size || 72) + d)) };
        return { ...el, size: Math.max(50, Math.min(200, (el.size || 100) + d)) };
      })
    );
  const deleteSel = () => { setElements((v) => v.filter((el) => el.id !== selectedId)); setSelectedId(null); };

  const selectTool = (t: PenTool) => {
    if (t === "undo") { undo(); return; }
    setPickerOpen(false);
    setBgOpen(false);
    setSelectedId(null);
    setTool((cur) => (cur === t ? "none" : t));
  };

  const drawLive = drawingRef.current;

  return (
    <div
      ref={editorRef}
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      {/* Header */}
      <div
        className="absolute left-0 right-0 flex items-center justify-between z-30"
        style={{
          top: APP_HEADER_TOP,
          height: APP_HEADER_HEIGHT,
          paddingLeft: APP_INLINE_START,
          paddingRight: APP_INLINE_END,
        }}
      >
        <GlassBtn onClick={onBack} ariaLabel="스크랩 라이브러리로 돌아가기"><BackArrowIcon /></GlassBtn>
        <div className="flex min-w-0 gap-1.5" style={{ maxWidth: "calc(100% - 48px)" }}>
          <button
            onClick={() => setBgOpen((v) => !v)}
            className="flex items-center justify-center rounded-full px-2.5 shrink-0"
            style={{ height: 40, backgroundColor: bgOpen ? "var(--pt-brand-secondary)" : "var(--pt-bg-surface)", boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)" }}
          >
            <span className="label" style={{ color: "var(--pt-brand-primary)", fontSize: 12 }}>배경</span>
          </button>
          <button
            aria-label="스크랩 공유"
            onClick={() => onShare({ elements, strokes, bg })}
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 40, height: 40, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)" }}
          >
            <ShareIcon color="var(--pt-brand-primary)" />
          </button>
        </div>
      </div>

      {/* Background picker */}
      {bgOpen && (
        <div
          className="absolute z-40 rounded-2xl p-2 flex justify-end gap-2"
          style={{
            top: `calc(${APP_CONTENT_TOP} + 6px)`,
            left: APP_PANEL_START,
            right: APP_PANEL_END,
            backgroundColor: "var(--pt-bg-surface)",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {BG_OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => { setBg(o.id); setBgOpen(false); }}
              className="rounded-lg flex-1 max-w-[44px] min-w-0 aspect-square flex items-center justify-center overflow-hidden"
              style={{ border: bg === o.id ? "2px solid var(--pt-brand-primary)" : "1px solid var(--pt-border-default)", ...(o.id === "paper" ? {} : scrapBgStyle(o.id)) }}
            >
              {o.id === "paper" ? <img src={imgBgPaper} alt="원본" className="w-full h-full object-cover" /> : <span className="caption" style={{ fontSize: 9, color: "var(--pt-text-secondary)" }}>{o.label}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasViewportRef}
        className="absolute left-0 right-0 bottom-0 overflow-x-hidden overflow-y-auto no-scrollbar"
        style={{
          top: APP_CONTENT_TOP,
          paddingBottom: `calc(112px + ${APP_SAFE_BOTTOM})`,
          overscrollBehavior: "contain",
        }}
      >
        <div
          className="relative shrink-0"
          style={{
            width: "100%",
            height: SCRAP_CANVAS_HEIGHT * canvasScale,
          }}
        >
          <div
            ref={canvasRef}
            className="absolute top-0 overflow-hidden"
            style={{
              left: "50%",
              marginLeft: -SCRAP_CANVAS_WIDTH / 2,
              width: SCRAP_CANVAS_WIDTH,
              height: SCRAP_CANVAS_HEIGHT,
              transform: `scale(${canvasScale})`,
              transformOrigin: "top center",
              touchAction: isDraw || tool === "eraser" ? "none" : "auto",
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
          >
            {/* background layer */}
            <div className="absolute inset-0 pointer-events-none" style={scrapBgStyle(bg)} />
            {bg === "paper" && <img src={imgBgPaper} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.4 }} />}

            {/* strokes */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${SCRAP_CANVAS_WIDTH} ${SCRAP_CANVAS_HEIGHT}`}
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              {strokes.map((s) => (
                <polyline key={s.id} points={s.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" opacity={s.tool === "highlighter" ? 0.4 : 1} />
              ))}
              {drawLive && (
                <polyline points={drawLive.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={drawLive.color} strokeWidth={drawLive.width} strokeLinecap="round" strokeLinejoin="round" opacity={drawLive.tool === "highlighter" ? 0.4 : 1} />
              )}
            </svg>

            {/* elements */}
            {elements.map((el) => (
              <div
                key={el.id}
                onPointerDown={(e) => elDown(e, el)}
                className="absolute"
                style={{
                  left: el.x,
                  top: el.y,
                  touchAction: "none",
                  cursor: tool === "none" ? "grab" : tool === "eraser" ? "pointer" : "default",
                  outline: selectedId === el.id ? "2px dashed var(--pt-brand-primary)" : "none",
                  outlineOffset: 2,
                  borderRadius: 6,
                  transform: el.kind === "sticker" ? undefined : `scale(${(el.size ?? 100) / 100})`,
                  transformOrigin: "top left",
                }}
              >
                {el.kind === "sticker" ? (
                  <img src={el.src} alt="스티커" draggable={false} style={{ width: el.size, height: el.size, objectFit: "contain", pointerEvents: "none" }} />
                ) : (
                  <div className="rounded-3xl" style={{ maxWidth: 240, padding: "10px 12px", backgroundColor: el.kind === "note" ? el.bg : "var(--pt-bg-surface)", border: el.kind === "text" ? "1px dashed var(--pt-border-strong)" : "none", boxShadow: "0px 2px 2px rgba(0,0,0,0.06)" }}>
                    <p style={{ fontFamily: "var(--pt-font-title)", fontWeight: 600, fontSize: 12, lineHeight: "18px", color: el.color || "#1a1a1a", pointerEvents: "none", whiteSpace: "pre-wrap" }}>{el.text}</p>
                  </div>
                )}
              </div>
            ))}

            {/* empty hint */}
            {isNew && elements.length === 0 && strokes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 text-center">
                <p className="body-2" style={{ color: "var(--pt-text-secondary)" }}>아래 도구로 나만의 스크랩북을 꾸며보세요</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected element control (이동은 드래그로 항상 가능, 여기선 크기 조절·삭제 — 스티커/노트/텍스트 공통) */}
      {selectedEl && tool === "none" && (
        <div
          className="absolute z-40 flex items-center gap-2 rounded-full px-3 py-2 overflow-x-auto no-scrollbar"
          style={{
            left: APP_PANEL_START,
            right: APP_PANEL_END,
            bottom: `calc(108px + ${APP_SAFE_BOTTOM})`,
            width: "fit-content",
            maxWidth: "calc(100% - 16px)",
            marginInline: "auto",
            backgroundColor: "var(--pt-bg-surface)",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.18)",
          }}
        >
          <span className="caption" style={{ color: "var(--pt-text-secondary)" }}>크기</span>
          <button onClick={() => resizeSel(-16)} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: "var(--pt-bg-card)" }}><span style={{ fontSize: 18, color: "var(--pt-text-primary)", lineHeight: 1 }}>−</span></button>
          <span className="caption" style={{ color: "var(--pt-text-primary)", width: 34, textAlign: "center" }}>
            {selectedEl.kind === "sticker" ? selectedEl.size ?? 72 : selectedEl.size ?? 100}{selectedEl.kind === "sticker" ? "px" : "%"}
          </span>
          <button onClick={() => resizeSel(16)} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: "var(--pt-bg-card)" }}><span style={{ fontSize: 18, color: "var(--pt-text-primary)", lineHeight: 1 }}>+</span></button>
          <div className="w-px h-5" style={{ backgroundColor: "var(--pt-border-default)" }} />
          <button onClick={deleteSel} className="rounded-full px-3 flex items-center" style={{ height: 28, backgroundColor: "var(--pt-bg-card)" }}><span className="caption" style={{ color: "#ff6b6b" }}>삭제</span></button>
        </div>
      )}

      {/* Picker (내 색상 팔레트) */}
      {isDraw && pickerOpen && (
        <div
          className="absolute z-40 rounded-3xl p-3 flex flex-wrap gap-2 justify-center"
          style={{
            left: APP_PANEL_START,
            right: APP_PANEL_END,
            bottom: `calc(168px + ${APP_SAFE_BOTTOM})`,
            width: 260,
            maxWidth: "calc(100% - 16px)",
            marginInline: "auto",
            backgroundColor: "var(--pt-bg-surface)",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {PEN_COLORS.map((c) => (
            <button key={c} onClick={() => { tool === "highlighter" ? setHlColor(c) : setPenColor(c); setPickerOpen(false); }} className="rounded-full" style={{ width: 32, height: 32, backgroundColor: c, border: activeColor === c ? "2px solid var(--pt-text-primary)" : "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          ))}
        </div>
      )}
      {/* Pen detail (형광펜/펜 선택 시) */}
      {isDraw && (
        <div
          className="absolute z-40 rounded-full px-4 py-2 flex items-center gap-3"
          style={{
            left: APP_PANEL_START,
            right: APP_PANEL_END,
            bottom: `calc(110px + ${APP_SAFE_BOTTOM})`,
            width: "fit-content",
            maxWidth: "calc(100% - 16px)",
            marginInline: "auto",
            backgroundColor: "var(--pt-bg-surface)",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {[3, 6, 10].map((w) => (
            <button key={w} onClick={() => setPenWidth(w)} className="flex items-center justify-center" style={{ width: 28, height: 28 }}>
              <span className="rounded-full" style={{ width: w + 4, height: w + 4, backgroundColor: penWidth === w && tool === "pencil" ? "var(--pt-text-primary)" : "var(--pt-text-secondary)" }} />
            </button>
          ))}
          <div className="w-px h-5" style={{ backgroundColor: "var(--pt-border-default)" }} />
          <button onClick={() => setPickerOpen((v) => !v)} className="rounded-full" style={{ width: 26, height: 26, backgroundColor: activeColor, border: "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
        </div>
      )}
      {/* Eraser mode submenu */}
      {tool === "eraser" && (
        <div
          className="absolute z-40 rounded-full px-2 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
          style={{
            left: APP_PANEL_START,
            right: APP_PANEL_END,
            bottom: `calc(110px + ${APP_SAFE_BOTTOM})`,
            width: "fit-content",
            maxWidth: "calc(100% - 16px)",
            marginInline: "auto",
            backgroundColor: "var(--pt-bg-surface)",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {([["stroke", "펜 지우기"], ["area", "닿는 곳"], ["all", "전체 지우기"]] as [EraserMode, string][]).map(([m, label]) => (
            <button key={m} onClick={() => (m === "all" ? eraseAll() : setEraserMode(m))} className="rounded-full px-3 py-1.5 caption" style={{ backgroundColor: m !== "all" && eraserMode === m ? "var(--pt-brand-primary)" : "var(--pt-bg-card)", color: m === "all" ? "#ff6b6b" : eraserMode === m ? "#fff" : "var(--pt-text-secondary)" }}>
              {label}
            </button>
          ))}
        </div>
      )}
      {/* Text compose (키보드 선택 시) — 실제 모바일 키보드가 올라옴 */}
      {tool === "keyboard" && (
        <div
          className="absolute left-0 right-0 z-40"
          style={{
            bottom: keyboardInset,
            paddingBottom: keyboardInset > 0 ? 0 : APP_SAFE_BOTTOM,
            backgroundColor: "var(--pt-bg-surface)",
            boxShadow: "0px -4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <div
            className="flex items-center gap-2 pt-2"
            style={{
              paddingLeft: APP_INLINE_START,
              paddingRight: APP_INLINE_END,
            }}
          >
            {["#1a2535", "#6083f5", "#ff6b6b", "#51cf66"].map((c) => (
              <button key={c} onClick={() => setTextColor(c)} className="rounded-full" style={{ width: 22, height: 22, backgroundColor: c, border: textColor === c ? "2px solid var(--pt-text-primary)" : "2px solid #fff" }} />
            ))}
            <span className="caption ml-auto" style={{ color: "var(--pt-text-secondary)" }}>텍스트 서식</span>
          </div>
          <div
            className="flex items-center gap-2 py-3"
            style={{
              paddingLeft: APP_INLINE_START,
              paddingRight: APP_INLINE_END,
            }}
          >
            <input
              ref={inputRef}
              autoFocus
              enterKeyHint="done"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addText()}
              placeholder="메모를 입력하세요"
              className="flex-1 min-w-0 rounded-full px-4 bg-white outline-none"
              style={{ height: 40, border: "1.4px solid var(--pt-border-default)", color: "var(--pt-text-primary)", fontFamily: "var(--pt-font-title)", fontSize: 16, lineHeight: "20px" }}
            />
            <button onClick={addText} className="rounded-full px-3 flex items-center shrink-0" style={{ height: 40, backgroundColor: "var(--pt-brand-primary)" }}>
              <span className="label" style={{ color: "#fff" }}>추가</span>
            </button>
            <button onClick={() => { setText(""); setTool("none"); }} className="rounded-full px-3 flex items-center shrink-0" style={{ height: 40, backgroundColor: "var(--pt-bg-card)" }}>
              <span className="label" style={{ color: "var(--pt-text-secondary)" }}>완료</span>
            </button>
          </div>
        </div>
      )}
      {/* Clipboard sheet (클립보드 선택 시) — 클리핑/스티커/테이프 */}
      {tool === "clipboard" && <ClipboardSheet clippings={clippings} onPick={addSticker} onPickText={addClip} onClose={() => setTool("none")} />}

      {/* Pen bar (툴바) */}
      {tool !== "keyboard" && (
        <div
          className="absolute z-40 flex items-center justify-between gap-1 rounded-full py-3 border border-white"
          style={{
            left: APP_PANEL_START,
            right: APP_PANEL_END,
            bottom: `calc(40px + ${APP_SAFE_BOTTOM})`,
            maxWidth: 348,
            marginInline: "auto",
            paddingLeft: "clamp(8px, 3vw, 16px)",
            paddingRight: "clamp(8px, 3vw, 16px)",
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          {(["keyboard", "highlighter", "pencil", "eraser", "clipboard", "scissors", "undo"] as PenTool[]).map((t) => (
            <button
              key={t}
              onClick={() => selectTool(t)}
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "clamp(24px, 8vw, 28px)", height: "clamp(24px, 8vw, 28px)", backgroundColor: tool === t ? "var(--pt-brand-secondary)" : "transparent" }}
            >
              <PenToolIcon name={t} color={tool === t ? "var(--pt-brand-primary)" : "var(--pt-text-primary)"} />
            </button>
          ))}
        </div>
      )}

      <div aria-hidden className="absolute inset-0 pointer-events-none border-4" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
    </div>
  );
}

// 클리핑 시트의 "테이프" 탭 미리보기 크기 — 상점의 TAPE_WIDTH(80)는 79px짜리 카드용이라
// 여기 64px 버튼에는 살짝 작게 잡아야 회전한 테이프가 버튼 밖으로 삐져나오지 않는다
const CLIP_SHEET_TAPE_WIDTH = 48;
// 클릭한 테이프 영역만 실제로 잘라 독립된 이미지로 반환 — 스크랩 요소는 <img src>를 그대로
// 그리므로, 잘리지 않은 시트 전체를 넘기면 캔버스에 엉뚱한 통짜 시트 이미지가 올라간다
function cropTapeToDataUrl(item: ShopItem): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!item.crop) { reject(new Error("no crop")); return; }
    const crop = item.crop;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.w;
      canvas.height = crop.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("no ctx")); return; }
      ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => reject(new Error("image load failed"));
    img.src = imgTape;
  });
}

function ClipboardSheet({ clippings, onPick, onPickText, onClose }: { clippings: string[]; onPick: (src: string) => void; onPickText: (t: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState<"clip" | "sticker" | "tape">("clip");
  const tabs: [typeof tab, string][] = [["clip", "클리핑"], ["sticker", "스티커"], ["tape", "테이프"]];
  return (
    <div
      className="absolute z-40 rounded-xl border border-white overflow-hidden flex flex-col"
      style={{
        left: APP_PANEL_START,
        right: APP_PANEL_END,
        bottom: `calc(110px + ${APP_SAFE_BOTTOM})`,
        maxWidth: 335,
        maxHeight: `calc(100% - 126px - ${APP_SAFE_BOTTOM})`,
        marginInline: "auto",
        backgroundColor: "var(--pt-bg-surface)",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      <div className="flex shrink-0">
        {tabs.map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-3.5 caption" style={{ backgroundColor: tab === t ? "var(--pt-bg-accent-light)" : "transparent", borderBottom: tab === t ? "1px solid var(--pt-brand-primary)" : "1px solid var(--pt-border-strong)", color: tab === t ? "var(--pt-text-primary)" : "var(--pt-text-secondary)" }}>
            {label}
          </button>
        ))}
      </div>
      {tab === "clip" ? (
        <div className="flex flex-col gap-2 p-4 min-h-0 max-h-[220px] overflow-y-auto no-scrollbar">
          {clippings.length === 0 ? (
            <p className="caption text-center py-6" style={{ color: "var(--pt-text-secondary)" }}>원문에서 형광펜으로 문장을 스크랩하거나 가위로 이미지를 오려보세요</p>
          ) : (
            clippings.map((c, i) =>
              c.startsWith("data:image") ? (
                <button
                  key={i}
                  onClick={() => onPick(c)}
                  className="rounded-lg overflow-hidden self-start"
                  style={{ width: 64, height: 64, backgroundColor: "var(--pt-bg-primary)", border: "1px solid var(--pt-border-accent)" }}
                >
                  <img src={c} alt="오려낸 이미지" className="w-full h-full object-cover pointer-events-none" />
                </button>
              ) : (
                <button key={i} onClick={() => onPickText(c)} className="text-left rounded-lg px-3 py-2.5" style={{ backgroundColor: "var(--pt-bg-accent-light)", border: "1px solid var(--pt-border-accent)" }}>
                  <span className="caption" style={{ color: "var(--pt-text-primary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c}</span>
                </button>
              )
            )
          )}
        </div>
      ) : tab === "sticker" ? (
        <div className="flex flex-wrap justify-center gap-2.5 p-4 min-h-0 max-h-[220px] overflow-y-auto no-scrollbar">
          {STICKERS.map((src, i) => (
            <button key={i} onClick={() => onPick(src)} className="rounded-lg overflow-hidden" style={{ width: 64, height: 64, backgroundColor: "var(--pt-bg-primary)" }}>
              <img src={src} alt="스티커" className="w-full h-full object-contain pointer-events-none" />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2.5 p-4 min-h-0 max-h-[220px] overflow-y-auto no-scrollbar">
          {TAPE_ITEMS.map((item) => {
            const scale = CLIP_SHEET_TAPE_WIDTH / item.crop!.w;
            return (
              <button
                key={item.id}
                onClick={() => { cropTapeToDataUrl(item).then(onPick).catch(() => {}); }}
                className="rounded-lg overflow-hidden flex items-center justify-center"
                style={{ width: 64, height: 64, backgroundColor: "var(--pt-bg-primary)" }}
              >
                <div
                  style={{
                    width: CLIP_SHEET_TAPE_WIDTH,
                    height: item.crop!.h * scale,
                    transform: "rotate(-18deg)",
                    backgroundImage: `url(${imgTape})`,
                    backgroundSize: `${TAPE_SHEET.w * scale}px ${TAPE_SHEET.h * scale}px`,
                    backgroundPosition: `-${item.crop!.x * scale}px -${item.crop!.y * scale}px`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
      <button onClick={onClose} className="w-full py-2 caption shrink-0" style={{ color: "var(--pt-text-secondary)" }}>닫기</button>
    </div>
  );
}

// ── Scrap Share Screen (공유하기 — 전체 화면 + 실제 스크랩 템플릿) ──
const SAMPLE_DOC: ScrapDoc = {
  bg: "paper",
  strokes: [],
  elements: [
    { id: "s1", kind: "note", x: 24, y: 20, text: "부동산 공급 대책", bg: "var(--pt-brand-primary)", color: "#ecf0f9" },
    { id: "s2", kind: "note", x: 44, y: 210, text: "일정한 선의 사회적 합의 필요", bg: "var(--pt-brand-secondary)", color: "#1a1a1a" },
    { id: "s3", kind: "sticker", x: 240, y: 300, src: imgToriDeco, size: 96 },
  ],
};
const bgHex = (bg: string | undefined) => (bg?.includes("brand-primary") ? "#6083f5" : bg?.includes("brand-secondary") ? "#e6f997" : "#e6f997");

function ScrapPreview({ doc }: { doc: ScrapDoc }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(300 / SCRAP_CANVAS_WIDTH);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const updateScale = () => {
      const next = preview.clientWidth / SCRAP_CANVAS_WIDTH;
      if (next > 0) setScale(next);
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(preview);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={previewRef} className="relative size-full overflow-hidden">
      <div style={{ width: SCRAP_CANVAS_WIDTH, height: SCRAP_CANVAS_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative", ...scrapBgStyle(doc.bg) }}>
        {doc.bg === "paper" && <img src={imgBgPaper} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.4 }} />}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${SCRAP_CANVAS_WIDTH} ${SCRAP_CANVAS_HEIGHT}`}
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          {doc.strokes.map((s) => (
            <polyline key={s.id} points={s.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" opacity={s.tool === "highlighter" ? 0.4 : 1} />
          ))}
        </svg>
        {doc.elements.map((el) =>
          el.kind === "sticker" ? (
            <img key={el.id} src={el.src} alt="" className="absolute" style={{ left: el.x, top: el.y, width: el.size, height: el.size, objectFit: "contain" }} />
          ) : (
            <div
              key={el.id}
              className="absolute rounded-3xl"
              style={{
                left: el.x,
                top: el.y,
                maxWidth: 240,
                padding: "10px 12px",
                backgroundColor: el.kind === "note" ? el.bg : "var(--pt-bg-surface)",
                border: el.kind === "text" ? "1px dashed var(--pt-border-strong)" : "none",
                boxShadow: "0px 2px 2px rgba(0,0,0,0.06)",
                transform: `scale(${(el.size ?? 100) / 100})`,
                transformOrigin: "top left",
              }}
            >
              <p style={{ fontFamily: "var(--pt-font-title)", fontWeight: 600, fontSize: 12, lineHeight: "18px", color: el.color || "#1a1a1a", whiteSpace: "pre-wrap" }}>{el.text}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ScrapShareScreen({ doc, title, onBack }: { doc: ScrapDoc | null; title: string; onBack: () => void }) {
  const d = doc && (doc.elements.length || doc.strokes.length) ? doc : SAMPLE_DOC;
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobileDevice =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const showToast = (m: string) => {
    setToast(m);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 1800);
  };
  // 모바일은 클립보드·다운로드·외부 앱 실행 시 브라우저/OS가 자체 피드백을 표시한다.
  // 성공 토스트는 PC에서만 띄워 같은 동작에 알림이 두 번 보이지 않게 한다.
  const showActionSuccess = (m: string) => {
    if (!isMobileDevice) showToast(m);
  };

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // 공유 딥링크 — 이 링크를 누르면 앱의 '공유 스크랩 뷰'로 돌아와 순환됨
  const [shareId] = useState(() => Math.random().toString(36).slice(2, 8));
  const shareUrl = `${window.location.origin}${window.location.pathname}#/s/${shareId}`;
  const shareText = "페이퍼토리에서 내 경제공부 스크랩을 공유했어요 #직장인공부 #공스타그램 #페이퍼토리";

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); showActionSuccess("링크를 복사했어요"); }
    catch { showToast(shareUrl); }
  };
  const openShare = (intentUrl: string, name: string) => {
    const w = window.open(intentUrl, "_blank", "noopener");
    if (!w) {
      navigator.clipboard?.writeText(shareUrl)
        .then(() => showActionSuccess(`${name} 공유 링크를 복사했어요`))
        .catch(() => showToast(`${name} 공유 창을 열지 못했어요`));
    } else showActionSuccess(`${name}(으)로 공유해요`);
  };

  const loadImg = (src: string) => new Promise<HTMLImageElement | null>((res) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  const wrapText = (ctx: CanvasRenderingContext2D, t: string, maxW: number) => {
    const words = t.split(""); const lines: string[] = []; let cur = "";
    for (const ch of words) { if (ctx.measureText(cur + ch).width > maxW && cur) { lines.push(cur); cur = ch; } else cur += ch; }
    if (cur) lines.push(cur); return lines;
  };
  const saveImage = async () => {
    const W = SCRAP_CANVAS_WIDTH, H = SCRAP_CANVAS_HEIGHT, S = 2;
    const cv = document.createElement("canvas"); cv.width = W * S; cv.height = H * S;
    const ctx = cv.getContext("2d"); if (!ctx) return; ctx.scale(S, S);
    ctx.fillStyle = d.bg === "lime" ? "#F5FCE0" : d.bg === "blue" ? "#edf0fd" : "#f8f9fb"; ctx.fillRect(0, 0, W, H);
    if (d.bg === "grid") { ctx.strokeStyle = "#e2e5eb"; ctx.lineWidth = 1; for (let x = 0; x < W; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
    if (d.bg === "paper") { const bp = await loadImg(imgBgPaper); if (bp) { ctx.globalAlpha = 0.4; ctx.drawImage(bp, 0, 0, W, H); ctx.globalAlpha = 1; } }
    for (const s of d.strokes) { ctx.strokeStyle = s.color; ctx.lineWidth = s.width; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.globalAlpha = s.tool === "highlighter" ? 0.4 : 1; ctx.beginPath(); s.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke(); ctx.globalAlpha = 1; }
    for (const el of d.elements) {
      if (el.kind === "sticker") { const im = await loadImg(el.src!); if (im) ctx.drawImage(im, el.x, el.y, el.size!, el.size!); }
      else {
        const elScale = (el.size ?? 100) / 100;
        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.scale(elScale, elScale);
        ctx.font = "600 12px sans-serif"; const pad = 12, maxW = 200;
        const lines = wrapText(ctx, el.text || "", maxW - pad * 2);
        const wBox = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width)) + pad * 2);
        const hBox = lines.length * 18 + pad * 2 - 4;
        ctx.fillStyle = el.kind === "note" ? bgHex(el.bg) : "#ffffff";
        const r = 14, x = 0, y = 0; ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + wBox, y, x + wBox, y + hBox, r); ctx.arcTo(x + wBox, y + hBox, x, y + hBox, r); ctx.arcTo(x, y + hBox, x, y, r); ctx.arcTo(x, y, x + wBox, y, r); ctx.fill();
        ctx.fillStyle = el.color || "#1a1a1a"; lines.forEach((l, i) => ctx.fillText(l, x + pad, y + pad + 12 + i * 18));
        ctx.restore();
      }
    }
    // 딥링크 URL을 이미지 하단에 찍어, 이미지를 본 사람도 앱으로 돌아올 수 있게 함
    ctx.globalAlpha = 0.9; ctx.fillStyle = "#6083f5"; ctx.font = "600 12px sans-serif";
    ctx.fillText("📌 " + shareUrl.replace(/^https?:\/\//, ""), 16, H - 20); ctx.globalAlpha = 1;
    cv.toBlob((b) => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "papertory-scrap.png"; a.click(); URL.revokeObjectURL(a.href); showActionSuccess("이미지를 저장했어요"); });
  };

  const targets = [
    {
      label: "카카오",
      bg: "#FEE500",
      fg: "#3C1E1E",
      onClick: () => {
        navigator.clipboard?.writeText(shareUrl)
          .then(() => showActionSuccess("카카오 공유 링크를 복사했어요"))
          .catch(() => showToast("카카오 공유 링크를 복사하지 못했어요"));
      },
    },
    { label: "X", bg: "#000000", fg: "#ffffff", onClick: () => openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "X") },
    { label: "스레드", bg: "#101010", fg: "#ffffff", onClick: () => openShare(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "스레드") },
    { label: "링크복사", bg: "var(--pt-bg-card)", fg: "var(--pt-text-primary)", onClick: copyLink },
    { label: "이미지저장", bg: "var(--pt-bg-card)", fg: "var(--pt-text-primary)", onClick: saveImage },
  ];

  return (
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: "var(--pt-bg-primary)" }}>
      <div
        className="pt-app-header absolute left-0 right-0 flex items-center z-10"
        style={{
          top: APP_HEADER_TOP,
          height: APP_HEADER_HEIGHT,
          paddingLeft: APP_INLINE_START,
          paddingRight: APP_INLINE_END,
        }}
      >
        <GlassBtn onClick={onBack} ariaLabel="이전 화면으로 돌아가기"><BackArrowIcon /></GlassBtn>
        <p className="title flex-1 text-center pr-10" style={{ color: "var(--pt-text-primary)" }}>공유하기</p>
      </div>

      <div
        className="pt-scroll h-full overflow-y-auto no-scrollbar flex flex-col items-center"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(16px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        {/* Share template card — 실제 스크랩 내용. 화면 하나에 공유 버튼·안내문구까지 스크롤 없이
            다 보이도록 미리보기 카드 자체를 작게 고정한다(고정폭 393px 그대로 쓰면 세로로 너무 길어짐).
            iPhone SE(375×667)처럼 가장 작은 화면에서도 안내문구까지 잘리지 않도록 190px로 더 줄임 */}
        <div className="rounded-[24px] overflow-hidden" style={{ width: "min(190px, calc(100% - 24px))", backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 8px 24px rgba(26,37,53,0.18)" }}>
          <div className="flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: "var(--pt-brand-primary)" }}>
            <div style={{ width: 16, height: 16 }}><img src={imgToriDeco} alt="Tori" className="w-full h-full object-contain" /></div>
            <span className="caption" style={{ color: "#fff", fontSize: 10 }}>페이퍼토리</span>
            <span className="caption ml-auto" style={{ color: "#dfe7ff", fontSize: 8 }}>나의 스크랩</span>
          </div>
          <div style={{ aspectRatio: `${SCRAP_CANVAS_WIDTH} / ${SCRAP_CANVAS_HEIGHT}`, overflow: "hidden", backgroundColor: "var(--pt-bg-primary)" }}>
            <ScrapPreview doc={d} />
          </div>
          <div className="px-3 py-1.5 flex flex-col gap-0.5">
            <p className="caption overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: "var(--pt-text-primary)", fontWeight: 700, fontSize: 10 }}>{title}</p>
            <p className="caption" style={{ color: "var(--pt-text-secondary)", fontSize: 8 }}>{TODAY_DATE_STR} · 나의 경제공부 기록</p>
            <p className="caption" style={{ color: "var(--pt-brand-primary)", fontSize: 8 }}>#직장인공부 #공스타그램 #페이퍼토리</p>
            <p className="caption break-all" style={{ color: "var(--pt-text-secondary)", fontSize: 7, marginTop: 2 }}>🔗 {shareUrl.replace(/^https?:\/\//, "")}</p>
          </div>
        </div>

        {/* Share targets */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 px-3">
          {targets.map((t) => (
            <button key={t.label} onClick={t.onClick} className="flex flex-col items-center gap-1">
              <span className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, backgroundColor: t.bg }}>
                <span className="caption" style={{ color: t.fg, fontSize: 9 }}>{t.label}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="caption mt-2 px-8 text-center" style={{ color: "var(--pt-text-secondary)" }}>
          링크를 받은 사람이 누르면 이 스크랩으로 돌아와요 🔁
        </p>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-2"
          style={{
            bottom: `calc(24px + ${APP_SAFE_BOTTOM})`,
            backgroundColor: "rgba(26,37,53,0.9)",
            width: "max-content",
            maxWidth: "calc(100% - 24px)",
          }}
        >
          <span className="caption break-all" style={{ color: "#fff" }}>{toast}</span>
        </div>
      )}

      <div aria-hidden className="absolute inset-0 pointer-events-none border-4" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
    </div>
  );
}

// ── Shared Scrap View (딥링크 착지 — 공유로 들어온 화면) ──
function SharedScrapView({ doc, onArticle, onFeed }: { doc: ScrapDoc | null; onArticle: () => void; onFeed: () => void }) {
  const d = doc && (doc.elements.length || doc.strokes.length) ? doc : SAMPLE_DOC;
  return (
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: "var(--pt-bg-primary)" }}>
      {/* Inbound banner */}
      <div
        className="pt-app-header absolute left-0 right-0 z-10 flex items-center gap-2"
        style={{
          top: APP_HEADER_TOP,
          height: APP_HEADER_HEIGHT,
          paddingLeft: `calc(20px + ${APP_SAFE_LEFT})`,
          paddingRight: `calc(20px + ${APP_SAFE_RIGHT})`,
        }}
      >
        <div style={{ width: 28, height: 28 }}><img src={imgToriDeco} alt="Tori" className="w-full h-full object-contain" /></div>
        <span className="label" style={{ color: "var(--pt-text-primary)" }}>송토리님이 공유한 스크랩</span>
      </div>

      <div
        className="pt-scroll h-full overflow-y-auto no-scrollbar flex flex-col items-center"
        style={{
          paddingTop: APP_CONTENT_TOP,
          paddingRight: APP_SAFE_RIGHT,
          paddingBottom: `calc(32px + ${APP_SAFE_BOTTOM})`,
          paddingLeft: APP_SAFE_LEFT,
        }}
      >
        <div className="rounded-[24px] overflow-hidden" style={{ width: `min(${SCRAP_CANVAS_WIDTH}px, calc(100% - 24px))`, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 8px 24px rgba(26,37,53,0.18)" }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "var(--pt-brand-primary)" }}>
            <div style={{ width: 26, height: 26 }}><img src={imgToriDeco} alt="Tori" className="w-full h-full object-contain" /></div>
            <span className="label" style={{ color: "#fff" }}>페이퍼토리</span>
            <span className="caption ml-auto" style={{ color: "#dfe7ff" }}>공유된 스크랩</span>
          </div>
          <div style={{ aspectRatio: `${SCRAP_CANVAS_WIDTH} / ${SCRAP_CANVAS_HEIGHT}`, overflow: "hidden", backgroundColor: "var(--pt-bg-primary)" }}>
            <ScrapPreview doc={d} />
          </div>
          <div className="px-4 py-3 flex flex-col gap-1">
            <p className="subtitle" style={{ color: "var(--pt-text-primary)" }}>앤트로픽, 10월 IPO 추진</p>
            <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>2026.07.20 · 송토리님의 경제공부 기록</p>
            <p className="caption" style={{ color: "var(--pt-brand-primary)" }}>#직장인공부 #공스타그램 #페이퍼토리</p>
          </div>
        </div>

        {/* Circulation CTAs */}
        <div className="flex flex-col gap-3 mt-8 w-full max-w-[393px] px-8">
          <button onClick={onArticle} className="rounded-3xl py-4 flex items-center justify-center gap-2" style={{ backgroundColor: "var(--pt-brand-primary)" }}>
            <span className="label" style={{ color: "#fff" }}>원문 기사 보기</span>
            <ArrowRightIcon color="#fff" />
          </button>
          <button onClick={onFeed} className="rounded-3xl py-4 flex items-center justify-center" style={{ backgroundColor: "var(--pt-brand-secondary)" }}>
            <span className="label" style={{ color: "var(--pt-brand-primary)" }}>페이퍼토리 둘러보기</span>
          </button>
        </div>
        <p className="caption mt-4 text-center px-8" style={{ color: "var(--pt-text-secondary)" }}>
          친구의 스크랩을 보고 원문·피드로 이어서 둘러보세요
        </p>
      </div>

      <div aria-hidden className="absolute inset-0 pointer-events-none border-4" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
    </div>
  );
}

// ── Navigation Drawer ──
function NavigationDrawer({
  currentScreen,
  onClose,
  onNavigate,
}: {
  currentScreen: Screen;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  // Figma 706:3675 기준: 홈/마이페이지는 하위 항목 없는 flat 메뉴, 나의 기록/토리 서비스만 하위 목록을 가짐
  type MenuEntry =
    | { type: "flat"; label: string; screen: Screen | null }
    | { type: "section"; title: string; items: { label: string; screen: Screen | null }[] };

  const menu: MenuEntry[] = [
    { type: "flat", label: "홈", screen: "landing" },
    {
      type: "section",
      title: "나의 기록",
      items: [
        { label: "스크랩 라이브러리", screen: "scrap-library" },
        { label: "읽기 기록 달력", screen: "calendar" },
      ],
    },
    {
      type: "section",
      title: "토리 서비스",
      items: [
        { label: "도토리 줍기", screen: "mission" },
        { label: "상점", screen: "shop" },
      ],
    },
    { type: "flat", label: "마이페이지", screen: "mypage" },
  ];

  return (
    <>
      {/* Dim overlay */}
      <div
        className="pt-drawer-overlay fixed inset-0 z-40"
        style={{ backgroundColor: "var(--pt-overlay-medium)" }}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div
        className="pt-drawer-panel fixed top-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          left: APP_SAFE_LEFT,
          width: `min(312px, calc(100% - ${APP_SAFE_LEFT} - 16px))`,
          backgroundColor: "var(--pt-bg-primary)",
          borderRadius: "36px 12px 12px 36px",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 min-[340px]:px-7 pb-4"
          style={{ paddingTop: `calc(20px + var(--pt-safe-top, 0px))` }}
        >
          <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
            전체 메뉴
          </p>
          <button aria-label="전체 메뉴 닫기" onClick={onClose} className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
            <CloseIcon />
          </button>
        </div>

        {/* Menu sections */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 min-[340px]:px-5 no-scrollbar">
          <div className="rounded-3xl overflow-hidden pt-2" style={{ backgroundColor: "var(--pt-chip-bg)" }}>
            {menu.map((entry) =>
              entry.type === "flat" ? (
                <button
                  key={entry.label}
                  className="w-full text-left flex items-center px-5 py-3.5 rounded-3xl"
                  style={{
                    backgroundColor:
                      entry.screen === currentScreen ? "var(--pt-bg-surface)" : "transparent",
                  }}
                  onClick={() => entry.screen && onNavigate(entry.screen)}
                >
                  <span className="subtitle" style={{ color: "var(--pt-brand-primary)" }}>
                    {entry.label}
                  </span>
                </button>
              ) : (
                <div key={entry.title}>
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <span className="subtitle" style={{ color: "var(--pt-brand-primary)" }}>
                      {entry.title}
                    </span>
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                      <path
                        d="M1 1L7 7L13 1"
                        stroke="var(--pt-text-primary)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  {entry.items.map((item) => {
                    const isActive = item.screen === currentScreen;
                    return (
                      <button
                        key={item.label}
                        className={`w-full text-left flex items-center h-[50px] ${isActive ? "rounded-2xl" : "border-b"}`}
                        style={{
                          paddingLeft: 32,
                          paddingRight: 32,
                          borderColor: "var(--pt-border-menu)",
                          backgroundColor: isActive ? "var(--pt-bg-surface)" : "transparent",
                        }}
                        onClick={() => item.screen && onNavigate(item.screen)}
                      >
                        <span className="caption" style={{ color: "var(--pt-text-secondary)", fontSize: 15 }}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-2 px-3 min-[340px]:px-4 pt-5"
          style={{ paddingBottom: `calc(20px + ${APP_SAFE_BOTTOM})` }}
        >
          <div
            className="-scale-x-100 shrink-0"
            style={{ width: "clamp(72px, 30vw, 94px)", aspectRatio: "94 / 93" }}
          >
            <img src={imgToriMenu} alt="Tori" className="w-full h-full object-contain" />
          </div>
          <div className="rounded-3xl px-3 py-2" style={{ backgroundColor: "var(--pt-brand-secondary)" }}>
            <span className="label" style={{ color: "var(--pt-brand-primary)", fontSize: 12 }}>
              도토리 21개 모았어요!
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Start Screen ──
function StartScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="size-full">
      <StartScreenImport />
    </div>
  );
}

// ── App ──
export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  // 화면 이동 이력 스택 — 직전 화면 1칸만 기억하면 A→B→A 왕복(기사↔스크랩북)에 갇히므로 스택으로 관리
  const [screenStack, setScreenStack] = useState<Screen[]>([]);
  const [articleTab, setArticleTab] = useState<ArticleTab>("original");
  const [category, setCategory] = useState<Category>("Today");
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 원문 뷰어에 넘길 기사 — 지면(히어로)에서 선택한 기사가 그대로 이어짐
  const [selectedArticle, setSelectedArticle] = useState<NewsItem>(ALL_NEWS[0]);

  // 읽기 기록(완독) 상태 — 메인 피드 완독 시 오늘 카운트 +1 되어 달력에 반영
  const [readsByDate, setReadsByDate] = useState<Record<number, string[]>>({ ...SEED_READS });
  const [selectedDay, setSelectedDay] = useState<number>(TODAY_DAY);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(7);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [scrapNew, setScrapNew] = useState(false);
  const [clippings, setClippings] = useState<string[]>([]);
  // 기사별 형광펜/볼펜 필기 기록 — 기사 id로 보관해 다시 들어와도 그대로 보이도록 함
  const [articleAnnotations, setArticleAnnotations] = useState<
    Record<string, { highlights: HighlightRange[]; strokes: ArticleStroke[] }>
  >({});
  const [scrapSnapshot, setScrapSnapshot] = useState<ScrapDoc | null>(null);
  // 스크랩 라이브러리 — 항상 맨 앞이 가장 최근에 만들거나 수정한 스크랩
  const [savedScraps, setSavedScraps] = useState<SavedScrap[]>(SEED_SAVED_SCRAPS);
  const [scrapInitialDoc, setScrapInitialDoc] = useState<ScrapDoc | undefined>(undefined);
  const currentScrapIdRef = useRef<number | null>(null);
  const currentScrapTitleRef = useRef<string>("제목 없음");
  const nextScrapIdRef = useRef(1000);
  const usesViewportScroller =
    screen === "start" || screen === "category" || screen === "scrapbook";
  const toggleClip = (t: string, on: boolean) =>
    setClippings((prev) => (on ? (prev.includes(t) ? prev : [...prev, t]) : prev.filter((x) => x !== t)));

  // 도토리 줍기 — 출석체크(30개)는 이미 완료된 상태로 시작. 기사를 3번 완독하면
  // "기사 3개 완독하기" 미션이 자동 완료되며 보상(10개)이 한 번만 지급된다.
  const [acornCount, setAcornCount] = useState(30);
  const [articleReadCount, setArticleReadCount] = useState(0);
  const articleMissionDone = articleReadCount >= 3;
  const handleArticleReadComplete = () => {
    setArticleReadCount((prev) => {
      const next = prev + 1;
      if (prev < 3 && next >= 3) setAcornCount((a) => a + 10);
      return next;
    });
  };

  // 요소·필기·배경이 한 번이라도 바뀌면 호출됨 — 신규 스크랩이면 이때 처음 목록에 생기고,
  // 기존 스크랩이면 내용을 갱신하며 항상 맨 앞(최신순)으로 올라온다
  const handleScrapAutoSave = (doc: ScrapDoc) => {
    setSavedScraps((prev) => {
      let id = currentScrapIdRef.current;
      if (id == null) {
        id = nextScrapIdRef.current++;
        currentScrapIdRef.current = id;
      }
      const rest = prev.filter((s) => s.id !== id);
      return [{ id, title: currentScrapTitleRef.current, date: TODAY_DATE_STR, doc }, ...rest];
    });
  };
  const openNewScrap = (title: string) => {
    currentScrapIdRef.current = null;
    currentScrapTitleRef.current = title;
    setScrapInitialDoc(undefined);
    setScrapNew(true);
    goTo("scrapbook");
  };
  // 1기사 1스크랩북 원칙 — 이미 이 기사로 만든 스크랩이 있으면 그걸 이어서 열고,
  // 없을 때만 새로 만든다. 뒤로가기/앱 재진입 후에도 꾸미던 내용이 그대로 보이는 이유이기도 함
  // (자동저장이 항상 같은 id로 갱신되므로). seedDoc은 기존 스크랩이 없을 때만 초기값으로 쓰인다
  // (기사 제목·형광펜 클립을 미리 캔버스에 올려 빈 화면으로 시작하지 않도록)
  const openScrapForArticle = (title: string, seedDoc?: ScrapDoc) => {
    const found = savedScraps.find((s) => s.title === title);
    currentScrapIdRef.current = found ? found.id : null;
    currentScrapTitleRef.current = found?.title ?? title;
    setScrapInitialDoc(found?.doc ?? seedDoc);
    setScrapNew(!found);
    goTo("scrapbook");
  };

  // 딥링크 진입: 공유 링크(#/s/{id})로 들어오면 스플래시를 건너뛰고 '공유 스크랩 뷰'로 순환 진입
  useEffect(() => {
    if (/^#\/s\//.test(window.location.hash)) setScreen("shared-scrap");
  }, []);

  useEffect(() => {
    if (usesViewportScroller) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }, [screen, usesViewportScroller]);

  useEffect(() => {
    document.body.classList.toggle("pt-body--locked", usesViewportScroller);
    return () => document.body.classList.remove("pt-body--locked");
  }, [usesViewportScroller]);

  useEffect(() => {
    if (!drawerOpen && !pickerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen, pickerOpen]);

  const isCurrentMonth = calYear === TODAY_YEAR && calMonth === TODAY_MONTH;
  // 달력 히트맵은 '개수'만 필요 → 날짜별 기사 배열 길이로 환산
  const monthReads: Record<number, number> = isCurrentMonth
    ? Object.fromEntries(Object.entries(readsByDate).map(([d, arr]) => [Number(d), arr.length]))
    : {};
  // 완독 시 그날(오늘) 기록에 방금 읽은 실제 기사를 추가 (중복 방지)
  const markTodayRead = () =>
    setReadsByDate((prev) => {
      const cur = prev[TODAY_DAY] || [];
      return cur.includes(selectedArticle.id) ? prev : { ...prev, [TODAY_DAY]: [...cur, selectedArticle.id] };
    });

  const goTo = (s: Screen) => {
    if (s === screen) return;
    setScreenStack((h) => [...h, screen].slice(-20));
    setScreen(s);
  };

  // 스택을 한 칸 되감는다. 비어 있으면(딥링크 등 직접 진입) 지면으로 복귀
  const goBack = () => {
    const target = screenStack.length ? screenStack[screenStack.length - 1] : "landing";
    setScreenStack((h) => h.slice(0, -1));
    setScreen(target);
  };

  const handleDrawerNavigate = (s: Screen) => {
    setDrawerOpen(false);
    goTo(s);
  };

  const renderScreen = () => {
    switch (screen) {
      case "start":
        return <StartScreen onDone={() => setScreen("landing")} />;

      case "landing":
        return (
          <LandingScreen
            category={category}
            onDropdownClick={() => goTo("category")}
            onNewsClick={(a) => {
              setSelectedArticle(a);
              setArticleTab("original");
              goTo("article");
            }}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        );

      case "category":
        return (
          <CategoryScreen
            onCategorySelect={(cat) => {
              setCategory(cat);
              goTo("category-landing");
            }}
            onBack={goBack}
          />
        );

      case "category-landing":
        return (
          <LandingScreen
            category={category}
            onDropdownClick={() => goTo("category")}
            onNewsClick={(a) => {
              setSelectedArticle(a);
              setArticleTab("original");
              goTo("article");
            }}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        );

      case "article":
        return (
          <ArticleScreen
            article={selectedArticle}
            activeTab={articleTab}
            onTabChange={setArticleTab}
            onBack={goBack}
            onComplete={markTodayRead}
            onReadComplete={handleArticleReadComplete}
            onToggleClip={toggleClip}
            onOpenScrapbook={() =>
              openScrapForArticle(
                selectedArticle.headline,
                buildArticleScrapSeed(selectedArticle.headline, articleAnnotations[selectedArticle.id]?.highlights ?? [])
              )
            }
            initialHighlights={articleAnnotations[selectedArticle.id]?.highlights}
            initialStrokes={articleAnnotations[selectedArticle.id]?.strokes}
            onAnnotationsChange={(highlights, strokes) =>
              setArticleAnnotations((prev) => ({ ...prev, [selectedArticle.id]: { highlights, strokes } }))
            }
          />
        );

      case "mission":
        return (
          <MissionScreen
            acornCount={acornCount}
            articleMissionDone={articleMissionDone}
            onMenuOpen={() => setDrawerOpen(true)}
            onShopPress={() => goTo("shop")}
          />
        );

      case "shop":
        return (
          <ShopScreen
            acornCount={acornCount}
            onPurchase={(price) => setAcornCount((a) => a - price)}
            onBack={goBack}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        );

      case "mypage":
        return <MyPageScreen onMenuOpen={() => setDrawerOpen(true)} />;

      case "calendar":
        return (
          <CalendarScreen
            year={calYear}
            month={calMonth}
            reads={monthReads}
            todayDay={isCurrentMonth ? TODAY_DAY : null}
            onMenuOpen={() => setDrawerOpen(true)}
            onOpenPicker={() => setPickerOpen(true)}
            onDateClick={(d) => {
              setSelectedDay(d);
              goTo("reading-detail");
            }}
          />
        );

      case "reading-detail": {
        const dayIds = (isCurrentMonth ? readsByDate[selectedDay] : undefined) || [];
        const dayArticles = dayIds
          .map((id) => ALL_NEWS.find((a) => a.id === id))
          .filter(Boolean) as NewsItem[];
        return (
          <ReadingDetailScreen
            month={calMonth}
            day={selectedDay}
            articles={dayArticles}
            onBack={goBack}
            onCardClick={(a) => {
              setSelectedArticle(a);
              setArticleTab("original");
              goTo("article");
            }}
            onScrapClick={(a) => openScrapForArticle(a.headline)}
            onGoFeed={() => goTo("landing")}
          />
        );
      }

      case "scrap-library":
        return (
          <ScrapLibraryScreen
            items={savedScraps}
            onMenuOpen={() => setDrawerOpen(true)}
            onOpen={(id) => {
              const found = savedScraps.find((s) => s.id === id);
              currentScrapIdRef.current = id;
              currentScrapTitleRef.current = found?.title ?? "제목 없음";
              setScrapInitialDoc(found?.doc);
              setScrapNew(false);
              goTo("scrapbook");
            }}
            onNew={() => openNewScrap("제목 없음")}
            onShare={() => { setScrapSnapshot(null); goTo("scrap-share"); }}
          />
        );

      case "scrapbook":
        return (
          <ScrapbookScreen
            isNew={scrapNew}
            clippings={clippings}
            initialDoc={scrapInitialDoc}
            onBack={goBack}
            onShare={(doc) => { setScrapSnapshot(doc); goTo("scrap-share"); }}
            onAutoSave={handleScrapAutoSave}
          />
        );

      case "scrap-share":
        return <ScrapShareScreen doc={scrapSnapshot} title={currentScrapTitleRef.current} onBack={goBack} />;

      case "shared-scrap":
        return (
          <SharedScrapView
            doc={scrapSnapshot}
            onArticle={() => { setArticleTab("original"); goTo("article"); }}
            onFeed={() => goTo("landing")}
          />
        );
    }
  };

  return (
    <div
      className={`pt-app-shell h-full w-full overflow-hidden ${
        usesViewportScroller ? "pt-app-shell--locked" : "pt-app-shell--document"
      }`}
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <div
        className="pt-app-viewport relative h-full w-full overflow-hidden"
        style={{ backgroundColor: "var(--pt-bg-primary)" }}
      >
        <main className="pt-screen-host h-full w-full">{renderScreen()}</main>
        <PwaInstallControl visible={screen !== "start"} />
        {drawerOpen && (
          <NavigationDrawer
            currentScreen={screen}
            onClose={() => setDrawerOpen(false)}
            onNavigate={handleDrawerNavigate}
          />
        )}
        {pickerOpen && (
          <DatePickerSheet
            year={calYear}
            month={calMonth}
            onChangeMonth={(y, m) => {
              setCalYear(y);
              setCalMonth(m);
            }}
            onPickDay={(y, m, d) => {
              setCalYear(y);
              setCalMonth(m);
              setSelectedDay(d);
              setPickerOpen(false);
              goTo("reading-detail");
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
