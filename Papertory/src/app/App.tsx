// MARKER-MAKE-KIT-INVOKED
// MARKER-MAKE-KIT-DISCOVERY-READ
// MARKER-MAKE-KIT-TOKENS-READ
import { useState, useEffect } from "react";
import StartScreenImport from "@/imports/Start/index";
import imgArticle from "@/imports/Landing/8db2a969b7cc2690d1ad5bbc3961b54f39a56d49.png";
import imgTori from "@/imports/Landing/209e16e9a7b0e6466a84c310cffb3fdc38787db8.png";
import imgToriChat from "@/imports/Ai모드/1036bf7c5b4c39f6cf61eba9b8b1c76e90e5dfb0.png";
import imgToriMenu from "@/imports/햄버거메뉴활성화/9db62f1482f6077c23b2aaac03047a53e5f6f50c.png";
import imgAcorn from "@/imports/미션리워드/8135e13e64481f72eb891bb72cb9db8c4c3a5dad.png";
import imgToriAcorn from "@/imports/미션리워드/83c7dbb8da7027e4e62dfad831eaac2ba17cc611.png";
import imgTape from "@/imports/상점적용예시/ea6aea2b073382a238ef9b308be47610b8745314.png";
import imgToriMypage from "@/imports/마이페이지/tori-confetti.png";

type Screen =
  | "start"
  | "landing"
  | "category"
  | "category-landing"
  | "article"
  | "mission"
  | "shop"
  | "mypage";
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
    <div
      className="flex items-center shrink-0 rounded-full"
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

function DropdownTab({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative flex gap-2 items-center justify-center rounded-3xl"
      style={{ height: 40, paddingLeft: 24, paddingRight: 20 }}
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
      <ChevronDownIcon />
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
      <div className="relative" style={{ width: 24, height: 28, top: -3 }}>
        <img src={imgTori} alt="Tori" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </GlassBtn>
  );
}

// ── App Header ──
function AppHeader({
  dropdownLabel = "Today",
  showBack = false,
  showDropdown = true,
  showAvatar = true,
  onDropdownClick,
  onBackClick,
  onMenuOpen,
}: {
  dropdownLabel?: string;
  showBack?: boolean;
  showDropdown?: boolean;
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
        <DropdownTab label={dropdownLabel} onClick={onDropdownClick} />
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
function HeroCard({ category }: { category: Category }) {
  return (
    <div className="flex flex-col gap-5 px-5 w-full" style={{ paddingTop: 120, paddingBottom: 16 }}>
      <div className="flex flex-col gap-2 items-start" style={{ paddingTop: 20 }}>
        <CategoryChip label={category === "Today" ? "산업" : category} />
        <p className="headline-1" style={{ color: "var(--pt-text-primary)" }}>
          앤트로픽, 10월 IPO 추진…투자자 미팅 돌입
        </p>
      </div>
      <div
        className="relative rounded-xl overflow-hidden shrink-0 w-full"
        style={{ height: 181, marginBottom: 10 }}
      >
        <img src={imgArticle} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <p className="body-1 px-3" style={{ color: "var(--pt-text-primary)", textIndent: 8 }}>
        종이신문의 편집 위계를 모바일에 그대로 옮겨, 하루치 뉴스를 한눈에 훑어보는 경험을
        제공한다. 중요도에 따라 기사의 크기와 배치를 달리해 무엇을 먼저 읽어야 할지 자연스럽게
        안내한다. AI 요약과 형광펜 스크랩을 활용한다.
      </p>
      <p
        className="caption text-center"
        style={{ color: "var(--pt-text-secondary)", paddingTop: 10 }}
      >
        2026.07.22 &nbsp;(수)
      </p>
    </div>
  );
}

// ── News data ──
const ALL_NEWS = [
  { category: "산업", headline: "2차전지 소재 국산화 속도" },
  { category: "정치", headline: "국회, 추경안 본회의 처리 임박" },
  { category: "경제", headline: "한국은행 기준금리 연 3.0% 동결 결정" },
  { category: "코리안마켓", headline: "코스피 3,200선 돌파, 외국인 순매수" },
  { category: "부동산", headline: "서울 아파트 매매가 8주 연속 상승" },
];
const INDUSTRY_NEWS = [
  { category: "산업", headline: "앤트로픽, 10월 IPO 추진…투자자 미팅 돌입" },
  { category: "산업", headline: "삼성전자, HBM4 양산 속도 낸다" },
  { category: "산업", headline: "현대차 울산공장, 로봇 공정 전환 완료" },
];

// ── Landing Screen ──
function LandingScreen({
  category,
  onDropdownClick,
  onNewsClick,
  onMenuOpen,
}: {
  category: Category;
  onDropdownClick: () => void;
  onNewsClick: () => void;
  onMenuOpen: () => void;
}) {
  const news = category === "Today" ? ALL_NEWS : INDUSTRY_NEWS;
  const sectionTitle =
    category === "Today" ? "오늘의 주요뉴스" : `오늘의 ${category} 주요뉴스`;

  return (
    <div
      className="relative size-full rounded-[40px] overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        dropdownLabel={category === "Today" ? "Today" : category}
        onDropdownClick={onDropdownClick}
        onMenuOpen={onMenuOpen}
        showAvatar
      />
      <div className="h-full overflow-y-auto pb-24">
        <HeroCard category={category} />
        <div className="flex flex-col gap-2 pt-8">
          <div className="px-5">
            <p className="subtitle" style={{ color: "var(--pt-text-primary)", fontSize: 18 }}>
              {sectionTitle}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 py-2">
            {news.map((n, i) => (
              <NewsRow key={i} category={n.category} headline={n.headline} onClick={onNewsClick} />
            ))}
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[40px] border-4"
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
  onClick,
}: {
  label: string;
  subtitle: string;
  image: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute rounded-xl overflow-hidden text-left"
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
    imageUrl: "https://ik.imagekit.io/cuquvvrdw/%E1%84%80%E1%85%B3%E1%84%85%E1%85%A9%E1%84%87%E1%85%A5%E1%86%AF%E1%84%86%E1%85%A1%E1%84%8F%E1%85%A6%E1%86%BA.png",
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
function CategoryScreen({
  onBack,
  onCategorySelect,
}: {
  onBack: () => void;
  onCategorySelect: (cat: Category) => void;
}) {
  // 기존 디자인의 카드 스택 간격(세로 190px 간격, 좌측 84/80/84/90 지그재그)을 그대로 유지한 채
  // DB 로우 수만큼 카드를 생성
  const TOP_START = 115;
  const TOP_STEP = 190;
  const CARD_HEIGHT = 298;
  const LEFT_OFFSETS = [84, 80, 84, 90];

  const cards: { label: Category; subtitle: string; image: string; top: number; left: number }[] =
    CATEGORY_PAGE_DB.map((row, i) => ({
      label: row.title,
      subtitle: row.subtitle,
      image: row.imageUrl,
      top: TOP_START + i * TOP_STEP,
      left: LEFT_OFFSETS[i % LEFT_OFFSETS.length],
    }));

  const stageHeight = TOP_START + (cards.length - 1) * TOP_STEP + CARD_HEIGHT + 40;

  return (
    <div
      className="relative size-full rounded-[40px] overflow-hidden"
      style={{
        background:
          "linear-gradient(162.946deg, #ffffff 2.5%, var(--pt-bg-primary) 50%, #EFF1F5 103%)",
      }}
    >
      <AppHeader dropdownLabel="카테고리" showBack onBackClick={onBack} onDropdownClick={() => {}} />
      <div className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 110, paddingBottom: 40 }}>
        <div className="relative" style={{ height: stageHeight }}>
          {cards.map((c) => (
            <CategoryCard
              key={c.label}
              label={c.label}
              subtitle={c.subtitle}
              image={c.image}
              style={{ top: c.top, left: c.left }}
              onClick={() => onCategorySelect(c.label)}
            />
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[40px] border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Original Tab Content ──
function OriginalContent() {
  return (
    <div className="flex flex-col gap-5 px-5 py-4 w-full">
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
          "한국경제 뉴스 랜딩페이지는 종이신문이 갖고 있던 정보 위계를 디지털 환경에서 재현하지 못했다. 무한 스크롤과 배너 광고는 정돈된 지면 몰입감을 지웠다.",
          "한경 페이퍼는 하루치 뉴스를 메인기사 1개와 스택형 카드로 편집해, 정보 위계가 살아있는 지면형 레이아웃을 되살린다. 광고는 지면처럼 약속된 위치에만 배치해 피로도를 낮춘다.",
          "앤트로픽은 이른바 '신뢰할 수 있는 AI' 기업 이미지를 전면에 내세워 기업공개(IPO)를 추진하고 있으며, 주요 투자자들과의 로드쇼 미팅을 10월 예정으로 잡은 것으로 전해진다.",
        ].map((text, i) => (
          <p
            key={i}
            className="body-2"
            style={{ color: "var(--pt-text-primary)", textIndent: 8, letterSpacing: "-0.32px" }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── AI Tab Content ──
function AiContent() {
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
  activeTab,
  onTabChange,
  onBack,
}: {
  activeTab: ArticleTab;
  onTabChange: (t: ArticleTab) => void;
  onBack: () => void;
}) {
  const [showToolbar, setShowToolbar] = useState(false);

  return (
    <div
      className="relative size-full rounded-[40px] overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader showBack showDropdown={false} onBackClick={onBack} />
      <div className="h-full overflow-y-auto" style={{ paddingTop: 110, paddingBottom: 100 }}>
        <TabSlider active={activeTab} onChange={onTabChange} />
        {activeTab === "original" && <OriginalContent />}
        {activeTab === "ai" && <AiContent />}
        {activeTab === "easy" && <EasyContent />}
      </div>
      <FAB
        onPress={() => setShowToolbar((v) => !v)}
        showToolbar={showToolbar}
        onCloseToolbar={() => setShowToolbar(false)}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[40px] border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Mission Screen (미션리워드) ──
function MissionScreen({
  onBack,
  onShopPress,
}: {
  onBack: () => void;
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
      className="relative size-full rounded-[40px] overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader showBack showDropdown={false} onBackClick={onBack} showAvatar />

      <div className="h-full overflow-y-auto no-scrollbar" style={{ paddingTop: 110, paddingBottom: 32 }}>
        {/* 도토리 줍기 section */}
        <div className="flex flex-col gap-4 px-5 pt-6">
          <p className="title" style={{ color: "var(--pt-text-primary)" }}>
            도토리 줍기
          </p>

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

        {/* Quiz card */}
        <div
          className="mx-5 mt-4 rounded-xl p-4 flex items-center justify-between"
          style={{ backgroundColor: "var(--pt-bg-accent-light)" }}
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0" style={{ width: 40, height: 40, position: "relative" }}>
              <img
                src={imgToriAcorn}
                alt="토리"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="label" style={{ color: "var(--pt-text-primary)" }}>
                오늘의 경제 퀴즈
              </p>
              <p className="caption" style={{ color: "var(--pt-text-dark-green)" }}>
                완독한 기사에서만 출제할게요!
              </p>
            </div>
          </div>
          <ArrowRightIcon color="var(--pt-text-dark-green)" />
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
        className="absolute inset-0 pointer-events-none rounded-[40px] border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
    </div>
  );
}

// ── Shop Screen (상점적용예시) ──
function ShopScreen({ onBack, onMenuOpen }: { onBack: () => void; onMenuOpen: () => void }) {
  const [activeTab, setActiveTab] = useState<ShopTab>("sticker");

  const tapeItems = Array(6).fill({ name: "원형무늬 테이프", price: 100 });

  return (
    <div
      className="relative size-full rounded-[40px] overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader
        dropdownLabel="상점"
        showDropdown
        onDropdownClick={() => {}}
        onMenuOpen={onMenuOpen}
        showAvatar
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
          {tapeItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center isolate"
              style={{ width: 114, height: 165 }}
            >
              {/* Tape handle */}
              <div
                className="z-10 flex items-center justify-center"
                style={{ width: 18.5, height: 32.9, marginBottom: -12 }}
              >
                <div
                  className="rounded-sm"
                  style={{
                    width: 9,
                    height: 31.7,
                    backgroundColor: "var(--pt-tape-handle)",
                    transform: "rotate(18.39deg)",
                    boxShadow: "2px 2px 4px rgba(0,0,0,0.15)",
                  }}
                />
              </div>

              {/* Tape card */}
              <div
                className="relative rounded-3xl w-full flex-1 flex flex-col overflow-hidden"
                style={{
                  backgroundColor: "var(--pt-tape-card-bg)",
                  boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                  zIndex: 1,
                }}
              >
                <div className="flex-1 flex flex-col items-center gap-2 p-3.5">
                  <p
                    className="caption text-center w-full"
                    style={{ color: "var(--pt-text-primary)", fontSize: 11, fontWeight: 600 }}
                  >
                    {item.name}
                  </p>

                  {/* Tape image */}
                  <div
                    className="rounded-xl overflow-hidden w-full relative shrink-0"
                    style={{ height: 79, backgroundColor: "var(--pt-bg-primary)" }}
                  >
                    <div
                      className="absolute"
                      style={{
                        inset: "14.01% 9.72% 15.65% 10.47%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "hypot(82.33%, 66.75%)",
                          height: "hypot(-17.67%, 33.25%)",
                          transform: "rotate(33.28deg)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={imgTape}
                          alt="마스킹 테이프"
                          className="absolute max-w-none pointer-events-none"
                          style={{
                            width: "240.38%",
                            height: "723.81%",
                            top: "-180.72%",
                            left: "-122.58%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
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
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[40px] border-4"
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
      className="relative size-full rounded-[40px] overflow-hidden"
      style={{ backgroundColor: "var(--pt-bg-primary)" }}
    >
      <AppHeader showDropdown={false} showAvatar onMenuOpen={onMenuOpen} />

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
        className="absolute inset-0 pointer-events-none rounded-[40px] border-4"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      />
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
        { label: "스크랩 라이브러리", screen: null },
        { label: "읽기 기록 달력", screen: null },
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
            onNewsClick={() => {
              setArticleTab("original");
              goTo("article");
            }}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        );

      case "category":
        return (
          <CategoryScreen
            onBack={() =>
              goTo(prevScreen === "category-landing" ? "category-landing" : "landing")
            }
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
            onNewsClick={() => {
              setArticleTab("original");
              goTo("article");
            }}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        );

      case "article":
        return (
          <ArticleScreen
            activeTab={articleTab}
            onTabChange={setArticleTab}
            onBack={() => goTo(prevScreen)}
          />
        );

      case "mission":
        return (
          <MissionScreen
            onBack={() => goTo(prevScreen)}
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
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#D8DCE8" }}
    >
      <div
        className="relative overflow-hidden rounded-[44px]"
        style={{
          width: 393,
          height: 852,
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
      </div>
    </div>
  );
}
