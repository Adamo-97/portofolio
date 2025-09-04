// app/page.tsx
// Single-page layout with hero, roadmap, skills, and contact.
// Replace the logo placeholder with your real logo when ready.

import Image from "next/image";
import Section from "@/components/Section";
import Roadmap from "@/components/Roadmap";
import { ROADMAP } from "@/data/roadmap";
import SkillBadge from "@/components/Skillbadge";

export default function Page() {
  return (
    <main className="min-h-dvh bg-white text-black dark:bg-neutral-950 dark:text-white">
      {/* HERO */}
      <Section className="pt-16">
        <div className="flex flex-col items-center text-center">
          {/* TODO: Replace with your logo asset in /public and update src */}
          <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-2xl">
            <Image
              src="/logo-placeholder.png" // put your logo file in /public
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Adam Abdullah</h1>
          <p className="mt-2 max-w-2xl text-balance opacity-80">
            Software Engineering student @ BTH · Full-stack developer · Data & dashboards ·
            UI/UX enthusiast. Building apps, analytics, and automation.
          </p>

          {/* quick links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a
              href="https://github.com/Adamo-97"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </a>
            <a
              href="mailto:adam@example.com"
              className="underline underline-offset-4"
            >
              Email
            </a>
            <a
              href="#contact"
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
          {["Next.js", "TypeScript", "Tailwind", "Node.js", "SQL", "Python", "Cypress", "Figma"].map(
            (s) => (
              <SkillBadge key={s} label={s} />
            )
          )}
        </div>
      </Section>

      {/* ROADMAP */}
      <Section id="roadmap" title="Interactive Roadmap">
        <Roadmap items={ROADMAP} />
      </Section>

      {/* CONTACT / FOOTER */}
      <Section id="contact" title="Contact">
        <div className="max-w-2xl">
          <p className="opacity-90">
            Interested in collaborating or have a role in mind? Reach out:
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <strong>Email:</strong>{" "}
              <a className="underline underline-offset-4" href="mailto:adam@example.com">
                adam@example.com
              </a>
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a className="underline underline-offset-4" href="https://github.com/Adamo-97" target="_blank" rel="noreferrer">
                github.com/Adamo-97
              </a>
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a className="underline underline-offset-4" href="#" target="_blank" rel="noreferrer">
                (add your profile)
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-xs opacity-60">
          © {new Date().getFullYear()} Adam Abdullah. All rights reserved.
        </p>
      </Section>
    </main>
  );
}
