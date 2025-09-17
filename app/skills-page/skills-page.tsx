import Header from "../../components/header";
import SkillsGrid from "../../components/skills/SkillsGrid";


export default function Page() {
  return (
    <div className="w-full min-h-[100svh] bg-black text-white overflow-hidden relative">
      <Header />
      <SkillsGrid />
    </div>
  );
}