"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SkillsPage: NextPage = () => {
  const router = useRouter();

  const onHomeButtonContainerClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const onRoadmapButtonContainerClick = useCallback(() => {
    router.push("/roadmap-page");
  }, [router]);

  const onProjectsButtonContainerClick = useCallback(() => {
    router.push("/projects-page");
  }, [router]);

  const onContactButtonContainerClick = useCallback(() => {
    router.push("/contact-page");
  }, [router]);

  return (
    <div className="w-full h-[900px] relative [background:linear-gradient(139.23deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_#000] overflow-hidden flex flex-col items-start justify-start gap-[30px] min-w-[1000px] leading-[normal] tracking-[normal]">
      <header className="self-stretch flex flex-row items-center justify-between pt-2.5 px-[120px] pb-0 gap-0 mq450:pl-5 mq450:pr-5 mq450:box-border mq750:pl-[60px] mq750:pr-[60px] mq750:box-border">
        <Image
          className="w-[42px] relative max-h-full"
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
          <div className="border-cornflowerblue-100 border-solid border-b-[1px] flex flex-row items-center justify-center pt-2.5 px-2.5 pb-2">
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
      <footer className="self-stretch flex-1 overflow-hidden flex flex-col items-center justify-start pt-10 px-0 pb-0 relative text-left text-3xl text-white font-urbanist">
        <div className="w-[1440px] hidden flex-row items-center justify-center pt-0 px-0 pb-[30px] box-border gap-2.5 z-[0]">
          <Image
            className="self-stretch w-[15px] max-h-full object-contain"
            width={15}
            height={30}
            sizes="100vw"
            alt=""
            src
          />
          <div className="relative tracking-[-0.01em] leading-[100%] font-semibold mq450:text-lg mq450:leading-[18px] mq750:text-2xl mq750:leading-6">
            {`A toolkit shaped by `}curiosity{` and `}continuous learning
          </div>
          <Image
            className="self-stretch w-[15px] max-h-full"
            width={15}
            height={30}
            sizes="100vw"
            alt=""
            src="/icon-placeholder1.svg"
          />
        </div>
        <section className="self-stretch rounded-t-none rounded-b-[20px] flex flex-row items-start justify-center flex-wrap content-start py-5 px-[200px] gap-10 z-[1] mq450:pl-5 mq450:pr-5 mq450:box-border mq750:gap-5 mq750:pl-[100px] mq750:pr-[100px] mq750:box-border">
          <Image
            className="w-[70px] relative max-h-full"
            loading="lazy"
            width={70}
            height={50}
            sizes="100vw"
            alt=""
            src="/docker-logo.svg"
          />
          <Image
            className="w-[34px] relative max-h-full"
            width={34}
            height={50}
            sizes="100vw"
            alt=""
            src="/figma-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/js-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/python-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/lottie-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/git-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/Logo-Set.svg"
          />
          <Image
            className="w-[51px] relative max-h-full"
            loading="lazy"
            width={51}
            height={50}
            sizes="100vw"
            alt=""
            src="/adobe-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/nextjs-logo.svg"
          />
          <Image
            className="w-10 relative max-h-full object-cover"
            loading="lazy"
            width={40}
            height={50}
            sizes="100vw"
            alt=""
            src="/flutter-logo@2x.png"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/swift-logo.svg"
          />
          <Image
            className="w-[22px] relative max-h-full"
            width={22}
            height={50}
            sizes="100vw"
            alt=""
            src="/mongo-logo.svg"
          />
          <Image
            className="w-[37px] relative max-h-full"
            width={37}
            height={50}
            sizes="100vw"
            alt=""
            src="/sql-logo.svg"
          />
          <Image
            className="w-11 relative max-h-full"
            width={44}
            height={50}
            sizes="100vw"
            alt=""
            src="/node-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/css-logo.svg"
          />
          <Image
            className="w-[58px] relative max-h-full"
            loading="lazy"
            width={58}
            height={50}
            sizes="100vw"
            alt=""
            src="/vue-logo.svg"
          />
          <Image
            className="w-11 relative max-h-full"
            width={44}
            height={50}
            sizes="100vw"
            alt=""
            src="/graphql-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/bash-logo.svg"
          />
          <Image
            className="w-11 relative max-h-full"
            width={44}
            height={50}
            sizes="100vw"
            alt=""
            src="/c-sharp-logo.svg"
          />
          <Image
            className="w-[42px] relative max-h-full"
            width={42}
            height={50}
            sizes="100vw"
            alt=""
            src="/clickup-logo.svg"
          />
          <Image
            className="w-[45px] relative max-h-full"
            width={45}
            height={50}
            sizes="100vw"
            alt=""
            src="/c-logo.svg"
          />
          <Image
            className="w-11 relative max-h-full"
            width={44}
            height={50}
            sizes="100vw"
            alt=""
            src="/c-plus-logo.svg"
          />
          <Image
            className="w-11 relative max-h-full"
            width={44}
            height={50}
            sizes="100vw"
            alt=""
            src="/html-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/visualstudio-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/trello-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/android-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/jetbrains-logo.svg"
          />
          <Image
            className="w-11 relative max-h-full"
            width={44}
            height={50}
            sizes="100vw"
            alt=""
            src="/pytest-logo.svg"
          />
          <Image
            className="w-[50px] relative max-h-full"
            loading="lazy"
            width={50}
            height={50}
            sizes="100vw"
            alt=""
            src="/cypress-logo.svg"
          />
        </section>
        <Image
          className="self-stretch max-w-full overflow-hidden max-h-full z-[2]"
          width={1440}
          height={458.8}
          sizes="100vw"
          alt=""
          src="/shapes-placeholder.svg"
        />
        <h3 className="!!m-[0 important] w-[518px] absolute bottom-[146px] left-[calc(50%_-_259px)] text-[length:inherit] tracking-[0.02em] leading-[31px] flex italic font-medium font-[inherit] text-center items-center justify-center z-[3] mq450:text-lg mq450:leading-[19px] mq750:text-2xl mq750:leading-[25px]">
          “I’m not just learning tools — I’m learning how to think differently
          with each one.”
        </h3>
      </footer>
    </div>
  );
};

export default SkillsPage;
