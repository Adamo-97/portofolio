// components/SkillBadge.tsx
export default function SkillBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
      {label}
    </span>
  );
}
