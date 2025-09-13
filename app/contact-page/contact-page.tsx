"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PhotoSocialContainer from "../../components/photo-social-container";
import NameContainer from "../../components/name-container";
import DowanloadCvButton from "../../components/home/download-cv-button";

const ContactPage: NextPage = () => {
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

  const onProjectsButtonContainerClick = useCallback(() => {
    router.push("/projects-page");
  }, [router]);

  return (
    <div className="w-full h-[900px] relative [background:linear-gradient(128deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_linear-gradient(74.23deg,_rgba(24,_161,_253,_0.05),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col items-start justify-start gap-[30px] min-w-[1000px] leading-[normal] tracking-[normal]">
      <header className="self-stretch flex flex-row items-center justify-between pt-2.5 px-[120px] pb-0 gap-0 mq450:pl-[60px] mq450:pr-[60px] mq450:box-border mq750:pl-5 mq750:pr-5 mq750:box-border">
        <Image
          className="w-[42px] relative max-h-full"
          loading="lazy"
          width={42}
          height={44}
          sizes="100vw"
          alt=""
          src="/logo.svg"
        />
        <nav className="m-0 flex flex-row items-center justify-start gap-5 text-center text-xl text-white font-urbanist mq450:hidden">
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
          <div
            className="flex flex-row items-center justify-center p-2.5 cursor-pointer"
            onClick={onProjectsButtonContainerClick}
          >
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Projects
            </h3>
          </div>
          <div className="border-cornflowerblue-100 border-solid border-b-[1px] flex flex-row items-center justify-center pt-2.5 px-[9px] pb-2">
            <h3 className="m-0 relative text-[length:inherit] tracking-[-0.01em] font-bold font-[inherit]">
              Contact
            </h3>
          </div>
        </nav>
      </header>
      <main className="self-stretch flex-1 overflow-hidden flex flex-col items-start justify-between py-0 px-[120px] box-border gap-0 max-w-full text-left text-base text-gray-100 font-urbanist mq450:pl-[60px] mq450:pr-[60px] mq450:box-border mq750:pl-5 mq750:pr-5 mq750:box-border">
        <section className="self-stretch flex flex-row items-center justify-between gap-0 max-w-full mq825:flex-wrap">
          <PhotoSocialContainer />
          <section className="self-stretch flex flex-col items-start justify-center gap-6 max-w-full text-left text-lg text-white font-urbanist mq675:min-w-full mq825:flex-1">
            <div className="flex flex-col items-start justify-start gap-6">
              <div className="w-[600px] flex flex-row items-start justify-center gap-6">
                <NameContainer
                  titlePlaceholder="Your name"
                  placeholder="Name"
                />
                <NameContainer
                  titlePlaceholder="Your email"
                  typeSectionBorder="1px solid rgba(0, 68, 130, 0.1)"
                  placeholder="Email"
                />
              </div>
              <div className="w-[600px] flex flex-col items-start justify-start gap-2.5">
                <b className="relative">Your Message</b>
                <textarea
                  className="border-steelblue border-solid border-[1px] bg-darkslategray h-[280px] w-auto [outline:none] self-stretch shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-2xl box-border flex flex-row items-start justify-start py-4 px-6 font-urbanist font-bold text-lg text-gray-200"
                  placeholder="Message"
                  rows={14}
                  cols={30}
                />
              </div>
            </div>
            <DowanloadCvButton
              dowanloadCvButtonHeight="66px"
              downloadCV="Send Message"
              iconPlaceholder="/send-icon1.svg"
              iconPlaceholderWidth="24px"
              iconPlaceholderHeight="24px"
            />
          </section>
        </section>
        <div className="self-stretch flex flex-row items-center justify-between pt-0 px-0 pb-5 gap-0">
          <div className="w-[285px] relative tracking-[-0.5px] leading-[38px] flex items-center shrink-0">
            © 2025 Adam, All Rights Reserved
          </div>
          <Image
            className="w-7 relative max-h-full"
            width={28}
            height={30}
            sizes="100vw"
            alt=""
            src="/logo1.svg"
          />
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
