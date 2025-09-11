import type { NextPage } from "next";
import Image from "next/image";
import DowanloadCvButton from "./dowanload-cv-button";

export type MainPicPlaceholderType = {
  className?: string;
};

const MainPicPlaceholder: NextPage<MainPicPlaceholderType> = ({
  className = "",
}) => {
  return (
    <section
      className={`w-[952.4px] flex-1 flex flex-row items-end justify-start pt-[220px] pb-0 pl-[83px] pr-[57px] box-border relative z-[2] mt-[-96px] mq750:pl-[41px] mq750:pr-7 mq750:box-border ${className}`}
    >
      <div className="h-[405.9px] w-[811.8px] relative shrink-0 overflow-hidden flex items-center justify-center z-[0]">
        <Image
          className="h-full w-full shrink-0 object-cover absolute left-[0px] top-[0px] [transform:scale(1.616)]"
          width={811.8}
          height={405.9}
          sizes="100vw"
          alt=""
          src="/Ellipse-2.svg"
        />
      </div>
      <section className="flex flex-row items-start justify-start pt-[531px] pb-[43px] pl-[85px] pr-[84px] bg-[url('/image-placeholder@2x.png')] bg-cover bg-no-repeat bg-[top] shrink-0 z-[1] ml-[-637.7px] relative mq450:pl-5 mq450:pr-5 mq450:box-border">
        <Image
          className="w-[437px] relative max-h-full object-cover hidden"
          width={437}
          height={656}
          sizes="100vw"
          alt=""
          src="/image-placeholder@2x.png"
        />
        <DowanloadCvButton
          downloadCV="Download CV"
          iconPlaceholder="/icon-placeholder.svg"
        />
      </section>
      <Image
        className="w-[197.2px] !!m-[0 important] absolute top-[323px] left-[-26.8px] rounded-[10px] max-h-full object-contain z-[3]"
        width={197.2}
        height={153.5}
        sizes="100vw"
        alt=""
        src="/experience-section@2x.png"
      />
      <Image
        className="w-[273.2px] !!m-[0 important] absolute top-[132px] left-[717.2px] rounded-[10px] max-h-full object-contain z-[4]"
        loading="lazy"
        width={273.2}
        height={190.8}
        sizes="100vw"
        alt=""
        src="/bcs-se@2x.png"
      />
    </section>
  );
};

export default MainPicPlaceholder;
