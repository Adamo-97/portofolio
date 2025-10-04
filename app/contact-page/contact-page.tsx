"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import PhotoSocialContainer from "@/components/contact/photo-social-container";
import Header from "@/components/header";
import EmailForm from "@/components/contact/email-form";
import Footer from "@/components/footer";
import Stage16x9 from "@/components/Stage16x9";

const ContactPage: NextPage = () => {
  const handleSend = useCallback(() => {}, []);

  return (
    <div className="w-full min-h-screen relative [background:linear-gradient(128deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_linear-gradient(74.23deg,_rgba(24,_161,_253,_0.05),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col">
      <Header />

      {/* Center the stage within the available viewport */}
      <main className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-8 lg:px-12">
        <div className="w-full h-[min(78svh,calc(100svh-120px))] min-h-0 min-w-0">
          <Stage16x9
            baseW={1400}
            baseH={788}
            className="w-full h-full overflow-hidden"
          >
            <div className="w-full h-full p-10">
              {/* Make columns fill the full stage height */}
              <section className="grid h-full grid-cols-12 gap-8 items-stretch">
                {/* Left: photo — fill height and center */}
                <div className="col-span-12 lg:col-span-5 h-full grid place-items-center">
                  <PhotoSocialContainer className="w-full h-full" />
                </div>

                {/* Right: form — fill height and center */}
                <div className="col-span-12 lg:col-span-7 h-full grid place-items-center">
                  <EmailForm onSend={handleSend} className="w-full h-full" />
                </div>
              </section>
            </div>
          </Stage16x9>
        </div>
      </main>

      <Footer year={2025} owner="Adam Abdullah" logoSrc="/logo1.svg" />
    </div>
  );
};

export default ContactPage;
