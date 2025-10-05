// app/contact-page/page.tsx
"use client";
import type { NextPage } from "next";
import { useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants, Transition } from "framer-motion";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Stage16x9 from "@/components/Stage16x9";
import PhotoSocialContainer from "@/components/contact/photo-social-container";
import EmailForm from "@/components/contact/email-form";

const ContactPage: NextPage = () => {
  const handleSend = useCallback(() => {}, []);
  const prefersReducedMotion = useReducedMotion();

  const springy: Transition = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 };
  const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } } };
  const leftCol: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -32, scale: prefersReducedMotion ? 1 : 0.98 },
    show:   { opacity: 1, x: 0, scale: 1, transition: springy },
  };
  const rightCol: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : 32, scale: prefersReducedMotion ? 1 : 0.98 },
    show:   { opacity: 1, x: 0, scale: 1, transition: springy },
  };

  return (
    <div className="w-full min-h-screen relative [background:linear-gradient(128deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_linear-gradient(74.23deg,_rgba(24,_161,_253,_0.05),_rgba(0,_0,_0,_0)),_#000] overflow-hidden flex flex-col">
      <Header />

      <main className="flex-1 min-h-0 px-4 sm:px-6">
        {/* Mobile block */}
        <div className="lg:hidden py-6 grid place-items-center">
          <div className="w-full">
            <EmailForm
              onSend={handleSend}
              showMobileIcons
              className="w-full mx-auto max-w-[520px] sm:max-w-[560px] p-3 sm:p-4"
            />
          </div>
        </div>

        {/* DESKTOP/TABLET */}
        <div className="hidden lg:flex min-h-0 items-center justify-center px-4 lg:px-12">
          <div className="w-full h-[min(78svh,calc(100svh-120px))] min-h-0 min-w-0">
            <Stage16x9 baseW={1400} baseH={788} className="w-full h-full overflow-visible">
              <div className="w-full h-full p-8 lg:p-10">
                <motion.section
                  variants={parent}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="grid h-full grid-cols-12 items-stretch gap-12 xl:gap-16 2xl:gap-20 overflow-visible"
                >
                  <motion.div
                    variants={leftCol}
                    className="col-span-12 lg:col-span-5 2xl:col-span-5 h-full grid place-items-center overflow-visible z-10"
                  >
                    <PhotoSocialContainer className="w-full h-full max-w-none" />
                  </motion.div>

                {/* Right: form — 80% of column (photo stays 100%) */}
                  <motion.div
                    variants={rightCol}
                    className="
                      col-span-12 lg:col-span-7 2xl:col-span-7
                      h-full grid place-items-center
                      overflow-visible z-0
                    "
                  >
                    {/* this wrapper sets the height ratio */}
                    <div className="w-full h-[80%] min-h-[420px] max-h-full">
                      <EmailForm
                        onSend={handleSend}
                        className="w-full h-full max-w-[980px] xl:max-w-[1040px] 2xl:max-w-[1120px]"
                      />
                    </div>
                  </motion.div>

                </motion.section>
              </div>
            </Stage16x9>
          </div>
        </div>
      </main>

      <Footer year={2025} owner="Adam Abdullah" logoSrc="/logo1.svg" />
    </div>
  );
};

export default ContactPage;
