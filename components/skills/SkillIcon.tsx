// components/skills/SkillIcon.tsx
"use client";

type UISkill = {
  name: string;
  src: string;
  xOffset?: number;
  yOffset?: number;
};

export default function SkillIcon({ s }: { s: UISkill }) {
  const tx = s.xOffset ?? 0;
  const ty = s.yOffset ?? 0;

  return (
    <div
      role="img"
      aria-label={s.name}
      className="w-full h-full min-h-0 overflow-hidden"
      style={{
        backgroundImage: `url(${s.src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `calc(50% + ${tx}%) calc(50% + ${ty}%)`,
        backgroundSize: "contain",
      }}
    />
  );
}
