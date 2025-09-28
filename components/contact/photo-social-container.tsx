import type { NextPage } from "next";
import Image from "next/image";

export type PhotoSocialContainerType = {
  className?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  youtubeUrl?: string;
};

const PhotoSocialContainer: NextPage<PhotoSocialContainerType> = ({
  className = "",
  linkedinUrl = "#",
  githubUrl = "https://github.com/Adamo-97",
  youtubeUrl = "#",
}) => {
  return (
    <section
      className={`h-[737px] overflow-hidden flex flex-col items-center justify-end pt-0 px-[22px] pb-[30px] box-border relative gap-5 max-w-full text-left text-xl text-black font-urbanist mq450:min-w-full mq750:h-auto mq825:flex-1 mq825:pr-0 mq825:box-border ${className}`}
    >
      {/* Card wrapper: same position/size */}
      <div
        className="w-[460px] h-[660px] !!m-[0 important] absolute
                   top-[calc(50%_-_291.5px)] left-[calc(50%_-_240px)]
                   z-[0]"
      >
        <div className="relative w-[460px] h-[660px] overflow-hidden">
          {/* Frame on top */}
          <Image
            className="absolute inset-0 z-[2] pointer-events-none"
            width={460}
            height={660}
            sizes="100vw"
            alt=""
            src="/card-container.svg"
          />

          {/* Photo crop window: 19,18 → 441,450 (422×432) */}
          <div
            className="absolute z-[1] overflow-hidden w-[422px] h-[432px]"
            style={{ left: 19, top: 18 }}
          >
            {/* Padding + object-contain => slightly smaller image, aligned from top */}
            <div className="w-full h-full pt-3 px-3">
              <Image
                src="/photo-thumbsup@2x.png"
                alt=""
                width={416}   // logical size; visual sizing controlled by CSS below
                height={426}
                className="w-full h-full object-contain object-top"
                sizes="100vw"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text area starts exactly below the window (y = 450) */}
          <div
            className="absolute z-[3] text-left" // keep above frame so it's visible
            style={{ left: 19, right: 19, top: 450, paddingTop: 14 }}
          >
            <div className="space-y-5">
              <p className="m-0 font-semibold text-cornflowerblue-100">
                #Thanks for stopping by!
              </p>
              <p className="m-0 text-base">
                I’m open to new opportunities, collaborations, or just a chat
                about tech and design. Feel free to drop me a message through
                the form — I’ll get back to you as soon as I can.
              </p>
              <div className="text-[15px] font-medium text-cornflowerblue-100">
                You can also find me here:
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer so the parent doesn’t clip the absolute card */}
      <div className="w-[460px] h-0 pointer-events-none" aria-hidden />

      {/* Socials row — now clickable */}
      <div className="self-stretch flex flex-row items-center justify-center flex-wrap content-center gap-[30px] z-[2]">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="inline-flex"
        >
          <Image
            className="w-[30px] relative rounded-[5px] max-h-full"
            loading="lazy"
            width={30}
            height={30}
            sizes="100vw"
            alt="LinkedIn"
            src="/linkin-logo.svg"
          />
        </a>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="inline-flex"
        >
          <Image
            className="w-[31px] relative max-h-full"
            loading="lazy"
            width={31}
            height={30}
            sizes="100vw"
            alt="GitHub"
            src="/github-logo.svg"
          />
        </a>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="inline-flex"
        >
          <Image
            className="w-[43px] relative max-h-full"
            loading="lazy"
            width={43}
            height={30}
            sizes="100vw"
            alt="YouTube"
            src="/yt-logo.svg"
          />
        </a>
      </div>
    </section>
  );
};

export default PhotoSocialContainer;
