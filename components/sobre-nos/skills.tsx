import type { ReactNode } from "react";
import SplitText from "@/components/ui/split-text";

const SKILLS = [
  "UI/UX Design",
  "Design Systems",
  "Prototyping & Motion",
  "Frontend Development",
  "TypeScript & React",
  "Interaction Design",
  "Performance Tuning",
  "Accessibility",
  "Visual Identity",
];

export function Skills(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-serif text-[15px] font-semibold tracking-tight text-foreground">
        <SplitText
          text="What I do"
          tag="span"
          className="[font-family:var(--font-gohan)] tracking-wider"
          textAlign="left"
          delay={20}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-20px"
        />
      </h3>
      <div className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5">
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-foreground/8 bg-background px-4 py-2 text-[14px] tracking-tight text-foreground/85 sm:text-[15px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
