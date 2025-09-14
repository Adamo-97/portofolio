"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import Nr1 from "../../components/nr1";
import Nr2 from "../../components/nr2";
import Header from "../../components/header";

const RoadmapPage: NextPage = () => {
  return (
    <div className="w-full h-[900px] relative [background:linear-gradient(52deg,_rgba(24,_161,_253,_0.25),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col items-start justify-start gap-[30px] min-w-[1000px] leading-[normal] tracking-[normal]">
      <Header />
 
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
