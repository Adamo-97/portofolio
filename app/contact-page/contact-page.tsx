"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import PhotoSocialContainer from "@/components/contact/photo-social-container";
import NameContainer from "@/components/contact/name-container";
import Header from "@/components/header";
import SendButton from "@/components/contact/SendButton";
const ContactPage: NextPage = () => {
  return (
    <div className="w-full h-[900px] relative [background:linear-gradient(128deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_linear-gradient(74.23deg,_rgba(24,_161,_253,_0.05),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col items-start justify-start gap-[30px] min-w-[1000px] leading-[normal] tracking-[normal]">
      <Header />
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
            <SendButton iconSize={28} />
          </section>
        </section>
        <div className="self-stretch flex flex-row items-center justify-between pt-0 px-0 pb-5 gap-0">
          <div className="w-[285px] relative tracking-[-0.5px] leading-[38px] flex items-center shrink-0">
            © 2025 Adam Abdullah, All Rights Reserved
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
