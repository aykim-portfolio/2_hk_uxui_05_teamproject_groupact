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
import articlesData from "./articles.json";

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
type Category = string;

// ── Shared primitives ──

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
}: {
  onClick?: () => void;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <button
      onClick={onClick}
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
      className="relative flex gap-2 items-center justify-center rounded-3xl"
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
      <span className="title relative whitespace-nowrap" style={{ color: "var(--pt-text-primary)" }}>
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
    <GlassBtn onClick={onClick}>
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
}: {
  dropdownLabel?: string;
  showBack?: boolean;
  showDropdown?: boolean;
  showDropdownChevron?: boolean;
  showAvatar?: boolean;
  onDropdownClick?: () => void;
  onBackClick?: () => void;
  onMenuOpen?: () => void;
}) {
  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-between px-4 z-10"
      style={{
        top: 58,
        height: 52,
        filter: "drop-shadow(0px 2px 1px rgba(181,181,181,0.25))",
      }}
    >
      <GlassBtn onClick={showBack ? onBackClick : onMenuOpen}>
        {showBack ? <BackArrowIcon /> : <HamburgerIcon />}
      </GlassBtn>

      {showDropdown ? (
        <DropdownTab
          label={dropdownLabel}
          onClick={onDropdownClick}
          showChevron={showDropdownChevron}
        />
      ) : (
        <div style={{ width: 40 }} />
      )}

      {showAvatar ? <ToriAvatar /> : <div style={{ width: 40 }} />}
    </div>
  );
}

// ── Tab Slider ──
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

  return (
    <div className="px-5" style={{ paddingTop: 10, paddingBottom: 12 }}>
      <div className="relative flex justify-between mb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="caption"
            style={{
              color: active === t.id ? "var(--pt-brand-primary)" : "var(--pt-text-primary)",
              fontWeight: active === t.id ? 700 : 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex items-center px-1.5">
        {tabs.map((t, i) => (
          <div key={t.id} className="contents">
            <button
              onClick={() => onChange(t.id)}
              className="shrink-0 rounded-full transition-all duration-200"
              style={
                active === t.id
                  ? {
                      width: 20,
                      height: 20,
                      backgroundColor: "var(--pt-brand-primary)",
                      boxShadow: "0 0 0 6px var(--pt-brand-secondary)",
                    }
                  : {
                      width: 8,
                      height: 8,
                      backgroundColor: "var(--pt-brand-secondary)",
                    }
              }
            />
            {i < tabs.length - 1 && (
              <div
                className="flex-1 transition-colors duration-200"
                style={{
                  height: 2,
                  backgroundColor:
                    i < activeIdx ? "var(--pt-brand-primary)" : "var(--pt-brand-secondary)",
                }}
              />
            )}
          </div>
        ))}
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
function FAB({
  onPress,
  showToolbar,
  onCloseToolbar,
}: {
  onPress: () => void;
  showToolbar: boolean;
  onCloseToolbar: () => void;
}) {
  return (
    <>
      {showToolbar && <div className="absolute inset-0 z-20" onClick={onCloseToolbar} />}
      {showToolbar && (
        <div
          className="absolute flex items-center gap-2 rounded-full px-4 py-2 z-30"
          style={{
            bottom: 120,
            right: 20,
            backgroundColor: "rgba(255,255,255,0.95)",
            boxShadow:
              "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          {["✏️", "🖊️", "🧹", "✂️", "↩️", "🎨"].map((icon) => (
            <button key={icon} onClick={(e) => e.stopPropagation()}>
              <span className="text-xl leading-none">{icon}</span>
            </button>
          ))}
          <div className="w-px h-6 mx-1" style={{ backgroundColor: "var(--pt-border-default)" }} />
          <button onClick={(e) => e.stopPropagation()}>
            <BookmarkIcon />
          </button>
        </div>
      )}
      <button
        onClick={onPress}
        className="absolute z-30 flex items-center justify-center rounded-full"
        style={{
          bottom: 56,
          right: 20,
          width: 64,
          height: 64,
          boxShadow:
            "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)",
          backgroundImage:
            "linear-gradient(161.696deg, rgba(255,255,255,0.2) 31.933%, rgba(235,235,235,0.2) 144.03%)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 3px 4px 4px white, inset 0px 13px 12px rgba(255,255,255,0.2)" }}
        />
        <BookmarkIcon />
      </button>
    </>
  );
}

// ── Hero Card ──
function HeroCard({ article, onClick }: { article: NewsItem; onClick?: () => void }) {
  return (
    <div className="flex flex-col gap-5 px-5 w-full" style={{ paddingTop: 120, paddingBottom: 16 }}>
      {/* 헤드라인·썸네일·요약 클릭 시 기사 원문으로 이동 */}
      <button onClick={onClick} className="flex flex-col gap-5 w-full text-left">
        <div className="flex flex-col gap-2 items-start" style={{ paddingTop: 20 }}>
          <CategoryChip label={article.category} />
          <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
            {article.headline}
          </p>
        </div>
        <div
          className="relative rounded-xl overflow-hidden shrink-0 w-full"
          style={{ height: 181, marginBottom: 10 }}
        >
          <img
            src={article.image}
            alt=""
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
        2026.07.22 &nbsp;(수)
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

const ALL_NEWS: NewsItem[] = articlesData.articles
  .filter(a => a.category === 'Today')
  .map(a => ({
    id: a.id,
    category: a.category,
    headline: a.headline,
    image: a.imageUrl || "",
    byline: `${a.author} · ${a.date}`,
    summary: a.ai.summary
  }));

const INDUSTRY_NEWS: NewsItem[] = articlesData.articles
  .filter(a => a.category !== 'Today')
  .slice(0, 20)
  .map(a => ({
    id: a.id,
    category: a.category,
    headline: a.headline,
    image: a.imageUrl || "",
    byline: `${a.author} · ${a.date}`,
    summary: a.ai.summary
  }));

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
    category === "Today" ? ALL_NEWS : INDUSTRY_NEWS
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
    setItems(category === "Today" ? ALL_NEWS : INDUSTRY_NEWS);
  }, [category]);

  // 카드를 누르면 그 기사를 히어로로 끌어올리고, 기존 히어로는 그 카드 자리로 내려보냄
  const promoteToHero = (cardIdx: number) => {
    demotedIdxRef.current = cardIdx;
    setItems((prev) => {
      const next = [...prev];
      [next[0], next[cardIdx + 1]] = [next[cardIdx + 1], next[0]];
      return next;
    });
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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
      <div ref={scrollRef} className="h-full overflow-y-auto pb-24">
        <div ref={heroRef}>
          <HeroCard article={hero} onClick={() => onNewsClick(hero)} />
        </div>
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
        width: 208,
        height: 298,
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

// ── Category Screen ──
// 프레임 고정 크기(App()의 393×852 폰 목업)에 맞춰 스크롤 캐스케이드 스테이지 높이를 정함
const FRAME_HEIGHT = 852;

function CategoryScreen({
  onCategorySelect,
}: {
  onCategorySelect: (cat: Category) => void;
}) {
  const cards: { label: Category; subtitle: string; image: string }[] = CATEGORY_PAGE_DB.map(
    (row) => ({ label: row.title, subtitle: row.subtitle, image: row.imageUrl })
  );
  const N = cards.length;

  const containerRef = useRef<HTMLDivElement>(null); // Lenis wrapper / ScrollTrigger scroller
  const contentRef = useRef<HTMLDivElement>(null); // Lenis content / scroll-length spacer

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // 브라우저가 리로드 시 이전 스크롤 위치를 복원하는 경우가 있어, 항상 첫 카드(Today)부터 시작하도록 고정
    container.scrollTop = 0;

    gsap.registerPlugin(ScrollTrigger);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 세로 방향 고정 캐스케이드 상수(기존 디자인과 동일하게 좌우 이동 없음)
    const STEP_Y = 132;
    const PUSH = 46;
    const DISTANCE_PER_CARD = 220;
    const FADE_RANGE = Math.max(3, Math.min(N - 1, 6));
    const DIM_PER_STEP = 0.35; // 뒤에 가려진 카드일수록 투명도·명도를 낮추는 정도
    const INTRO_DROP = 380; // 진입 인트로에서 카드가 최종 위치까지 내려오는 거리

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
        end: () => "+=" + N * DISTANCE_PER_CARD,
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
  }, [N]);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{
        background:
          "linear-gradient(162.946deg, #ffffff 2.5%, var(--pt-bg-primary) 50%, #EFF1F5 103%)",
      }}
    >
      <div ref={containerRef} className="absolute inset-0 overflow-y-auto">
        <div ref={contentRef} style={{ height: FRAME_HEIGHT + N * 220 }}>
          <div className="relative" style={{ position: "sticky", top: 0, height: FRAME_HEIGHT }}>
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
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Original Tab Content ──
function OriginalContent({ article, onToggleClip }: { article: NewsItem; onToggleClip?: (text: string, on: boolean) => void }) {
  const paras = [
    // 첫 문단은 선택한 기사의 요약, 이후 문단은 원문 연동 전까지 공통 목업 텍스트
    article.summary,
    "한국경제 뉴스 랜딩페이지는 종이신문이 갖고 있던 정보 위계를 디지털 환경에서 재현하지 못했다. 무한 스크롤과 배너 광고는 정돈된 지면 몰입감을 지웠다.",
    "한경 페이퍼는 하루치 뉴스를 메인기사 1개와 스택형 카드로 편집해, 정보 위계가 살아있는 지면형 레이아웃을 되살린다. 광고는 지면처럼 약속된 위치에만 배치해 피로도를 낮춘다.",
  ];
  const [hl, setHl] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    const on = !hl.has(i);
    setHl((prev) => {
      const next = new Set(prev);
      on ? next.add(i) : next.delete(i);
      return next;
    });
    onToggleClip?.(paras[i], on); // 업데이터 밖에서 부모 상태 갱신 (setState-in-render 방지)
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
      <div className="relative rounded-xl overflow-hidden w-full" style={{ height: 181 }}>
        <img src={article.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div
        className="rounded-lg px-3 py-2 flex items-center gap-2"
        style={{ backgroundColor: "var(--pt-bg-accent-light)" }}
      >
        <span className="rounded-full" style={{ width: 14, height: 14, backgroundColor: "var(--pt-brand-secondary)" }} />
        <span className="caption" style={{ color: "var(--pt-text-dark-green)" }}>
          문장을 탭하면 형광펜으로 스크랩돼요 (클립보드에 저장)
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {paras.map((text, i) => (
          <p
            key={i}
            onClick={() => toggle(i)}
            className="body-2 cursor-pointer transition-colors"
            style={{
              color: "var(--pt-text-primary)",
              textIndent: 8,
              letterSpacing: "-0.32px",
              backgroundColor: hl.has(i) ? "rgba(230,249,151,0.85)" : "transparent",
              borderRadius: 4,
              boxDecorationBreak: "clone",
            }}
          >
            {text}
          </p>
        ))}
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

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((prev) => [
      ...prev,
      { from: "user", text: message },
      {
        from: "tori",
        text: "좋은 질문이야! 앤트로픽은 안전한 AI 개발에 집중하는 회사로, IPO를 통해 더 많은 연구 자금을 확보하려는 것으로 알려져 있어.",
      },
    ]);
    setMessage("");
  };

  const suggested = ["IPO가 뭐야?", "앤트로픽이 어떤 회사야?", "투자자 미팅은 왜 해?", "AI 기업 주가는?"];

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
          {[
            {
              label: "투자업계 시각",
              text: '투자업계는 "지면형 UX가 체류시간을 늘릴 것"이라 보는 반면, 일부 개발진은 "제스처 학습 비용"을 우려한다.',
            },
            {
              label: "소비자 시각",
              text: "구독자들은 광고 없는 깔끔한 뉴스 경험에 긍정적이며, 특히 40대 이상 독자층에서 호응이 높을 것으로 예상된다.",
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-3">
              <div
                className="relative flex items-center rounded-full self-start"
                style={{ padding: "4px 24px", backgroundColor: "var(--pt-chip-bg)" }}
              >
                <div className="absolute inset-[-3px] rounded-full pointer-events-none border-[3px] border-white" />
                <span className="label" style={{ color: "var(--pt-text-brand-strong)" }}>
                  {item.label}
                </span>
              </div>
              <p className="caption leading-5 opacity-80 px-1" style={{ color: "var(--pt-text-indigo)" }}>
                {item.text}
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
              className="caption flex-1 px-4 bg-transparent outline-none"
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
function EasyContent() {
  return (
    <div className="flex flex-col gap-5 px-5 py-4 w-full">
      <div
        className="rounded-xl flex items-start gap-4 px-4 py-2.5"
        style={{
          backgroundColor: "#FCFFF1",
          filter: "drop-shadow(2px 2px 4px var(--pt-shadow-card))",
        }}
      >
        <div className="flex flex-col gap-3 flex-1">
          <p className="label opacity-80 leading-5" style={{ color: "#354B0E" }}>
            어려운 경제뉴스, 토리가 읽기 쉽게 바꿨어요!
          </p>
        </div>
        <div className="-scale-x-100 shrink-0" style={{ width: 54, height: 54 }}>
          <img src={imgToriChat} alt="Tori" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="flex flex-col gap-2" style={{ minHeight: 144 }}>
        <CategoryChip label="산업" />
        <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
          앤트로픽, 10월 IPO 추진…투자자 미팅 돌입
        </p>
        <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>
          한경 산업부 기자 · 2026.07.20 09:12
        </p>
      </div>
      <div className="relative rounded-xl overflow-hidden w-full" style={{ height: 181 }}>
        <img src={imgArticle} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="flex flex-col gap-4">
        {[
          "앤트로픽이라는 AI 회사가 있어요. 이 회사는 주식시장에 상장하려고 해요. 상장이란 회사의 주식을 누구나 사고팔 수 있게 만드는 거예요.",
          "앤트로픽은 10월에 투자자들을 만나서 \"우리 회사에 투자해 주세요\"라고 설명할 예정이에요. 이런 만남을 '투자자 미팅'이라고 해요.",
          "상장에 성공하면 앤트로픽은 더 많은 돈을 모아서 더 좋은 AI를 만들 수 있어요. 마치 토리가 도토리를 많이 모으면 더 많은 것을 할 수 있는 것처럼요! 🌰",
        ].map((text, i) => (
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
  onToggleClip,
}: {
  article: NewsItem;
  activeTab: ArticleTab;
  onTabChange: (t: ArticleTab) => void;
  onBack: () => void;
  onComplete?: () => void;
  onToggleClip?: (text: string, on: boolean) => void;
}) {
  const [showToolbar, setShowToolbar] = useState(false);
  const completedRef = useRef(false);

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
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader showBack showDropdown={false} onBackClick={onBack} />
      <div className="h-full overflow-y-auto" style={{ paddingTop: 110, paddingBottom: 100 }} onScroll={handleScroll}>
        <TabSlider active={activeTab} onChange={onTabChange} />
        {activeTab === "original" && <OriginalContent article={article} onToggleClip={onToggleClip} />}
        {activeTab === "ai" && <AiContent article={article} />}
        {activeTab === "easy" && <EasyContent />}
      </div>
      <FAB
        onPress={() => setShowToolbar((v) => !v)}
        showToolbar={showToolbar}
        onCloseToolbar={() => setShowToolbar(false)}
      />
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
  onMenuOpen,
  onShopPress,
}: {
  onMenuOpen: () => void;
  onShopPress: () => void;
}) {
  const missions = [
    { label: "출석체크 하기", reward: 30, done: true },
    { label: "기사 3개 완독하기", reward: 10, done: false },
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

      <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingTop: 110, paddingBottom: 32 }}>
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
                0개
              </span>
            </div>
          </div>

          {/* Mission list */}
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--pt-bg-card)" }}>
            {missions.map((m, i) => (
              <div key={m.label}>
                {i > 0 && (
                  <div
                    className="mx-auto"
                    style={{ height: 1, width: 321, backgroundColor: "var(--pt-border-menu)" }}
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
  name: string;
  price: number;
  crop?: { x: number; y: number; w: number; h: number };
  img?: string;
};

const TAPE_ITEMS: ShopItem[] = [
  { name: "올리브 패턴 테이프", price: 100, crop: { x: 72, y: 81, w: 419, h: 127 } },
  { name: "베리 도트 테이프", price: 120, crop: { x: 521, y: 84, w: 419, h: 122 } },
  { name: "블루 체크 테이프", price: 100, crop: { x: 69, y: 262, w: 414, h: 123 } },
  { name: "코랄 퍼즐 테이프", price: 140, crop: { x: 521, y: 261, w: 424, h: 123 } },
  { name: "민트 버블 테이프", price: 110, crop: { x: 85, y: 419, w: 389, h: 144 } },
  { name: "머스터드 스트라이프 테이프", price: 130, crop: { x: 545, y: 438, w: 377, h: 126 } },
];

const STICKER_ITEMS: ShopItem[] = [
  { name: "방긋 토리", price: 80, img: imgSticker1 },
  { name: "안경 토리", price: 90, img: imgSticker2 },
  { name: "눈물 토리", price: 90, img: imgSticker3 },
  { name: "뾰루퉁 토리", price: 100, img: imgSticker4 },
  { name: "인사하는 토리", price: 150, img: imgToriDeco },
];

function ShopScreen({ onBack, onMenuOpen }: { onBack: () => void; onMenuOpen: () => void }) {
  const [activeTab, setActiveTab] = useState<ShopTab>("tape");
  const items = activeTab === "tape" ? TAPE_ITEMS : STICKER_ITEMS;

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

      <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingTop: 110, paddingBottom: 24 }}>
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
              0개
            </span>
          </div>
        </div>

        {/* Product grid — 3 columns */}
        <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-8 px-2 pt-2 pb-4">
          {items.map((item, i) => {
            const isTape = activeTab === "tape";
            // 잘라낸 영역을 그대로 카드 안에 채우도록 스케일 — 비율 유지라 늘어남/쏠림이 없음
            const scale = item.crop ? TAPE_WIDTH / item.crop.w : 1;
            return (
              <div
                key={`${activeTab}-${i}`}
                className="flex flex-col items-center isolate"
                style={{ width: 114, height: 165 }}
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
                <div
                  className="relative rounded-3xl w-full flex-1 flex flex-col overflow-hidden"
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
                </div>
              </div>
            );
          })}
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
        className="h-full overflow-y-auto no-scrollbar"
        style={{ paddingTop: 110, paddingBottom: 32 }}
      >
        {/* Hero — 출석 인사 + 토리 일러스트 */}
        <div
          className="flex items-center w-full"
          style={{ backgroundColor: "var(--pt-bg-accent-light)", padding: "32px 20px" }}
        >
          <div className="flex-1 flex items-center justify-between min-w-0">
            <div className="flex flex-col items-start" style={{ gap: 60, width: 214 }}>
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
              <div className="relative shrink-0" style={{ width: 122, height: 124 }}>
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
                    className="mx-auto"
                    style={{ height: 1, width: 321, backgroundColor: "var(--pt-border-default)" }}
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
const TODAY_DAY = 21; // 오늘 = 7월 21일
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

// ── Reading History Card ──
function ReadingHistoryCard({ onClick, onScrap }: { onClick?: () => void; onScrap?: () => void }) {
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
          <CategoryChip label="산업" />
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
          앤트로픽, 10월 IPO 추진…투자자 미팅 돌입
        </p>
        <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>
          2026.07.20 09:12
        </p>
      </div>
      <span className="caption self-end" style={{ color: "var(--pt-text-secondary)" }}>
        1시간 전
      </span>
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

      <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingTop: 110, paddingBottom: 24 }}>
        <div className="px-4 flex flex-col gap-6">
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
                if (d === null) return <div key={i} style={{ width: 40, height: 50 }} />;
                const count = reads[d] || 0;
                const lv = Math.min(count, 5);
                const isToday = d === todayDay;
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
                    onClick={() => onDateClick(d)}
                    className="rounded-xl flex items-center justify-center"
                    style={{ width: 40, height: 50, backgroundColor: bg, border }}
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
          <div className="flex items-end justify-between" style={{ height: 60, paddingTop: 4 }}>
            {MONTH_BAR_H.map((h, idx) => {
              const mm = idx + 1;
              const isCur = mm === month;
              return (
                <div key={mm} className="flex flex-col items-center gap-0.5">
                  {isCur && (
                    <span style={{ fontFamily: "var(--pt-font-body)", fontWeight: 700, fontSize: 9, color: "var(--pt-text-primary)" }}>
                      {readTotal}건
                    </span>
                  )}
                  <div
                    style={{
                      width: 20,
                      height: isCur ? 48 : h,
                      borderRadius: 4,
                      backgroundColor: isCur ? "var(--pt-brand-primary)" : "var(--pt-brand-secondary)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--pt-font-body)",
                      fontWeight: isCur ? 700 : 400,
                      fontSize: 9,
                      color: isCur ? "var(--pt-brand-primary)" : "var(--pt-text-secondary)",
                    }}
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
  count,
  onBack,
  onCardClick,
  onScrapClick,
  onGoFeed,
}: {
  month: number;
  day: number;
  count: number;
  onBack: () => void;
  onCardClick: () => void;
  onScrapClick: () => void;
  onGoFeed: () => void;
}) {
  const remaining = Math.max(0, READ_GOAL - count);

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader showBack showDropdown={false} showAvatar={false} onBackClick={onBack} />

      <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingTop: 110, paddingBottom: 32 }}>
        {/* Date header */}
        <div className="flex flex-col items-center" style={{ padding: "16px 20px" }}>
          <p style={{ fontFamily: "var(--pt-font-title)", fontWeight: 700, fontSize: 20, color: "var(--pt-text-secondary)" }}>
            {month}월 {day}일
          </p>
        </div>

        {count === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-8 px-4" style={{ minHeight: 560 }}>
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative" style={{ width: 187, height: 177 }}>
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
              {Array.from({ length: count }).map((_, i) => (
                <ReadingHistoryCard key={i} onClick={onCardClick} onScrap={onScrapClick} />
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
        className="absolute inset-0 z-40"
        style={{ backgroundColor: "var(--pt-overlay-medium)" }}
        onClick={onClose}
      />
      <div
        className="absolute left-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          backgroundColor: "var(--pt-bg-primary)",
          borderRadius: "36px 36px 0 0",
          padding: "12px 20px 28px",
          maxHeight: "82%",
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
        <div className="overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: total }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => onPickDay(y, m, d)}
                className="rounded-lg flex items-center justify-center"
                style={{ height: 40, backgroundColor: "var(--pt-bg-card)" }}
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
const SCRAP_ITEMS = [
  { id: 1, title: "앤트로픽, 10월 IPO 추진…투자자 미팅 돌입", date: "2026.07.20" },
  { id: 2, title: "삼성전자, HBM4 양산 속도 낸다", date: "2026.07.18" },
  { id: 3, title: "코스피 3,200선 돌파, 외국인 순매수", date: "2026.07.15" },
  { id: 4, title: "서울 아파트 매매가 8주 연속 상승", date: "2026.07.12" },
  { id: 5, title: "한국은행 기준금리 연 3.0% 동결", date: "2026.07.10" },
];

function ScrapLibraryScreen({
  onMenuOpen,
  onOpen,
  onNew,
  onShare,
}: {
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

      <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingTop: 110, paddingBottom: 24 }}>
        <div className="flex flex-col items-center" style={{ padding: "16px 20px" }}>
          <p style={{ fontFamily: "var(--pt-font-title)", fontWeight: 700, fontSize: 20, color: "var(--pt-text-secondary)" }}>7월 20일</p>
        </div>

        <div className="flex flex-wrap gap-2 px-4">
          {SCRAP_ITEMS.map((it) => (
            <button
              key={it.id}
              onClick={() => onOpen(it.id)}
              className="bg-white rounded-xl border flex flex-col items-end text-left"
              style={{ width: 114, padding: "20px 12px", borderColor: "var(--pt-border-default)", filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.06))", gap: 10 }}
            >
              <div className="flex flex-col items-center gap-8 w-full">
                <p className="subtitle overflow-hidden w-full" style={{ color: "var(--pt-text-primary)", height: 75, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                  {it.title}
                </p>
                <p className="caption w-full text-right" style={{ color: "var(--pt-text-secondary)" }}>{it.date}</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); toggleLike(it.id); }} className="flex items-center cursor-pointer">
                  <HeartIcon filled={liked.has(it.id)} />
                </span>
                <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); onShare(it.id); }} className="flex items-center cursor-pointer">
                  <ShareIcon />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAB → 새 스크랩북 */}
      <button
        onClick={onNew}
        className="absolute z-30 flex items-center justify-center rounded-full"
        style={{ bottom: 68, right: 27, width: 60, height: 60, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)" }}
      >
        <ScrapIcon color="var(--pt-brand-primary)" />
      </button>

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
const scrapUid = () => Math.random().toString(36).slice(2, 9);
const PEN_COLORS = ["#1a2535", "#6083f5", "#496de0", "#e6f997", "#ff6b6b", "#ffa94d", "#51cf66", "#845ef7"];
const STICKERS = [imgSticker1, imgSticker2, imgSticker3, imgSticker4, imgToriDeco];
const ERASE_R = 18;
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

function ScrapbookScreen({ isNew, clippings, onBack, onShare }: { isNew: boolean; clippings: string[]; onBack: () => void; onShare: (doc: ScrapDoc) => void }) {
  const [tool, setTool] = useState<PenTool | "none">("none");
  const [penColor, setPenColor] = useState("#6083f5");
  const [hlColor, setHlColor] = useState("#e6f997");
  const [penWidth, setPenWidth] = useState(4);
  const [textColor, setTextColor] = useState("#1a2535");
  const [text, setText] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [eraserMode, setEraserMode] = useState<EraserMode>("stroke");
  const [bg, setBg] = useState<ScrapBg>(isNew ? "none" : "paper");
  const [bgOpen, setBgOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [strokes, setStrokes] = useState<ScrapStroke[]>([]);
  const [elements, setElements] = useState<ScrapEl[]>(
    isNew
      ? []
      : [
          { id: scrapUid(), kind: "note", x: 24, y: 16, text: "부동산 공급 대책", bg: "var(--pt-brand-primary)", color: "#ecf0f9" },
          { id: scrapUid(), kind: "note", x: 60, y: 240, text: "일정한 선의 사회적 합의 필요", bg: "var(--pt-brand-secondary)", color: "#1a1a1a" },
          { id: scrapUid(), kind: "note", x: 40, y: 360, text: "전세가율 반등, 실수요 유입 신호", bg: "var(--pt-brand-primary)", color: "#ecf0f9" },
          { id: scrapUid(), kind: "sticker", x: 250, y: 300, src: imgToriDeco, size: 96 },
        ]
  );
  const [history, setHistory] = useState<ScrapAction[]>([]);
  const [, force] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<ScrapStroke | null>(null);
  const dragRef = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const erasingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDraw = tool === "pencil" || tool === "highlighter";
  const activeColor = tool === "highlighter" ? hlColor : penColor;
  const selectedEl = elements.find((el) => el.id === selectedId) || null;

  // 키보드 도구 선택 시 입력창 포커스 → 모바일 키보드 올라옴
  useEffect(() => {
    if (tool === "keyboard") {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [tool]);

  const pt = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
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
  const resizeSel = (d: number) => setElements((v) => v.map((el) => (el.id === selectedId && el.kind === "sticker" ? { ...el, size: Math.max(32, Math.min(220, (el.size || 72) + d)) } : el)));
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
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: "var(--pt-bg-primary)" }}>
      {/* Header */}
      <div className="absolute left-0 right-0 flex items-center justify-between px-4 z-30" style={{ top: 58, height: 52 }}>
        <GlassBtn onClick={onBack}><BackArrowIcon /></GlassBtn>
        <div className="flex gap-2">
          <button onClick={() => setBgOpen((v) => !v)} className="flex items-center justify-center rounded-full px-3" style={{ height: 40, backgroundColor: bgOpen ? "var(--pt-brand-secondary)" : "var(--pt-bg-surface)", boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)" }}>
            <span className="label" style={{ color: "var(--pt-brand-primary)", fontSize: 12 }}>배경</span>
          </button>
          <button onClick={() => onShare({ elements, strokes, bg })} className="flex items-center justify-center rounded-full px-4" style={{ height: 40, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)" }}>
            <ShareIcon color="var(--pt-brand-primary)" />
          </button>
          <button onClick={onBack} className="flex items-center justify-center rounded-full px-4" style={{ height: 40, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)" }}>
            <span className="label" style={{ color: "var(--pt-brand-primary)" }}>저장</span>
          </button>
        </div>
      </div>

      {/* Background picker */}
      {bgOpen && (
        <div className="absolute right-4 z-40 rounded-2xl p-2 flex gap-2" style={{ top: 116, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 4px 16px rgba(0,0,0,0.15)" }}>
          {BG_OPTIONS.map((o) => (
            <button key={o.id} onClick={() => { setBg(o.id); setBgOpen(false); }} className="rounded-lg flex items-center justify-center overflow-hidden" style={{ width: 44, height: 44, border: bg === o.id ? "2px solid var(--pt-brand-primary)" : "1px solid var(--pt-border-default)", ...(o.id === "paper" ? {} : scrapBgStyle(o.id)) }}>
              {o.id === "paper" ? <img src={imgBgPaper} alt="원본" className="w-full h-full object-cover" /> : <span className="caption" style={{ fontSize: 9, color: "var(--pt-text-secondary)" }}>{o.label}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 overflow-hidden"
        style={{ top: 110, touchAction: isDraw || tool === "eraser" ? "none" : "auto" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {/* background layer */}
        <div className="absolute inset-0 pointer-events-none" style={scrapBgStyle(bg)} />
        {bg === "paper" && <img src={imgBgPaper} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.4 }} />}

        {/* strokes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
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
            style={{ left: el.x, top: el.y, touchAction: "none", cursor: tool === "none" ? "grab" : tool === "eraser" ? "pointer" : "default", outline: selectedId === el.id ? "2px dashed var(--pt-brand-primary)" : "none", outlineOffset: 2, borderRadius: 6 }}
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="body-2" style={{ color: "var(--pt-text-secondary)" }}>아래 도구로 나만의 스크랩북을 꾸며보세요</p>
          </div>
        )}
      </div>

      {/* Selected sticker control (크기 조절) */}
      {selectedEl && selectedEl.kind === "sticker" && tool === "none" && (
        <div className="absolute left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full px-3 py-2" style={{ bottom: 108, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 4px 16px rgba(0,0,0,0.18)" }}>
          <span className="caption" style={{ color: "var(--pt-text-secondary)" }}>크기</span>
          <button onClick={() => resizeSel(-16)} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: "var(--pt-bg-card)" }}><span style={{ fontSize: 18, color: "var(--pt-text-primary)", lineHeight: 1 }}>−</span></button>
          <span className="caption" style={{ color: "var(--pt-text-primary)", width: 34, textAlign: "center" }}>{selectedEl.size}px</span>
          <button onClick={() => resizeSel(16)} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, backgroundColor: "var(--pt-bg-card)" }}><span style={{ fontSize: 18, color: "var(--pt-text-primary)", lineHeight: 1 }}>+</span></button>
          <div className="w-px h-5" style={{ backgroundColor: "var(--pt-border-default)" }} />
          <button onClick={deleteSel} className="rounded-full px-3 flex items-center" style={{ height: 28, backgroundColor: "var(--pt-bg-card)" }}><span className="caption" style={{ color: "#ff6b6b" }}>삭제</span></button>
        </div>
      )}

      {/* Picker (내 색상 팔레트) */}
      {isDraw && pickerOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 z-40 rounded-3xl p-3 flex flex-wrap gap-2 justify-center" style={{ bottom: 168, width: 260, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 4px 16px rgba(0,0,0,0.15)" }}>
          {PEN_COLORS.map((c) => (
            <button key={c} onClick={() => { tool === "highlighter" ? setHlColor(c) : setPenColor(c); setPickerOpen(false); }} className="rounded-full" style={{ width: 32, height: 32, backgroundColor: c, border: activeColor === c ? "2px solid var(--pt-text-primary)" : "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          ))}
        </div>
      )}
      {/* Pen detail (형광펜/펜 선택 시) */}
      {isDraw && (
        <div className="absolute left-1/2 -translate-x-1/2 z-40 rounded-full px-4 py-2 flex items-center gap-3" style={{ bottom: 110, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 4px 16px rgba(0,0,0,0.15)" }}>
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
        <div className="absolute left-1/2 -translate-x-1/2 z-40 rounded-full px-2 py-2 flex items-center gap-1.5" style={{ bottom: 110, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 4px 16px rgba(0,0,0,0.15)" }}>
          {([["stroke", "펜 지우기"], ["area", "닿는 곳"], ["all", "전체 지우기"]] as [EraserMode, string][]).map(([m, label]) => (
            <button key={m} onClick={() => (m === "all" ? eraseAll() : setEraserMode(m))} className="rounded-full px-3 py-1.5 caption" style={{ backgroundColor: m !== "all" && eraserMode === m ? "var(--pt-brand-primary)" : "var(--pt-bg-card)", color: m === "all" ? "#ff6b6b" : eraserMode === m ? "#fff" : "var(--pt-text-secondary)" }}>
              {label}
            </button>
          ))}
        </div>
      )}
      {/* Text compose (키보드 선택 시) — 실제 모바일 키보드가 올라옴 */}
      {tool === "keyboard" && (
        <div className="absolute left-0 right-0 bottom-0 z-40" style={{ backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px -4px 16px rgba(0,0,0,0.12)" }}>
          <div className="flex items-center gap-2 px-4 pt-2">
            {["#1a2535", "#6083f5", "#ff6b6b", "#51cf66"].map((c) => (
              <button key={c} onClick={() => setTextColor(c)} className="rounded-full" style={{ width: 22, height: 22, backgroundColor: c, border: textColor === c ? "2px solid var(--pt-text-primary)" : "2px solid #fff" }} />
            ))}
            <span className="caption ml-auto" style={{ color: "var(--pt-text-secondary)" }}>텍스트 서식</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-3">
            <input
              ref={inputRef}
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addText()}
              placeholder="메모를 입력하세요"
              className="flex-1 rounded-full px-4 bg-white outline-none caption"
              style={{ height: 40, border: "1.4px solid var(--pt-border-default)", color: "var(--pt-text-primary)" }}
            />
            <button onClick={addText} className="rounded-full px-4 flex items-center shrink-0" style={{ height: 40, backgroundColor: "var(--pt-brand-primary)" }}>
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
        <div className="absolute left-1/2 -translate-x-1/2 z-40 flex items-center gap-5 rounded-full px-4 py-3 border border-white" style={{ bottom: 40, backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", boxShadow: "0px 0px 0.3px rgba(219,219,219,0.25), 4px 4px 16px rgba(0,0,0,0.12)" }}>
          {(["keyboard", "highlighter", "pencil", "eraser", "clipboard", "scissors", "undo"] as PenTool[]).map((t) => (
            <button key={t} onClick={() => selectTool(t)} className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, backgroundColor: tool === t ? "var(--pt-brand-secondary)" : "transparent" }}>
              <PenToolIcon name={t} color={tool === t ? "var(--pt-brand-primary)" : "var(--pt-text-primary)"} />
            </button>
          ))}
        </div>
      )}

      <div aria-hidden className="absolute inset-0 pointer-events-none border-4" style={{ borderColor: "rgba(0,0,0,0.06)" }} />
    </div>
  );
}

function ClipboardSheet({ clippings, onPick, onPickText, onClose }: { clippings: string[]; onPick: (src: string) => void; onPickText: (t: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState<"clip" | "sticker" | "tape">("clip");
  const tabs: [typeof tab, string][] = [["clip", "클리핑"], ["sticker", "스티커"], ["tape", "테이프"]];
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-40 rounded-xl border border-white overflow-hidden" style={{ bottom: 110, width: 335, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 4px 16px rgba(0,0,0,0.15)" }}>
      <div className="flex">
        {tabs.map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-3.5 caption" style={{ backgroundColor: tab === t ? "var(--pt-bg-accent-light)" : "transparent", borderBottom: tab === t ? "1px solid var(--pt-brand-primary)" : "1px solid var(--pt-border-strong)", color: tab === t ? "var(--pt-text-primary)" : "var(--pt-text-secondary)" }}>
            {label}
          </button>
        ))}
      </div>
      {tab === "clip" ? (
        <div className="flex flex-col gap-2 p-4 max-h-[220px] overflow-y-auto no-scrollbar">
          {clippings.length === 0 ? (
            <p className="caption text-center py-6" style={{ color: "var(--pt-text-secondary)" }}>원문에서 형광펜으로 문장을 스크랩하면 여기에 담겨요</p>
          ) : (
            clippings.map((c, i) => (
              <button key={i} onClick={() => onPickText(c)} className="text-left rounded-lg px-3 py-2.5" style={{ backgroundColor: "var(--pt-bg-accent-light)", border: "1px solid var(--pt-border-accent)" }}>
                <span className="caption" style={{ color: "var(--pt-text-primary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c}</span>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5 p-4">
          {(tab === "sticker" ? STICKERS : [imgTape, imgTape, imgTape]).map((src, i) => (
            <button key={i} onClick={() => onPick(src)} className="rounded-lg overflow-hidden" style={{ width: 64, height: 64, backgroundColor: "var(--pt-bg-primary)" }}>
              <img src={src} alt="스티커" className="w-full h-full object-contain pointer-events-none" />
            </button>
          ))}
        </div>
      )}
      <button onClick={onClose} className="w-full py-2 caption" style={{ color: "var(--pt-text-secondary)" }}>닫기</button>
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

function ScrapPreview({ doc, scale }: { doc: ScrapDoc; scale: number }) {
  const W = 393, H = 742;
  return (
    <div style={{ width: W * scale, height: H * scale, overflow: "hidden", position: "relative" }}>
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative", ...scrapBgStyle(doc.bg) }}>
        {doc.bg === "paper" && <img src={imgBgPaper} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.4 }} />}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
          {doc.strokes.map((s) => (
            <polyline key={s.id} points={s.pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={s.color} strokeWidth={s.width} strokeLinecap="round" strokeLinejoin="round" opacity={s.tool === "highlighter" ? 0.4 : 1} />
          ))}
        </svg>
        {doc.elements.map((el) =>
          el.kind === "sticker" ? (
            <img key={el.id} src={el.src} alt="" className="absolute" style={{ left: el.x, top: el.y, width: el.size, height: el.size, objectFit: "contain" }} />
          ) : (
            <div key={el.id} className="absolute rounded-3xl" style={{ left: el.x, top: el.y, maxWidth: 240, padding: "10px 12px", backgroundColor: el.kind === "note" ? el.bg : "var(--pt-bg-surface)", border: el.kind === "text" ? "1px dashed var(--pt-border-strong)" : "none", boxShadow: "0px 2px 2px rgba(0,0,0,0.06)" }}>
              <p style={{ fontFamily: "var(--pt-font-title)", fontWeight: 600, fontSize: 12, lineHeight: "18px", color: el.color || "#1a1a1a", whiteSpace: "pre-wrap" }}>{el.text}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ScrapShareScreen({ doc, onBack }: { doc: ScrapDoc | null; onBack: () => void }) {
  const d = doc && (doc.elements.length || doc.strokes.length) ? doc : SAMPLE_DOC;
  const [toast, setToast] = useState("");
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(""), 1800); };

  // 공유 딥링크 — 이 링크를 누르면 앱의 '공유 스크랩 뷰'로 돌아와 순환됨
  const [shareId] = useState(() => Math.random().toString(36).slice(2, 8));
  const shareUrl = `${window.location.origin}${window.location.pathname}#/s/${shareId}`;
  const shareText = "페이퍼토리에서 내 경제공부 스크랩을 공유했어요 #직장인공부 #공스타그램 #페이퍼토리";

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); showToast("링크를 복사했어요"); }
    catch { showToast(shareUrl); }
  };
  const openShare = (intentUrl: string, name: string) => {
    const w = window.open(intentUrl, "_blank", "noopener");
    if (!w) { navigator.clipboard?.writeText(shareUrl).catch(() => {}); showToast(`${name} 공유 링크를 복사했어요`); }
    else showToast(`${name}(으)로 공유해요`);
  };

  const loadImg = (src: string) => new Promise<HTMLImageElement | null>((res) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  const wrapText = (ctx: CanvasRenderingContext2D, t: string, maxW: number) => {
    const words = t.split(""); const lines: string[] = []; let cur = "";
    for (const ch of words) { if (ctx.measureText(cur + ch).width > maxW && cur) { lines.push(cur); cur = ch; } else cur += ch; }
    if (cur) lines.push(cur); return lines;
  };
  const saveImage = async () => {
    const W = 393, H = 742, S = 2;
    const cv = document.createElement("canvas"); cv.width = W * S; cv.height = H * S;
    const ctx = cv.getContext("2d"); if (!ctx) return; ctx.scale(S, S);
    ctx.fillStyle = d.bg === "lime" ? "#F5FCE0" : d.bg === "blue" ? "#edf0fd" : "#f8f9fb"; ctx.fillRect(0, 0, W, H);
    if (d.bg === "grid") { ctx.strokeStyle = "#e2e5eb"; ctx.lineWidth = 1; for (let x = 0; x < W; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
    if (d.bg === "paper") { const bp = await loadImg(imgBgPaper); if (bp) { ctx.globalAlpha = 0.4; ctx.drawImage(bp, 0, 0, W, H); ctx.globalAlpha = 1; } }
    for (const s of d.strokes) { ctx.strokeStyle = s.color; ctx.lineWidth = s.width; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.globalAlpha = s.tool === "highlighter" ? 0.4 : 1; ctx.beginPath(); s.pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke(); ctx.globalAlpha = 1; }
    for (const el of d.elements) {
      if (el.kind === "sticker") { const im = await loadImg(el.src!); if (im) ctx.drawImage(im, el.x, el.y, el.size!, el.size!); }
      else {
        ctx.font = "600 12px sans-serif"; const pad = 12, maxW = 200;
        const lines = wrapText(ctx, el.text || "", maxW - pad * 2);
        const wBox = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width)) + pad * 2);
        const hBox = lines.length * 18 + pad * 2 - 4;
        ctx.fillStyle = el.kind === "note" ? bgHex(el.bg) : "#ffffff";
        const r = 14, x = el.x, y = el.y; ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + wBox, y, x + wBox, y + hBox, r); ctx.arcTo(x + wBox, y + hBox, x, y + hBox, r); ctx.arcTo(x, y + hBox, x, y, r); ctx.arcTo(x, y, x + wBox, y, r); ctx.fill();
        ctx.fillStyle = el.color || "#1a1a1a"; lines.forEach((l, i) => ctx.fillText(l, x + pad, y + pad + 12 + i * 18));
      }
    }
    // 딥링크 URL을 이미지 하단에 찍어, 이미지를 본 사람도 앱으로 돌아올 수 있게 함
    ctx.globalAlpha = 0.9; ctx.fillStyle = "#6083f5"; ctx.font = "600 12px sans-serif";
    ctx.fillText("📌 " + shareUrl.replace(/^https?:\/\//, ""), 16, H - 20); ctx.globalAlpha = 1;
    cv.toBlob((b) => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "papertory-scrap.png"; a.click(); URL.revokeObjectURL(a.href); showToast("이미지를 저장했어요"); });
  };

  const targets = [
    { label: "카카오", bg: "#FEE500", fg: "#3C1E1E", onClick: () => { navigator.clipboard?.writeText(shareUrl).catch(() => {}); showToast("카카오 공유 링크를 복사했어요"); } },
    { label: "X", bg: "#000000", fg: "#ffffff", onClick: () => openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "X") },
    { label: "스레드", bg: "#101010", fg: "#ffffff", onClick: () => openShare(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "스레드") },
    { label: "링크복사", bg: "var(--pt-bg-card)", fg: "var(--pt-text-primary)", onClick: copyLink },
    { label: "이미지저장", bg: "var(--pt-bg-card)", fg: "var(--pt-text-primary)", onClick: saveImage },
  ];

  return (
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: "var(--pt-bg-primary)" }}>
      <div className="absolute left-0 right-0 flex items-center px-4 z-10" style={{ top: 58, height: 52 }}>
        <GlassBtn onClick={onBack}><BackArrowIcon /></GlassBtn>
        <p className="title flex-1 text-center pr-10" style={{ color: "var(--pt-text-primary)" }}>공유하기</p>
      </div>

      <div className="h-full overflow-y-auto no-scrollbar flex flex-col items-center" style={{ paddingTop: 124, paddingBottom: 32 }}>
        {/* Share template card — 실제 스크랩 내용 */}
        <div className="rounded-[24px] overflow-hidden" style={{ width: 300, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 8px 24px rgba(26,37,53,0.18)" }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "var(--pt-brand-primary)" }}>
            <div style={{ width: 26, height: 26 }}><img src={imgToriDeco} alt="Tori" className="w-full h-full object-contain" /></div>
            <span className="label" style={{ color: "#fff" }}>페이퍼토리</span>
            <span className="caption ml-auto" style={{ color: "#dfe7ff" }}>나의 스크랩</span>
          </div>
          <div style={{ height: 300, overflow: "hidden", backgroundColor: "var(--pt-bg-primary)" }}>
            <ScrapPreview doc={d} scale={300 / 393} />
          </div>
          <div className="px-4 py-3 flex flex-col gap-1">
            <p className="subtitle" style={{ color: "var(--pt-text-primary)" }}>앤트로픽, 10월 IPO 추진</p>
            <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>2026.07.20 · 나의 경제공부 기록</p>
            <p className="caption" style={{ color: "var(--pt-brand-primary)" }}>#직장인공부 #공스타그램 #페이퍼토리</p>
            <p className="caption" style={{ color: "var(--pt-text-secondary)", fontSize: 10, marginTop: 2 }}>🔗 {shareUrl.replace(/^https?:\/\//, "")}</p>
          </div>
        </div>

        {/* Share targets */}
        <div className="flex gap-2.5 mt-8">
          {targets.map((t) => (
            <button key={t.label} onClick={t.onClick} className="flex flex-col items-center gap-1.5">
              <span className="rounded-full flex items-center justify-center" style={{ width: 48, height: 48, backgroundColor: t.bg }}>
                <span className="caption" style={{ color: t.fg, fontSize: 10 }}>{t.label}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="caption mt-4 px-8 text-center" style={{ color: "var(--pt-text-secondary)" }}>
          링크를 받은 사람이 누르면 이 스크랩으로 돌아와요 🔁
        </p>
      </div>

      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-2" style={{ bottom: 40, backgroundColor: "rgba(26,37,53,0.9)", maxWidth: 320 }}>
          <span className="caption" style={{ color: "#fff" }}>{toast}</span>
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
      <div className="absolute left-0 right-0 z-10 flex items-center gap-2 px-5" style={{ top: 58, height: 52 }}>
        <div style={{ width: 28, height: 28 }}><img src={imgToriDeco} alt="Tori" className="w-full h-full object-contain" /></div>
        <span className="label" style={{ color: "var(--pt-text-primary)" }}>송토리님이 공유한 스크랩</span>
      </div>

      <div className="h-full overflow-y-auto no-scrollbar flex flex-col items-center" style={{ paddingTop: 122, paddingBottom: 32 }}>
        <div className="rounded-[24px] overflow-hidden" style={{ width: 300, backgroundColor: "var(--pt-bg-surface)", boxShadow: "0px 8px 24px rgba(26,37,53,0.18)" }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "var(--pt-brand-primary)" }}>
            <div style={{ width: 26, height: 26 }}><img src={imgToriDeco} alt="Tori" className="w-full h-full object-contain" /></div>
            <span className="label" style={{ color: "#fff" }}>페이퍼토리</span>
            <span className="caption ml-auto" style={{ color: "#dfe7ff" }}>공유된 스크랩</span>
          </div>
          <div style={{ height: 300, overflow: "hidden", backgroundColor: "var(--pt-bg-primary)" }}>
            <ScrapPreview doc={d} scale={300 / 393} />
          </div>
          <div className="px-4 py-3 flex flex-col gap-1">
            <p className="subtitle" style={{ color: "var(--pt-text-primary)" }}>앤트로픽, 10월 IPO 추진</p>
            <p className="caption" style={{ color: "var(--pt-text-secondary)" }}>2026.07.20 · 송토리님의 경제공부 기록</p>
            <p className="caption" style={{ color: "var(--pt-brand-primary)" }}>#직장인공부 #공스타그램 #페이퍼토리</p>
          </div>
        </div>

        {/* Circulation CTAs */}
        <div className="flex flex-col gap-3 mt-8 w-full px-8">
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
  onClose,
  onNavigate,
}: {
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
        className="absolute inset-0 z-40"
        style={{ backgroundColor: "var(--pt-overlay-medium)" }}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div
        className="absolute top-0 left-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: 312,
          backgroundColor: "var(--pt-bg-primary)",
          borderRadius: "36px 12px 12px 36px",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-7 pt-14 pb-4">
          <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
            전체 메뉴
          </p>
          <button onClick={onClose} className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
            <CloseIcon />
          </button>
        </div>

        {/* Menu sections */}
        <div className="flex-1 overflow-y-auto px-5 no-scrollbar">
          <div className="rounded-3xl overflow-hidden pt-2" style={{ backgroundColor: "var(--pt-chip-bg)" }}>
            {menu.map((entry) =>
              entry.type === "flat" ? (
                <button
                  key={entry.label}
                  className="w-full text-left flex items-center px-5 py-3.5"
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
                  {entry.items.map((item) => (
                    <button
                      key={item.label}
                      className="w-full text-left flex items-center h-[50px] border-b"
                      style={{ paddingLeft: 32, paddingRight: 32, borderColor: "var(--pt-border-menu)" }}
                      onClick={() => item.screen && onNavigate(item.screen)}
                    >
                      <span className="caption" style={{ color: "var(--pt-text-secondary)", fontSize: 15 }}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="-scale-x-100 shrink-0" style={{ width: 94, height: 93 }}>
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
  const [prevScreen, setPrevScreen] = useState<Screen>("landing");
  const [articleTab, setArticleTab] = useState<ArticleTab>("original");
  const [category, setCategory] = useState<Category>("Today");
  const [drawerOpen, setDrawerOpen] = useState(false);
  // 원문 뷰어에 넘길 기사 — 지면(히어로)에서 선택한 기사가 그대로 이어짐
  const [selectedArticle, setSelectedArticle] = useState<NewsItem>(ALL_NEWS[0]);

  // 읽기 기록(완독) 상태 — 메인 피드 완독 시 오늘 카운트 +1 되어 달력에 반영
  const [readsByDate, setReadsByDate] = useState<Record<number, number>>({ ...JULY_READS });
  const [selectedDay, setSelectedDay] = useState<number>(TODAY_DAY);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(7);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [scrapNew, setScrapNew] = useState(false);
  const [clippings, setClippings] = useState<string[]>([]);
  const [scrapSnapshot, setScrapSnapshot] = useState<ScrapDoc | null>(null);
  const toggleClip = (t: string, on: boolean) =>
    setClippings((prev) => (on ? (prev.includes(t) ? prev : [...prev, t]) : prev.filter((x) => x !== t)));

  // 딥링크 진입: 공유 링크(#/s/{id})로 들어오면 스플래시를 건너뛰고 '공유 스크랩 뷰'로 순환 진입
  useEffect(() => {
    if (/^#\/s\//.test(window.location.hash)) setScreen("shared-scrap");
  }, []);

  const isJuly = calYear === 2026 && calMonth === 7;
  const monthReads: Record<number, number> = isJuly ? readsByDate : {};
  const markTodayRead = () =>
    setReadsByDate((prev) => ({ ...prev, [TODAY_DAY]: (prev[TODAY_DAY] || 0) + 1 }));

  const goTo = (s: Screen) => {
    setPrevScreen(screen);
    setScreen(s);
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
            onBack={() => goTo(prevScreen)}
            onComplete={markTodayRead}
            onToggleClip={toggleClip}
          />
        );

      case "mission":
        return (
          <MissionScreen
            onMenuOpen={() => setDrawerOpen(true)}
            onShopPress={() => goTo("shop")}
          />
        );

      case "shop":
        return (
          <ShopScreen
            onBack={() => goTo(prevScreen)}
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
            todayDay={isJuly ? TODAY_DAY : null}
            onMenuOpen={() => setDrawerOpen(true)}
            onOpenPicker={() => setPickerOpen(true)}
            onDateClick={(d) => {
              setSelectedDay(d);
              goTo("reading-detail");
            }}
          />
        );

      case "reading-detail":
        return (
          <ReadingDetailScreen
            month={calMonth}
            day={selectedDay}
            count={monthReads[selectedDay] || 0}
            onBack={() => goTo("calendar")}
            onCardClick={() => {
              setArticleTab("original");
              goTo("article");
            }}
            onScrapClick={() => {}}
            onGoFeed={() => goTo("landing")}
          />
        );

      case "scrap-library":
        return (
          <ScrapLibraryScreen
            onMenuOpen={() => setDrawerOpen(true)}
            onOpen={() => { setScrapNew(false); goTo("scrapbook"); }}
            onNew={() => { setScrapNew(true); goTo("scrapbook"); }}
            onShare={() => { setScrapSnapshot(null); goTo("scrap-share"); }}
          />
        );

      case "scrapbook":
        return (
          <ScrapbookScreen
            isNew={scrapNew}
            clippings={clippings}
            onBack={() => goTo("scrap-library")}
            onShare={(doc) => { setScrapSnapshot(doc); goTo("scrap-share"); }}
          />
        );

      case "scrap-share":
        return <ScrapShareScreen doc={scrapSnapshot} onBack={() => goTo(prevScreen)} />;

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
      className="min-h-dvh flex items-center justify-center"
      style={{ backgroundColor: "#D8DCE8" }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          // 393×852은 iPhone 14 Pro 목업 기준 크기. 뷰포트가 더 작은 기기(안드로이드 등)에서
          // 하단이 잘리지 않도록 뷰포트를 넘지 않는 선에서만 그 크기를 씀.
          width: "min(393px, 100vw)",
          height: "min(852px, 100dvh)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      >
        {renderScreen()}
        {drawerOpen && (
          <NavigationDrawer
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
