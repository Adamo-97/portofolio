import type { NextPage } from "next";
import Image from "next/image";
import Header from "../components/header";
import MainPicPlaceholder from "../components/main-pic-placeholder";

const HomePage: NextPage = () => {
  return (
    <div className="w-full h-[900px] relative bg-black flex flex-col items-start justify-start gap-[30px] min-w-[1000px] leading-[normal] tracking-[normal]">
      <Header />
      <main className="self-stretch flex-1 overflow-hidden flex flex-col items-center justify-start pt-5 px-5 pb-0">
        <section className="flex flex-col items-center justify-start relative text-center text-[95.6px] font-urbanist">
          <div className="flex flex-col items-center justify-start gap-2.5 z-[0]">
            <div className="w-[124px] h-16 flex flex-row items-start justify-start">
              <div className="flex flex-col items-start justify-start pt-[19px] px-0 pb-0">
                <button className="cursor-pointer [border:none] py-[12.7px] px-[25px] bg-cornflowerblue-100 h-[45px] rounded-[38.2px] overflow-hidden shrink-0 flex flex-row items-center justify-center box-border hover:bg-cornflowerblue-200">
                  <div className="relative text-xl tracking-[-0.01em] font-medium font-urbanist text-white text-left mq450:text-base">
                    Hello!
                  </div>
                </button>
              </div>
              <Image
                className="h-[28.5px] w-[27.5px] relative shrink-0 z-[1] ml-[-0.5px]"
                loading="lazy"
                width={27.5}
                height={28.5}
                sizes="100vw"
                alt=""
                src="/Vector-1.svg"
              />
            </div>
            <div className="w-[913px] flex flex-row items-center justify-between relative gap-0">
              <div className="w-[913px] relative tracking-[-0.01em] leading-[100%] font-semibold inline-block shrink-0 z-[0] mq450:text-[29px] mq450:leading-[38px] mq750:text-5xl mq750:leading-[57px]">
                <p className="m-0">{`I’m  `}Adam</p>
                <p className="m-0">Software Engineer</p>
              </div>
              <Image
                className="h-[117px] w-[301px] absolute !!m-[0 important] top-[-14px] left-[393px] rounded-[25px] object-contain z-[1]"
                loading="lazy"
                width={301}
                height={117}
                sizes="100vw"
                alt=""
                src="/Vector-22.svg"
              />
            </div>
          </div>
          <div className="w-[86.2px] h-[88.2px] absolute !!m-[0 important] top-[227px] left-[2px] overflow-hidden flex items-center justify-center z-[1]">
            <Image
              className="w-full h-full object-cover absolute left-[3px] top-[4px] [transform:scale(1)]"
              width={86.2}
              height={88.2}
              sizes="100vw"
              alt=""
              src="/Vector-2.svg"
            />
          </div>
        </section>
        <MainPicPlaceholder />
      </main>
    </div>
  );
};

export default HomePage;
