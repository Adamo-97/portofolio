import type { NextPage } from "next";
import Image from "next/image";

export type PhotoSocialContainerType = {
  className?: string;
};

const PhotoSocialContainer: NextPage<PhotoSocialContainerType> = ({
  className = "",
}) => {
  return (
    <section
      className={`h-[737px] overflow-hidden flex flex-col items-center justify-end pt-0 px-[22px] pb-[30px] box-border relative gap-5 max-w-full text-left text-xl text-black font-urbanist mq450:min-w-full mq750:h-auto mq825:flex-1 mq825:pr-0 mq825:box-border ${className}`}
    >
      <div className="w-[460px] h-[660px] !!m-[0 important] absolute top-[calc(50%_-_291.5px)] left-[calc(50%_-_240px)] flex flex-col items-start justify-start z-[0]">
        <Image
          className="w-[460px] relative h-[660px] shrink-0 z-[2]"
          width={460}
          height={660}
          sizes="100vw"
          alt=""
          src="/card-container.svg"
        />
        <div className="flex flex-row items-start justify-start py-0 px-[46px] z-[1] mt-[-655px] relative">
          <Image
            className="w-full relative max-h-full h-auto object-cover shrink-0"
            loading="lazy"
            width={368}
            height={470}
            sizes="100vw"
            alt=""
            src="/photo-thumbsup@2x.png"
          />
        </div>
      </div>
      <div className="w-[416px] flex flex-col items-start justify-start gap-5 z-[1]">
        <div className="self-stretch relative">
          <p className="m-0">{`#Thanks for stopping by! `}</p>
          <p className="m-0 text-base">
            I’m open to new opportunities, collaborations, or just a chat about
            tech and design. Feel free to drop me a message through the form —
            I’ll get back to you as soon as I can.
          </p>
        </div>
        <div className="self-stretch relative text-[15px] font-medium text-cornflowerblue-100">
          You can also find me here:
        </div>
      </div>
      <div className="self-stretch flex flex-row items-center justify-center flex-wrap content-center gap-[30px] z-[2]">
        <Image
          className="w-[30px] relative rounded-[5px] max-h-full"
          loading="lazy"
          width={30}
          height={30}
          sizes="100vw"
          alt=""
          src="/linkin-logo.svg"
        />
        <Image
          className="w-[31px] relative max-h-full"
          loading="lazy"
          width={31}
          height={30}
          sizes="100vw"
          alt=""
          src="/github-logo.svg"
        />
        <Image
          className="w-[43px] relative max-h-full"
          loading="lazy"
          width={43}
          height={30}
          sizes="100vw"
          alt=""
          src="/yt-logo.svg"
        />
      </div>
    </section>
  );
};

export default PhotoSocialContainer;
