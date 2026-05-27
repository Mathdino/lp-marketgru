"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

type StatsCountProps = {
  stats: Stat[];
  title?: string;
  showDividers?: boolean;
  className?: string;
  duration?: number;
};

function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
  inView,
}: {
  to: number;
  prefix?: string | undefined;
  suffix?: string | undefined;
  duration?: number;
  inView: boolean;
}): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const formatted = Number.isInteger(to)
    ? Math.round(value).toLocaleString("pt-BR")
    : value.toFixed(1);

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsCount({
  stats,
  title,
  showDividers = true,
  className,
  duration = 1.8,
}: StatsCountProps): ReactNode {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapperRef, { once: true, margin: "-80px" });

  return (
    <div ref={wrapperRef} className={cn("flex flex-col gap-8", className)}>
      {title && (
        <h3 className="text-foreground/85 [font-family:var(--font-gohan)] text-[1.25rem] leading-[1.15] tracking-wider uppercase sm:text-[1.5rem]">
          {title}
        </h3>
      )}
      <div
        className={cn(
          "relative grid gap-6 sm:gap-8",
          stats.length === 4
            ? "grid-cols-1 sm:grid-cols-2"
            : stats.length === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {/* Linhas divisórias contínuas — apenas no desktop e quando há 4 itens */}
        {showDividers && stats.length === 4 && (
          <>
            {/* Linha vertical centralizada (full-height) */}
            <span
              aria-hidden="true"
              className="bg-foreground/10 pointer-events-none absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 sm:block"
            />
            {/* Linha horizontal centralizada (full-width) */}
            <span
              aria-hidden="true"
              className="bg-foreground/10 pointer-events-none absolute top-1/2 right-0 left-0 hidden h-px -translate-y-1/2 sm:block"
            />
          </>
        )}
        {/* Divider único para 3 itens (linha única) */}
        {showDividers &&
          stats.length === 3 &&
          [1, 2].map((col) => (
            <span
              key={col}
              aria-hidden="true"
              className="bg-foreground/10 pointer-events-none absolute top-0 bottom-0 hidden w-px sm:block"
              style={{ left: `${(col / 3) * 100}%` }}
            />
          ))}

        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 sm:px-4 sm:py-2">
            <div className="text-foreground [font-family:var(--font-gohan)] text-[2.75rem] leading-none tracking-tight sm:text-[3.25rem]">
              <CountUp
                to={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                duration={duration}
                inView={inView}
              />
            </div>
            <p className="text-foreground/60 [font-family:var(--font-poppins)] text-[14px] leading-[1.4] tracking-tight sm:text-[15px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
