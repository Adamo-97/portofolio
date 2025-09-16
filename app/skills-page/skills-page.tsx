// app/skills/skills-page.tsx
import Header from "../../components/header";
import SkillOrbit from "../../components/skills/SkillOrbit";

export default function SkillsPage() {
  return (
    <div className="w-full min-h-[100svh] bg-black text-white">
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-10">
        <SkillOrbit />
      </main>
    </div>
  );
}
