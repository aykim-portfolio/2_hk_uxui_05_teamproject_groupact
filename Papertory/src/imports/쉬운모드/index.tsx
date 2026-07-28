import svgPaths from "./svg-umqhk1aefa";
import img4 from "./209e16e9a7b0e6466a84c310cffb3fdc38787db8.png";
import imgImage20 from "./8db2a969b7cc2690d1ad5bbc3961b54f39a56d49.png";
import img17 from "./1036bf7c5b4c39f6cf61eba9b8b1c76e90e5dfb0.png";

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Frame">
      <p className="[word-break:break-word] font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[17px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        9:41
      </p>
    </div>
  );
}

function Time() {
  return (
    <div className="flex-[1_0_0] h-[13px] min-w-px relative" data-name="Time">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[6px] relative size-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[13px] relative shrink-0 w-[85.329px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 87.3291 13" width="87.3291">
        <g id="Frame">
          <path d={svgPaths.p9888ec0} fill="var(--fill-0, black)" id="Cellular Connection" />
          <path clipRule="evenodd" d={svgPaths.p3a15dc00} fill="var(--fill-0, black)" fillRule="evenodd" id="Wifi" />
          <path clipRule="evenodd" d={svgPaths.p3fa00770} fill="var(--fill-0, black)" fillRule="evenodd" id="Battery" />
        </g>
      </svg>
    </div>
  );
}

function Levels() {
  return (
    <div className="flex-[1_0_0] h-[13px] min-w-px relative" data-name="Levels">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[2px] relative size-full">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[-10px] top-0">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#6083f5] text-[12px] text-center w-[43px]">AI모드</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[135px] top-0 w-[43px]">
      <p className="[word-break:break-word] font-['Paperlogy:4_Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1a] text-[12px] whitespace-nowrap">원문</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[286px] top-0">
      <p className="[word-break:break-word] font-['Paperlogy:4_Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a1a1a] text-[12px] text-center whitespace-nowrap">쉽게읽기</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute h-[14px] left-[-7.5px] right-[-7.5px] top-0">
      <Frame9 />
      <Frame11 />
      <Frame10 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[13px] relative shrink-0 w-[310px]">
      <Frame7 />
    </div>
  );
}

function Segment() {
  return <div className="bg-[#e6f997] flex-[1_0_0] h-[2.64px] min-w-px relative rounded-[2px]" data-name="segment" />;
}

function Segment1() {
  return <div className="bg-[#6083f5] flex-[1_0_0] h-[2px] min-w-px relative" data-name="segment" />;
}

function DotActive() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="dot-active">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="dot-active">
          <path d={svgPaths.p1c83da00} fill="var(--fill-0, #E6F997)" />
          <circle cx="10" cy="10" fill="var(--fill-0, #6083F5)" id="inner" r="6" />
        </g>
      </svg>
    </div>
  );
}

function Track() {
  return (
    <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-name="track">
      <div className="relative shrink-0 size-[8px]" data-name="dot">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="var(--fill-0, #E6F997)" id="dot" r="4" />
        </svg>
      </div>
      <Segment />
      <div className="relative shrink-0 size-[8px]" data-name="dot">
        <svg className="absolute block inset-0 size-full" fill="none" height="8" preserveAspectRatio="none" viewBox="0 0 8 8" width="8">
          <circle cx="4" cy="4" fill="var(--fill-0, #E6F997)" id="dot" r="4" />
        </svg>
      </div>
      <Segment1 />
      <DotActive />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[144px] items-start pb-[10px] relative shrink-0" data-name="타이틀">
      <div className="bg-[#edf0fd] content-stretch flex items-start px-[24px] py-[6px] relative rounded-[24px] shrink-0" data-name="category chip">
        <p className="[word-break:break-word] font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#496de0] text-[14px] whitespace-nowrap">산업</p>
      </div>
      <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="뉴스제목">
        <p className="[word-break:break-word] font-['Paperlogy:8_ExtraBold',sans-serif] leading-[34px] not-italic relative shrink-0 text-[#1a2535] text-[24px] w-[353px]">앤트로픽, 10월 IPO 추진…투자자 미팅 돌입</p>
      </div>
      <div className="h-[14px] relative shrink-0 w-[196px]" data-name="한경 산업부 기자 · 2026.07.20 09:12">
        <p className="[word-break:break-word] absolute font-['Paperlogy:5_Medium',sans-serif] inset-0 leading-[normal] not-italic text-[#7d828a] text-[12px] whitespace-nowrap">한경 산업부 기자 · 2026.07.20 09:12</p>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[361px]" data-name="이미지 레이아웃">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="이미지 레이아웃">
        <div className="h-[181px] relative rounded-[12px] shrink-0 w-full" data-name="image 20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
            <img alt="" className="absolute h-[129.64%] left-0 max-w-none top-[-8.89%] w-full" src={imgImage20} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 w-full" data-name="AI카드내용">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[4px] relative size-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Paperlogy:6_SemiBold',sans-serif] leading-[20px] min-w-px not-italic opacity-80 relative text-[#354b0e] text-[14px] whitespace-pre-wrap">{`어려운 경제뉴스,  토리가 읽기 쉽게 바꿨어요!`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative rounded-[24px] shrink-0 w-full" data-name="뉴스내용">
      <div className="bg-[#fcfff1] content-stretch drop-shadow-[2px_2px_4px_#d3d8e9] flex flex-col gap-[20px] items-start px-[16px] py-[10px] relative rounded-[12px] shrink-0 w-[353px]" data-name="AI요약">
        <div className="content-stretch flex gap-[14px] items-center justify-center relative shrink-0 w-[321px]" data-name="뉴스원문-토리카드">
          <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[258px]">
            <Frame12 />
          </div>
          <div className="relative shrink-0 size-[54px]" data-name="round button">
            <div className="absolute flex inset-0 items-center justify-center" style={{ containerType: "size" }}>
              <div className="-scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                <div className="relative size-full" data-name="뉴스 모은 토리 17">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute h-[103.06%] left-0 max-w-none top-[-1.53%] w-full" src={img17} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="-뉴스텍스트">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[12px] relative size-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal justify-center leading-[0] min-w-px overflow-hidden relative text-[#1a2535] text-[0px] text-ellipsis tracking-[-0.4px] whitespace-pre-wrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="indent-[8px] mb-0 text-[20px]">
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`한국경제 뉴스 랜딩페이지는 종이신문이 갖고 있던 을 디지털 환경에서 재현하지 못했다. `}</span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  무한 스크롤과 배너 광고
                </span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  는 정돈된 지면 몰입감을 지웠다.
                </span>
              </p>
              <p className="indent-[8px] leading-[32px] mb-0 text-[16px]">​</p>
              <p className="indent-[8px] text-[20px]">
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`한경 페이퍼는 하루치 뉴스를 `}</span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  메인기사 1개와 스택형 카드
                </span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  로 편집해,
                </span>
                <span className="leading-[26px] text-[#141414] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>{` `}</span>
                <span className="[text-decoration-skip-ink:none] decoration-[120%] decoration-[rgba(235,249,179,0.5)] decoration-solid leading-[26px] text-[16px] text-black underline" style={{ fontVariationSettings: '"wdth" 100' }}>
                  정보 위계가 살아있는 지면형 레이아웃
                </span>
                <span className="[text-decoration-skip-ink:none] decoration-[120%] decoration-[rgba(235,249,179,0.5)] decoration-solid leading-[26px] text-[16px] text-black underline" style={{ fontVariationSettings: '"wdth" 100' }}>
                  을 되살린다. 광고는 지면처럼 약속된 위치에만 배치해 피로도를 낮춘다
                </span>
                <span className="[text-decoration-skip-ink:none] decoration-[120%] decoration-[rgba(235,249,179,0.5)] decoration-solid leading-[26px] text-[#e6f997] text-[16px] underline" style={{ fontVariationSettings: '"wdth" 100' }}>
                  .
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="-뉴스텍스트">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center px-[12px] relative size-full">
            <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Open_Sans:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal justify-center leading-[0] min-w-px overflow-hidden relative text-[#1a2535] text-[0px] text-ellipsis tracking-[-0.4px] whitespace-pre-wrap" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="indent-[8px] mb-0 text-[20px]">
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`한국경제 뉴스 랜딩페이지는 종이신문이 갖고 있던 을 디지털 환경에서 재현하지 못했다. `}</span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  무한 스크롤과 배너 광고
                </span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  는 정돈된 지면 몰입감을 지웠다.
                </span>
              </p>
              <p className="indent-[8px] leading-[32px] mb-0 text-[16px]">​</p>
              <p className="indent-[8px] text-[20px]">
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>{`한경 페이퍼는 하루치 뉴스를 `}</span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  메인기사 1개와 스택형 카드
                </span>
                <span className="leading-[26px] text-[#1a1a1a] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                  로 편집해,
                </span>
                <span className="leading-[26px] text-[#141414] text-[16px]" style={{ fontVariationSettings: '"wdth" 100' }}>{` `}</span>
                <span className="[text-decoration-skip-ink:none] decoration-[120%] decoration-[rgba(235,249,179,0.5)] decoration-solid leading-[26px] text-[16px] text-black underline" style={{ fontVariationSettings: '"wdth" 100' }}>
                  정보 위계가 살아있는 지면형 레이아웃
                </span>
                <span className="[text-decoration-skip-ink:none] decoration-[120%] decoration-[rgba(235,249,179,0.5)] decoration-solid leading-[26px] text-[16px] text-black underline" style={{ fontVariationSettings: '"wdth" 100' }}>
                  을 되살린다. 광고는 지면처럼 약속된 위치에만 배치해 피로도를 낮춘다
                </span>
                <span className="[text-decoration-skip-ink:none] decoration-[120%] decoration-[rgba(235,249,179,0.5)] decoration-solid leading-[26px] text-[#e6f997] text-[16px] underline" style={{ fontVariationSettings: '"wdth" 100' }}>
                  .
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-w-px relative z-[1]">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="overflow-clip relative size-[18px]" data-name="icons">
            <div className="absolute inset-[8.33%]" data-name="Vector">
              <div className="absolute inset-[-5%]">
                <svg className="block size-full" fill="none" height="16.5001" preserveAspectRatio="none" viewBox="0 0 16.5 16.5001" width="16.5">
                  <path d={svgPaths.p1f9ebf80} id="Vector" stroke="var(--stroke-0, #1A2535)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Paperlogy:4_Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a2535] text-[14px] tracking-[-0.28px] w-[257.6px]">AI에게 질문하기</p>
    </div>
  );
}

function AiInsightCardQnA() {
  return (
    <div className="bg-[#ecf0f9] content-stretch flex flex-col h-[39px] items-start justify-center px-[14px] py-[10px] relative rounded-[24px] shrink-0 w-[238px]" data-name="AI-Insight-Card-QnA">
      <div aria-hidden className="absolute border-[#d6ee8d] border-[1.3px] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="[word-break:break-word] font-['Paperlogy:4_Regular',sans-serif] leading-[12.48px] not-italic opacity-80 relative shrink-0 text-[#1a2535] text-[12px] tracking-[-0.24px] w-full">안녕! 나는 토리야. 궁금한 내용 쉽게 알려줄게!</p>
    </div>
  );
}

function AiInsightCardQnA1() {
  return (
    <div className="bg-[#d0dafc] content-stretch flex h-[31.2px] items-center justify-end px-[14px] py-[10px] relative rounded-[24px] shrink-0" data-name="AI-Insight-Card-QnA">
      <p className="[word-break:break-word] font-['Paperlogy:5_Medium',sans-serif] leading-[12.48px] not-italic relative shrink-0 text-[#1a2535] text-[13px] tracking-[-0.26px] whitespace-nowrap">오늘의 주요뉴스 알려줘!</p>
    </div>
  );
}

function Body() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="body">
      <div className="overflow-x-clip overflow-y-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-center px-[16px] py-[12px] relative size-full">
          <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="토리대화">
            <div className="flex items-center justify-center relative shrink-0">
              <div className="-scale-y-100 flex-none rotate-180">
                <div className="h-[37.32px] relative w-[37.6px]" data-name="뉴스 모은 토리 17">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute h-[103.06%] left-0 max-w-none top-[-1.53%] w-full" src={img17} />
                  </div>
                </div>
              </div>
            </div>
            <AiInsightCardQnA />
          </div>
          <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="유저대화">
            <AiInsightCardQnA1 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#ecf0f9] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative size-full">
          <p className="[word-break:break-word] font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a2535] text-[12px] tracking-[-0.24px] whitespace-nowrap">추천질문이 생성될 공간입니다</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[1.4px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#ecf0f9] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative size-full">
          <p className="[word-break:break-word] font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a2535] text-[12px] tracking-[-0.24px] whitespace-nowrap">추천질문이 생성될 공간입니다</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[1.4px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#ecf0f9] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative size-full">
          <p className="[word-break:break-word] font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a2535] text-[12px] tracking-[-0.24px] whitespace-nowrap">추천질문이 생성될 공간입니다</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[1.4px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#ecf0f9] relative rounded-[20px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[10px] relative size-full">
          <p className="[word-break:break-word] font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1a2535] text-[12px] tracking-[-0.24px] whitespace-nowrap">추천질문이 생성될 공간입니다</p>
        </div>
      </div>
      <div aria-hidden className="absolute border-[1.4px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Slot() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-x-auto overflow-y-clip relative shrink-0" data-name="Slot">
      <div className="content-stretch flex flex-col items-start px-[12px] py-[9px] relative shrink-0 w-[204px]" data-name="추천질문">
        <Frame4 />
      </div>
      <div className="content-stretch flex flex-col items-start px-[12px] py-[9px] relative shrink-0 w-[204px]" data-name="추천질문">
        <Frame5 />
      </div>
      <div className="content-stretch flex flex-col items-start px-[12px] py-[9px] relative shrink-0 w-[204px]" data-name="추천질문">
        <Frame6 />
      </div>
      <div className="content-stretch flex flex-col items-start px-[12px] py-[9px] relative shrink-0 w-[204px]" data-name="추천질문">
        <Frame8 />
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-x-auto overflow-y-clip relative shrink-0 w-full" data-name="추천질문컨테이너">
      <Slot />
    </div>
  );
}

function InputField() {
  return (
    <div className="bg-white h-[40px] relative rounded-[9999px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden className="absolute border-[#ececec] border-[1.4px] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end px-[8px] py-[12px] relative size-full">
          <div className="bg-[#6083f5] content-stretch flex flex-col items-center justify-center overflow-clip pb-[3px] pt-[2px] px-[3px] relative rounded-[9999px] shrink-0 size-[24px]" data-name="up icon">
            <div className="overflow-clip relative shrink-0 size-[10.408px]" data-name="lucide">
              <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
                <div className="absolute inset-[-16.67%_-8.33%]">
                  <svg className="block size-full" fill="none" height="3.46931" preserveAspectRatio="none" viewBox="0 0 6.0713 3.46931" width="6.0713">
                    <path d={svgPaths.p2d133780} id="Vector" stroke="var(--stroke-0, #E6F997)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.867328" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bottom() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Bottom">
      <Component5 />
      <div className="relative shrink-0 w-full" data-name="AIChat input">
        <div className="content-stretch flex flex-col items-start pb-[24px] pt-[10px] px-[10px] relative size-full">
          <InputField />
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col h-[627px] items-start justify-between overflow-clip relative shrink-0 w-full z-[1]">
      <Body />
      <Bottom />
    </div>
  );
}

function Component4() {
  return (
    <div className="bg-[rgba(252,255,238,0.7)] flex-[1_0_0] min-w-px relative rounded-[36px]" data-name="틀">
      <div className="content-stretch flex flex-col isolate items-center overflow-clip relative rounded-[inherit] size-full">
        <div className="bg-[#ecf0f9] h-[47.6px] relative shrink-0 w-full z-[2]" data-name="AiChat Top Bar">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex isolate items-center px-[32px] py-[8px] relative size-full">
              <Frame3 />
            </div>
          </div>
          <div aria-hidden className="absolute border-[rgba(198,198,198,0.6)] border-b-[1.4px] border-solid inset-0 pointer-events-none" />
        </div>
        <Frame13 />
      </div>
      <div aria-hidden className="absolute border border-[#c6c6c6] border-solid inset-0 pointer-events-none rounded-[36px]" />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f8f9fb] relative rounded-[40px] size-full" data-name="쉬운모드">
      <div className="content-stretch flex flex-col items-center min-h-[inherit] overflow-clip pb-[12px] relative rounded-[inherit] size-full">
        <div className="h-[62px] opacity-0 relative shrink-0 w-full" data-name="Status bar - iPhone">
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center pt-[2.333px] px-[9px] relative size-full">
              <Time />
              <div className="bg-black h-[37px] relative rounded-[100px] shrink-0 w-[125px]" data-name="Dynamic Island" />
              <Levels />
            </div>
          </div>
        </div>
        <div className="content-stretch drop-shadow-[0px_2px_1px_rgba(181,181,181,0.25)] flex h-[52px] items-center justify-between px-[16px] relative shrink-0 w-[393px]" data-name="main-header">
          <div className="overflow-clip relative rounded-[9999px] shadow-[0px_0px_0.3px_0px_rgba(219,219,219,0.25),4px_4px_16px_0px_rgba(0,0,0,0.12)] shrink-0 size-[40px]" data-name="Lead">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[9999px]" style={{ backgroundImage: "linear-gradient(161.696deg, rgba(255, 255, 255, 0.2) 31.933%, rgba(235, 235, 235, 0.2) 144.03%)" }} />
            <div className="absolute h-[12px] left-[17px] top-[14px] w-[6px]" data-name="Vector">
              <div className="absolute inset-[-8.33%_-16.67%]">
                <svg className="block size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 8 14" width="8">
                  <path d="M7 13L1 7L7 1" id="Vector" stroke="var(--stroke-0, #1A2535)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_3px_4px_4px_0px_white,inset_0px_13px_12px_4px_rgba(255,255,255,0.2)]" />
          </div>
          <div className="content-stretch flex gap-[8px] h-[40px] items-center justify-center opacity-0 pl-[24px] pr-[20px] py-[12px] relative rounded-[24px] shrink-0" data-name="dropdown-tab">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[24px]" style={{ backgroundImage: "linear-gradient(174.232deg, rgba(255, 255, 255, 0.2) 31.933%, rgba(235, 235, 235, 0.2) 144.03%)" }} />
            <div aria-hidden className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[24px] shadow-[0px_0px_0.3px_0px_rgba(219,219,219,0.25),4px_4px_16px_0px_rgba(0,0,0,0.12)]" />
            <div className="[word-break:break-word] flex flex-col font-['Paperlogy:7_Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2535] text-[20px] text-center whitespace-nowrap">
              <p className="leading-[normal]">Today</p>
            </div>
            <div className="overflow-clip relative shrink-0 size-[16px]" data-name="navigation icons">
              <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
                <div className="absolute inset-[-16.67%_-8.33%]">
                  <svg className="block size-full" fill="none" height="5.33333" preserveAspectRatio="none" viewBox="0 0 9.33333 5.33333" width="9.33333">
                    <path d={svgPaths.p32098840} id="Vector" stroke="var(--stroke-0, #1A2535)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_3px_4px_4px_0px_white,inset_0px_13px_12px_0px_rgba(255,255,255,0.2)]" />
          </div>
          <div className="opacity-0 overflow-clip relative rounded-[9999px] shadow-[0px_0px_0.3px_0px_rgba(219,219,219,0.25),4px_4px_16px_0px_rgba(0,0,0,0.12)] shrink-0 size-[40px]" data-name="Trail">
            <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[9999px]" style={{ backgroundImage: "linear-gradient(161.696deg, rgba(255, 255, 255, 0.2) 31.933%, rgba(235, 235, 235, 0.2) 144.03%)" }} />
            <div className="absolute h-[28px] left-[8px] top-[7px] w-[24px]" data-name="도토리 줍줍한 토리 4">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img4} />
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_3px_4px_4px_0px_white,inset_0px_13px_12px_4px_rgba(255,255,255,0.2)]" />
          </div>
        </div>
        <div className="relative rounded-[36px] shrink-0 w-full" data-name="slider-쉽게읽기">
          <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col gap-[6px] items-center pb-[12px] pt-[10px] px-[20px] relative size-full">
              <Frame2 />
              <Track />
            </div>
          </div>
        </div>
        <div className="bg-[#f8f9fb] content-stretch flex flex-col gap-[20px] items-center px-[20px] py-[16px] relative shrink-0 w-[393px]" data-name="뉴스 카드">
          <Component1 />
          <Component2 />
          <Component3 />
        </div>
        <div className="content-stretch flex items-center justify-center px-[10px] py-[40px] relative shrink-0 w-[393px]" data-name="chat">
          <Component4 />
        </div>
        <div className="absolute bottom-[56px] content-stretch flex items-center justify-center p-[20px] right-[27px] rounded-[9999px] shadow-[0px_0px_0.3px_0px_rgba(219,219,219,0.25),4px_4px_16px_0px_rgba(0,0,0,0.12)]" data-name="Floating_Action_Button">
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[9999px]" style={{ backgroundImage: "linear-gradient(161.696deg, rgba(255, 255, 255, 0.2) 31.933%, rgba(235, 235, 235, 0.2) 144.03%)" }} />
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icons">
            <div className="absolute inset-[8.33%]" data-name="Vector">
              <div className="absolute inset-[-5%]">
                <svg className="block size-full" fill="none" height="22.0001" preserveAspectRatio="none" viewBox="0 0 22.0001 22.0001" width="22.0001">
                  <path d={svgPaths.p39fd7c00} id="Vector" stroke="var(--stroke-0, #6083F5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_3px_4px_4px_0px_white,inset_0px_13px_12px_0px_rgba(255,255,255,0.2)]" />
        </div>
      </div>
      <div aria-hidden className="absolute border-4 border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[40px]" />
    </div>
  );
}