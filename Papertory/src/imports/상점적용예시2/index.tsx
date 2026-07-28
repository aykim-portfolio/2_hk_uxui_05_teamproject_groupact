import img4 from "./209e16e9a7b0e6466a84c310cffb3fdc38787db8.png";
import img5 from "./8135e13e64481f72eb891bb72cb9db8c4c3a5dad.png";
import img9 from "./759520e82002394020c0b62209d21ced25454266.png";

function StatusBar() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="status-bar">
      <div className="flex flex-row items-center size-full">
        <div className="relative size-full" />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <div className="drop-shadow-[0px_2px_1px_rgba(181,181,181,0.25)] h-[52px] relative shrink-0 w-full" data-name="News/MainHeader">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
            <div className="content-stretch flex items-center justify-center overflow-clip p-[16px] relative rounded-[9999px] shadow-[0px_0px_0.3px_0px_rgba(219,219,219,0.25),4px_4px_16px_0px_rgba(0,0,0,0.12)] shrink-0 size-[40px]" data-name="Lead">
              <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[9999px]" style={{ backgroundImage: "linear-gradient(161.696deg, rgba(255, 255, 255, 0.2) 31.933%, rgba(235, 235, 235, 0.2) 144.03%)" }} />
              <div className="h-[12px] relative shrink-0 w-[14px]" data-name="Vector">
                <div className="absolute inset-[-8.33%_-7.14%]">
                  <svg className="block size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 16 14" width="16">
                    <path d="M1 1H15M1 7H15M1 13H15" id="Vector" stroke="var(--stroke-0, #1A2535)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_3px_4px_4px_0px_white,inset_0px_13px_12px_4px_rgba(255,255,255,0.2)]" />
            </div>
            <div className="content-stretch flex h-[40px] items-center justify-center pl-[24px] pr-[20px] py-[12px] relative rounded-[24px] shrink-0" data-name="News/DropdownTab">
              <div className="[word-break:break-word] flex flex-col font-['Paperlogy:7_Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1a2535] text-[20px] text-center whitespace-nowrap">
                <p className="leading-[normal]">상점</p>
              </div>
            </div>
            <div className="overflow-clip relative rounded-[9999px] shadow-[0px_0px_0.3px_0px_rgba(219,219,219,0.25),4px_4px_16px_0px_rgba(0,0,0,0.12)] shrink-0 size-[40px]" data-name="Trail">
              <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[9999px]" style={{ backgroundImage: "linear-gradient(161.696deg, rgba(255, 255, 255, 0.2) 31.933%, rgba(235, 235, 235, 0.2) 144.03%)" }} />
              <div className="absolute h-[28px] left-[8px] top-[7px] w-[24px]" data-name="도토리 줍줍한 토리 4">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img4} />
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_3px_4px_4px_0px_white,inset_0px_13px_12px_4px_rgba(255,255,255,0.2)]" />
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[8px] relative shrink-0 w-[382px]" data-name="Shop/Tabs">
        <div className="bg-[#edf0fd] content-stretch flex items-start justify-center px-[24px] py-[12px] relative rounded-[24px] shrink-0 w-[186px]" data-name="News/CategoryChip">
          <p className="[word-break:break-word] font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#496de0] text-[14px] whitespace-nowrap">테이프</p>
        </div>
        <div className="bg-[#6083f5] content-stretch flex items-start justify-center px-[24px] py-[12px] relative rounded-[24px] shrink-0 w-[186px]" data-name="News/CategoryChip">
          <p className="[word-break:break-word] font-['Paperlogy:7_Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#fcfff1] text-[14px] whitespace-nowrap">스티커</p>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
      <Frame9 />
      <div className="bg-[#eff1f5] content-stretch flex items-center justify-between p-[16px] relative rounded-[12px] shrink-0 w-[382px]" data-name="Reward/RewardCard">
        <p className="[word-break:break-word] font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">수집한 도토리</p>
        <div className="content-stretch flex gap-[8px] items-center px-[10px] relative shrink-0" data-name="Reward/RoundButton">
          <div className="h-[24px] relative shrink-0 w-[20px]" data-name="뉴스 찾은 토리 5">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img5} />
          </div>
          <p className="[word-break:break-word] font-['Paperlogy:5_Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">0개</p>
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="flex h-[32.931px] items-center justify-center mb-[-12px] relative shrink-0 w-[18.544px] z-[2]">
      <div className="flex-none rotate-[18.39deg]">
        <div className="bg-[#c8e54c] h-[31.711px] relative rounded-[2px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.15)] w-[9px]" data-name="집게" />
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute inset-[15.64%_18.81%_17.28%_19.56%]" data-name="토리스티커">
      <div className="absolute inset-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]" data-name="도토리 줍줍한 토리 9">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[116.85%] left-[0.26%] max-w-none top-[-7.14%] w-[100.08%]" src={img9} />
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="bg-[#f8f9fb] h-[79px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="이미지">
      <Component3 />
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="가격라벨">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] not-italic relative shrink-0 text-[11px] text-black whitespace-nowrap">100</p>
      <div className="h-[11.737px] relative shrink-0 w-[9.855px]" data-name="뉴스 찾은 토리 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img5} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center min-w-px relative">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] min-w-full not-italic relative shrink-0 text-[11px] text-black text-center w-[min-content]">원형무늬 테이프</p>
      <Component1 />
      <Component4 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#f5fce0] relative rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full z-[1]" data-name="토리스티커 카드/Frame 246">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="flex h-[32.931px] items-center justify-center mb-[-12px] relative shrink-0 w-[18.544px] z-[2]">
      <div className="flex-none rotate-[18.39deg]">
        <div className="bg-[#c8e54c] h-[31.711px] relative rounded-[2px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.15)] w-[9px]" data-name="집게" />
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div className="absolute inset-[15.64%_18.81%_17.28%_19.56%]" data-name="토리스티커">
      <div className="absolute inset-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]" data-name="도토리 줍줍한 토리 9">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[116.85%] left-[0.26%] max-w-none top-[-7.14%] w-[100.08%]" src={img9} />
        </div>
      </div>
    </div>
  );
}

function Component6() {
  return (
    <div className="bg-[#f8f9fb] h-[79px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="이미지">
      <Component7 />
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="가격라벨">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] not-italic relative shrink-0 text-[11px] text-black whitespace-nowrap">100</p>
      <div className="h-[11.737px] relative shrink-0 w-[9.855px]" data-name="뉴스 찾은 토리 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img5} />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center min-w-px relative">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] min-w-full not-italic relative shrink-0 text-[11px] text-black text-center w-[min-content]">원형무늬 테이프</p>
      <Component6 />
      <Component8 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f5fce0] relative rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full z-[1]" data-name="토리스티커 카드/Frame 246">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Component9() {
  return (
    <div className="flex h-[32.931px] items-center justify-center mb-[-12px] relative shrink-0 w-[18.544px] z-[2]">
      <div className="flex-none rotate-[18.39deg]">
        <div className="bg-[#c8e54c] h-[31.711px] relative rounded-[2px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.15)] w-[9px]" data-name="집게" />
      </div>
    </div>
  );
}

function Component11() {
  return (
    <div className="absolute inset-[15.64%_18.81%_17.28%_19.56%]" data-name="토리스티커">
      <div className="absolute inset-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]" data-name="도토리 줍줍한 토리 9">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[116.85%] left-[0.26%] max-w-none top-[-7.14%] w-[100.08%]" src={img9} />
        </div>
      </div>
    </div>
  );
}

function Component10() {
  return (
    <div className="bg-[#f8f9fb] h-[79px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="이미지">
      <Component11 />
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="가격라벨">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] not-italic relative shrink-0 text-[11px] text-black whitespace-nowrap">100</p>
      <div className="h-[11.737px] relative shrink-0 w-[9.855px]" data-name="뉴스 찾은 토리 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img5} />
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center min-w-px relative">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] min-w-full not-italic relative shrink-0 text-[11px] text-black text-center w-[min-content]">원형무늬 테이프</p>
      <Component10 />
      <Component12 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#f5fce0] relative rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full z-[1]" data-name="토리스티커 카드/Frame 246">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function Component13() {
  return (
    <div className="flex h-[32.931px] items-center justify-center mb-[-12px] relative shrink-0 w-[18.544px] z-[2]">
      <div className="flex-none rotate-[18.39deg]">
        <div className="bg-[#c8e54c] h-[31.711px] relative rounded-[2px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.15)] w-[9px]" data-name="집게" />
      </div>
    </div>
  );
}

function Component15() {
  return (
    <div className="absolute inset-[15.64%_18.81%_17.28%_19.56%]" data-name="토리스티커">
      <div className="absolute inset-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]" data-name="도토리 줍줍한 토리 9">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[116.85%] left-[0.26%] max-w-none top-[-7.14%] w-[100.08%]" src={img9} />
        </div>
      </div>
    </div>
  );
}

function Component14() {
  return (
    <div className="bg-[#f8f9fb] h-[79px] overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="이미지">
      <Component15 />
    </div>
  );
}

function Component16() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0" data-name="가격라벨">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] not-italic relative shrink-0 text-[11px] text-black whitespace-nowrap">100</p>
      <div className="h-[11.737px] relative shrink-0 w-[9.855px]" data-name="뉴스 찾은 토리 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img5} />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center min-w-px relative">
      <p className="[word-break:break-word] font-['Paperlogy:6_SemiBold',sans-serif] leading-[9.6px] min-w-full not-italic relative shrink-0 text-[11px] text-black text-center w-[min-content]">원형무늬 테이프</p>
      <Component14 />
      <Component16 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#f5fce0] relative rounded-[24px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-full z-[1]" data-name="토리스티커 카드/Frame 246">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center p-[14px] relative size-full">
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

function Slot() {
  return (
    <div className="flex-[1_0_0] h-[680px] min-w-px relative" data-name="Slot">
      <div className="content-start flex flex-wrap gap-y-[32px] items-start justify-between px-[20px] py-[10px] relative size-full">
        <div className="content-stretch flex flex-col isolate items-center relative shrink-0 w-[114px]" data-name="Shop/ToriStickerCard">
          <Component />
          <Frame />
        </div>
        <div className="content-stretch flex flex-col isolate items-center relative shrink-0 w-[114px]" data-name="Shop/ToriStickerCard">
          <Component5 />
          <Frame2 />
        </div>
        <div className="content-stretch flex flex-col isolate items-center relative shrink-0 w-[114px]" data-name="Shop/ToriStickerCard">
          <Component9 />
          <Frame4 />
        </div>
        <div className="content-stretch flex flex-col isolate items-center relative shrink-0 w-[114px]" data-name="Shop/ToriStickerCard">
          <Component13 />
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[20px] relative shrink-0 w-full">
      <div className="content-start flex flex-wrap h-[712px] items-start relative shrink-0 w-[402px]" data-name="Shop/CardItemContainer">
        <Slot />
      </div>
    </div>
  );
}

function BottomIndicator() {
  return (
    <div className="-translate-x-1/2 absolute bottom-0 content-stretch flex h-[24px] items-end justify-center left-1/2 opacity-0 pb-[8px] w-[402px]" data-name="bottom-indicator">
      <div className="bg-[#1e254a] h-[5px] opacity-20 relative rounded-[100px] shrink-0 w-[134px]" data-name="Rectangle" />
    </div>
  );
}

export default function Component2() {
  return (
    <div className="bg-[#f8f9fb] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[40px] size-full" data-name="상점 적용예시2">
      <StatusBar />
      <Frame10 />
      <Frame8 />
      <BottomIndicator />
    </div>
  );
}