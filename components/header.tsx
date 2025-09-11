"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type HeaderType = {
  className?: string;
};

const Header: NextPage<HeaderType> = ({ className = "" }) => {
  const router = useRouter();

  const onSkillsButtonContainerClick = useCallback(() => {
    router.push("/skills-page");
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
    <header
      className={`self-stretch flex flex-row items-center justify-between pt-2.5 px-[120px] pb-0 gap-0 mq450:pl-5 mq450:pr-5 mq450:box-border mq750:pl-[60px] mq750:pr-[60px] mq750:box-border ${className}`}
    >
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
        <div className="border-cornflowerblue-100 border-solid border-b-[1px] flex flex-row items-center justify-center pt-2.5 px-2.5 pb-2">
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
  );
};

export default Header;
