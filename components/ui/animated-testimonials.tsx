"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  image: string;
  description: string;
  handle: string;
}

interface AnimatedCanopyProps {
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  applyMask?: boolean;
  duration?: number;
  gap?: number;
  className?: string;
}

const AnimatedCanopy = ({
  children,
  vertical = false,
  repeat = 2,
  pauseOnHover = false,
  reverse = false,
  duration = 25,
  gap = 12,
  applyMask = false,
  className,
}: AnimatedCanopyProps) => {
  const keyframe = vertical ? "canopy-vertical" : "canopy-horizontal";

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pauseOnHover) return;
    const track = e.currentTarget.querySelector<HTMLDivElement>("[data-track]");
    if (track) track.style.animationPlayState = "paused";
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pauseOnHover) return;
    const track = e.currentTarget.querySelector<HTMLDivElement>("[data-track]");
    if (track) track.style.animationPlayState = "running";
  };

  return (
    <div
      className={cn(
        "relative flex overflow-hidden p-2",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        data-track
        className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")}
        style={{
          gap: `${gap}px`,
          animation: `${keyframe} ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          ["--gap" as string]: `${gap}px`,
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <React.Fragment key={i}>{children}</React.Fragment>
        ))}
      </div>
      {applyMask && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10",
            vertical
              ? "from-background to-background bg-gradient-to-b via-transparent"
              : "from-background to-background bg-gradient-to-r via-transparent"
          )}
        />
      )}
    </div>
  );
};

const TestimonialCard = ({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string | undefined;
}) => (
  <div
    className={cn(
      "border-foreground/10 bg-foreground/5 mx-2 flex h-36 w-80 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-3 transition-all hover:border-[#f8301a] hover:shadow-[0_0_12px_#f8301a55]",
      className
    )}
  >
    <div className="flex items-start gap-3">
      <div className="border-foreground/20 relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-foreground text-sm font-bold">
            {testimonial.name}
          </span>
          <span className="text-foreground/50 text-xs">
            {testimonial.handle}
          </span>
        </div>
        <p className="text-foreground/75 mt-1 line-clamp-3 text-sm leading-relaxed">
          {testimonial.description}
        </p>
      </div>
    </div>
  </div>
);

export const AnimatedTestimonials = ({
  data,
  className,
  cardClassName,
}: {
  data: Testimonial[];
  className?: string;
  cardClassName?: string;
}) => (
  <div className={cn("w-full overflow-x-hidden", className)}>
    {([false, true, false] as boolean[]).map((reverse, index) => (
      <AnimatedCanopy
        key={index}
        reverse={reverse}
        duration={25 + index * 5}
        gap={12}
        pauseOnHover
        repeat={2}
      >
        {data.map((t) => (
          <TestimonialCard
            key={t.name}
            testimonial={t}
            className={cardClassName}
          />
        ))}
      </AnimatedCanopy>
    ))}
  </div>
);
