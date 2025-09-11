"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Nr1 from "../../components/nr1";
import Nr2 from "../../components/nr2";

const RoadmapPage: NextPage = () => {
  const router = useRouter();

  const onHomeButtonContainerClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const onSkillsButtonContainerClick = useCallback(() => {
    router.push("/skills-page");
  }, [router]);

  const onProjectsButtonContainerClick = useCallback(() => {
    router.push("/projects-page");
  }, [router]);

  const onContactButtonContainerClick = useCallback(() => {
    router.push("/contact-page");
  }, [router]);

  return (
    <div className="w-full h-[900px] relative [background:linear-gradient(52deg,_rgba(24,_161,_253,_0.25),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col items-start justify-start gap-[30px] min-w-[1000px] leading-[normal] tracking-[normal]">
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
          <div className="border-cornflowerblue-100 border-solid border-b-[1px] flex flex-row items-center justify-center pt-2.5 px-[9px] pb-2">
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Roadmap
            </h3>
          </div>
          <div
            className="flex flex-row items-center justify-center p-2.5 cursor-pointer"
            onClick={onProjectsButtonContainerClick}
          >
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
      <main className="self-stretch flex-1 overflow-hidden flex flex-col items-center justify-center py-[73px] px-0 relative mq450:pt-[31px] mq450:pb-[31px] mq450:box-border mq750:pt-[47px] mq750:pb-[47px] mq750:box-border">
        <div className="self-stretch flex-1 relative max-w-full max-h-full overflow-hidden flex items-center justify-center z-[0]">
          <Image
            className="self-stretch flex-1 overflow-hidden object-cover absolute left-[0px] top-[9px] w-full h-full [transform:scale(1)]"
            width={1440}
            height={670}
            sizes="100vw"
            alt=""
            src="/street-illustration.svg"
          />
        </div>
        <Nr1
          logoContainer="/logo-container2.svg"
          pinBody="/pin-body.svg"
          descriptionPlaceholdr="Supporting people with disabilities, developing empathy, patience, and teamwork in a care-focused environment."
        />
        <Nr2
          descriptionPlaceholdr="Started studying at BTH, focusing on software engineering, system design, and web development."
          pinBody="/pin-body.svg"
          logoContainer="/logo-container4.svg"
        />
        <Nr1
          nr4Top="45px"
          nr4Left="709px"
          logoContainer="/logo-container.svg"
          pinBody="/pin-body.svg"
          descriptionPlaceholdr="Created a gaming channel as a creative outlet and to build a community around shared interests."
        />
        <Nr2
          nr3Top="271px"
          nr3Left="779px"
          titlePlaceholderMargin="0"
          descriptionPlaceholdr="Collaborated with NKT to integrate a (LLM) into their internal API, enhancing data access and analytics workflows."
          pinBody="/pin-body.svg"
          logoContainer="/logo-container3.svg"
        />
      </main>
    </div>
  );
};

export default RoadmapPage;
