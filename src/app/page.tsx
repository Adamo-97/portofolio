import Image from "next/image";
import Section from "@/components/Section";
import Roadmap from "@/components/Roadmap";
import { ROADMAP } from "@/data/roadmap";
import SkillBadge from "@/components/Skillbadge";
import profile from "@/data/profile.json"; // <--- import JSON

export default function Page() {
  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* HERO */}
      <Section className="pt-16">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6 h-20 w-20 ">
            <Image
              src={profile.logo}
              alt="Logo"
              fill
              className="object-contain invert-0 dark:invert"
              priority
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="mt-2 max-w-2xl text-balance opacity-80">{profile.tagline}</p>

          {/* quick links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </a>
            <a
              href={`mailto:${profile.links.email}`}
              className="underline underline-offset-4"
            >
              Email
            </a>
            <a
              href={profile.links.contact}
              className="underline underline-offset-4"
            >
              Contact
            </a>
          </div>
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills">
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <SkillBadge key={s} label={s} />
          ))}
        </div>
      </Section>

      {/* ROADMAP */}
      <Section id="roadmap" title="Interactive Roadmap">
        <Roadmap items={ROADMAP} />
      </Section>

      {/* CONTACT / FOOTER */}
      <Section id="contact" title="Contact">
        <div className="max-w-2xl">
          <p className="opacity-90">Interested in collaborating or have a role in mind? Reach out:</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <strong>Email:</strong>{" "}
              <a className="underline underline-offset-4" href={`mailto:${profile.links.email}`}>
                {profile.links.email}
              </a>
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a
                className="underline underline-offset-4"
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
              >
                {profile.links.github.replace("https://", "")}
              </a>
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a
                className="underline underline-offset-4"
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                (add your profile)
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-xs opacity-60">{profile.footer}</p>
      </Section>
    </main>
  );
}
