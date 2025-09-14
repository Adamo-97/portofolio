import Header from "../../components/header";
import SkillsGrid from "../../components/skills/SkillsGrid";
import { SKILLS } from "../../data/skills";

export default function SkillsPage() {
  return (
    <div className="w-full relative [background:linear-gradient(139.23deg,_rgba(0,_0,_0,_0),_rgba(24,_161,_253,_0.15)),_#000] overflow-hidden flex flex-col items-start justify-start gap-[30px] leading-[normal] tracking-[normal]">
      <Header />
      <main className="self-stretch flex-1 overflow-hidden flex flex-col items-center justify-start pt-8 sm:pt-10 pb-10 text-white font-urbanist">
        <section className="self-stretch flex justify-center px-4 sm:px-[60px] lg:px-[200px]">
          <div className="w-full max-w-[1200px]">
            <SkillsGrid
              items={SKILLS}
              iconHeight={54}
              groupBy="category"
              order={["Build", "Design", "Data", "Workflow"]}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
