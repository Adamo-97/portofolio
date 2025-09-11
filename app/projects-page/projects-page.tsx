"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProjectsPage: NextPage = () => {
  const router = useRouter();

  const onHomeButtonContainerClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const onSkillsButtonContainerClick = useCallback(() => {
    router.push("/skills-page");
  }, [router]);

  const onRoadmapButtonContainerClick = useCallback(() => {
    router.push("/roadmap-page");
  }, [router]);

  const onContactButtonContainerClick = useCallback(() => {
    router.push("/contact-page");
  }, [router]);

  return (
    <div className="w-full h-[900px] relative shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] [background:linear-gradient(129.23deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_linear-gradient(77.08deg,_rgba(24,_161,_253,_0.15),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col items-start justify-start gap-[30px] min-w-[1000px] leading-[normal] tracking-[normal] mq675:h-auto">
      <header className="self-stretch flex flex-row items-center justify-between pt-2.5 px-[120px] pb-0 gap-0 mq450:pl-5 mq450:pr-5 mq450:box-border mq750:pl-[60px] mq750:pr-[60px] mq750:box-border">
        <Image
          className="w-[42px] relative max-h-full"
          loading="lazy"
          width={42}
          height={44}
          sizes="100vw"
          alt=""
          src="/logo.svg"
        />
        <nav className="m-0 flex flex-row items-center justify-start gap-5 text-center text-xl text-white font-urbanist mq675:hidden">
          <div
            className="flex flex-row items-center justify-center p-2.5 cursor-pointer"
            onClick={onHomeButtonContainerClick}
          >
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Home
            </h3>
          </div>
          <div
            className="flex flex-row items-center justify-center p-2.5 cursor-pointer"
            onClick={onSkillsButtonContainerClick}
          >
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Skills
            </h3>
          </div>
          <div
            className="flex flex-row items-center justify-center py-2.5 px-[9px] cursor-pointer"
            onClick={onRoadmapButtonContainerClick}
          >
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Roadmap
            </h3>
          </div>
          <div className="border-cornflowerblue-100 border-solid border-b-[1px] flex flex-row items-center justify-center pt-2.5 px-2.5 pb-2">
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Projects
            </h3>
          </div>
          <div
            className="flex flex-row items-center justify-center py-2.5 px-[9px] cursor-pointer"
            onClick={onContactButtonContainerClick}
          >
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Contact
            </h3>
          </div>
        </nav>
      </header>
      <main className="self-stretch overflow-hidden flex flex-col items-center justify-start pt-9 px-[117px] pb-[100px] gap-[9px] text-center text-xs text-cornflowerblue-100 font-urbanist mq450:pt-5 mq450:px-5 mq450:pb-[42px] mq450:box-border mq750:pt-[23px] mq750:px-[58px] mq750:pb-[65px] mq750:box-border">
        <header className="self-stretch flex flex-row items-center justify-start pt-2.5 px-0 pb-[30px] gap-2.5 mq675:flex-wrap">
          <div className="h-[53px] rounded-[50px] overflow-hidden flex flex-row items-center justify-center">
            <button className="cursor-pointer border-lightgray border-solid border-[0.5px] py-[9px] px-[19px] bg-cornflowerblue-100 rounded-[60px] overflow-hidden flex flex-row items-center justify-center gap-3 hover:bg-cornflowerblue-200 hover:border-silver hover:border-solid hover:hover:border-[0.5px] hover:box-border">
              <div className="relative text-[15px] tracking-[-0.01em] font-medium font-urbanist text-white text-left">
                All
              </div>
              <Image
                className="w-6 relative h-6 hidden"
                width={24}
                height={24}
                sizes="100vw"
                alt=""
                src="/send-icon.svg"
              />
            </button>
          </div>
          <div className="h-[53px] rounded-[50px] overflow-hidden flex flex-row items-center justify-center">
            <button className="cursor-pointer border-lightgray border-solid border-[0.5px] py-[9px] px-[19px] bg-cornflowerblue-400 rounded-[60px] overflow-hidden flex flex-row items-center justify-center gap-[11px] hover:bg-cornflowerblue-300 hover:border-silver hover:border-solid hover:hover:border-[0.5px] hover:box-border">
              <div className="relative text-[15px] tracking-[-0.01em] font-medium font-urbanist text-white text-left">
                Web
              </div>
              <Image
                className="w-[18px] max-h-full"
                width={18}
                height={20}
                sizes="100vw"
                alt=""
                src="/icon-placeholder4.svg"
              />
            </button>
          </div>
          <div className="h-[53px] rounded-[50px] overflow-hidden flex flex-row items-center justify-center">
            <button className="cursor-pointer border-lightgray border-solid border-[0.5px] py-[9px] px-[19px] bg-cornflowerblue-400 rounded-[60px] overflow-hidden flex flex-row items-center justify-center gap-3 hover:bg-cornflowerblue-300 hover:border-silver hover:border-solid hover:hover:border-[0.5px] hover:box-border">
              <div className="relative text-[15px] tracking-[-0.01em] font-medium font-urbanist text-white text-left">
                Mobile
              </div>
              <Image
                className="w-[11px] max-h-full"
                width={11}
                height={20}
                sizes="100vw"
                alt=""
                src="/icon-placeholder3.svg"
              />
            </button>
          </div>
          <div className="h-[53px] rounded-[50px] overflow-hidden flex flex-row items-center justify-center">
            <button className="cursor-pointer border-lightgray border-solid border-[0.5px] py-[9px] px-[19px] bg-cornflowerblue-400 rounded-[60px] overflow-hidden flex flex-row items-center justify-center gap-3 hover:bg-cornflowerblue-300 hover:border-silver hover:border-solid hover:hover:border-[0.5px] hover:box-border">
              <div className="relative text-[15px] tracking-[-0.01em] font-medium font-urbanist text-white text-left">
                Systems
              </div>
              <Image
                className="w-5 max-h-full"
                width={20}
                height={20}
                sizes="100vw"
                alt=""
                src="/icon-placeholder2.svg"
              />
            </button>
          </div>
        </header>
        <section className="w-[1176px] h-[508px] flex flex-row items-center justify-between gap-0 text-left text-5xl text-cornflowerblue-100 font-urbanist">
          <div className="w-[588px] flex flex-col items-start justify-start gap-8 mq675:gap-4">
            <h1 className="m-0 self-stretch relative text-[length:inherit] leading-[72px] font-bold font-[inherit] mq450:text-[29px] mq450:leading-[43px] mq750:text-[38px] mq750:leading-[58px]">
              ChatNPT
            </h1>
            <h1 className="m-0 self-stretch relative text-2xl leading-[150%] font-normal font-[inherit] text-white mq450:text-[19px] mq450:leading-[29px]">
              An AI-powered assistant integrated with NKT’s internal API,
              enabling smarter queries and analytics through Large Language
              Models.
            </h1>
          </div>
          <div className="flex flex-row items-end justify-end relative gap-2.5">
            <Image
              className="w-[416px] relative h-[508px] z-[0]"
              width={416}
              height={508}
              sizes="100vw"
              alt=""
              src="/cards-container.svg"
            />
            <Image
              className="h-[114px] w-[114px] !!m-[0 important] absolute top-[394px] left-[302px] rounded-[57px] object-contain z-[1]"
              loading="lazy"
              width={114}
              height={114}
              sizes="100vw"
              alt=""
              src="/git-button@2x.png"
            />
          </div>
        </section>
        <div className="self-stretch flex flex-row items-center justify-center pt-5 px-0 pb-0 gap-8 mq450:gap-4 mq450:flex-wrap">
          <Image
            className="h-[15.3px] w-[7.6px] relative object-contain"
            loading="lazy"
            width={7.6}
            height={15.3}
            sizes="100vw"
            alt=""
            src="/prev-button.svg"
          />
          <div className="h-[26.7px] w-[291.6px] flex flex-row items-start justify-start gap-[22.9px]">
            <div className="h-[26.7px] w-[26.7px] relative">
              <button className="cursor-pointer [border:none] p-0 bg-white absolute top-[0px] left-[0px] rounded-[50%] w-full h-full" />
              <div className="absolute top-[6.7px] left-[6.7px] leading-[12.4px] flex items-end justify-center z-[1]">
                1
              </div>
            </div>
            <div className="flex flex-col items-start justify-start pt-[6.7px] px-0 pb-0 text-dimgray">
              <div className="flex flex-row items-start justify-start gap-6">
                <div className="w-3.5 relative flex items-end justify-center">
                  2
                </div>
                <div className="w-3.5 relative flex items-end justify-center">
                  3
                </div>
                <div className="w-3.5 relative flex items-end justify-center">
                  4
                </div>
                <div className="w-3.5 relative flex items-end justify-center">
                  5
                </div>
                <div className="w-3.5 relative flex items-end justify-center">
                  6
                </div>
                <div className="w-3.5 relative flex items-end justify-center">
                  7
                </div>
                <div className="w-3.5 relative flex items-end justify-center">
                  8
                </div>
              </div>
            </div>
          </div>
          <Image
            className="h-[15.3px] w-[7.6px] relative"
            loading="lazy"
            width={7.6}
            height={15.3}
            sizes="100vw"
            alt=""
            src="/next-button.svg"
          />
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;
