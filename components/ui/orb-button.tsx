"use client";

import * as React from "react";
import { ChevronRight, MoveRight } from "lucide-react";

import { cn } from "@/lib/utils";

type OrbButtonSize = "sm" | "default" | "lg";

export interface OrbButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon?: React.ComponentType<{ className?: string }>;
  icon?: React.ReactNode;
  dotClassName?: string;
  size?: OrbButtonSize;
}

const buttonSizeClasses: Record<OrbButtonSize, string> = {
  sm: "h-9 pl-4 pr-4 text-xs gap-3 hover:pl-1.5 hover:gap-2 data-[touched=true]:pl-1.5 data-[touched=true]:gap-2",
  default:
    "h-11 pl-4 pr-4 text-sm gap-3 hover:pl-1.5 hover:gap-2 data-[touched=true]:pl-1.5 data-[touched=true]:gap-2",
  lg: "h-13 pl-5 pr-5 text-base gap-3 hover:pl-2 hover:gap-2 data-[touched=true]:pl-2 data-[touched=true]:gap-2",
};

const dotExpandedClasses: Record<OrbButtonSize, string> = {
  sm: "group-hover:h-6 group-hover:w-6 group-data-[touched=true]:h-6 group-data-[touched=true]:w-6",
  default:
    "group-hover:h-8 group-hover:w-8 group-data-[touched=true]:h-8 group-data-[touched=true]:w-8",
  lg: "group-hover:h-9 group-hover:w-9 group-data-[touched=true]:h-9 group-data-[touched=true]:w-9",
};

const OrbButton = React.forwardRef<HTMLButtonElement, OrbButtonProps>(
  (
    {
      className,
      size = "default",
      children,
      Icon,
      icon,
      dotClassName,
      type = "button",
      ...props
    },
    ref
  ) => {
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    const handleTouchStart = (): void => {
      if (buttonRef.current) buttonRef.current.dataset.touched = "true";
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (buttonRef.current) buttonRef.current.dataset.touched = "false";
      }, 1500);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const resolvedIcon = Icon ? (
      <MoveRight className="h-3 w-3" />
    ) : icon ? (
      icon
    ) : (
      <ChevronRight className="h-3 w-3" />
    );

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type={type}
        onTouchStart={handleTouchStart}
        className={cn(
          "focus-ring group relative inline-flex items-center overflow-hidden rounded-full bg-transparent font-bold whitespace-nowrap transition-all duration-500 hover:border-black/60 disabled:pointer-events-none disabled:opacity-50 data-[touched=true]:border-black/60 dark:border-white/30 dark:hover:border-white/60 dark:data-[touched=true]:border-white/60",
          buttonSizeClasses[size],
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "relative flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full bg-black transition-all duration-500 dark:bg-white",
            dotExpandedClasses[size],
            dotClassName
          )}
        >
          <span className="flex scale-50 items-center justify-center text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-data-[touched=true]:scale-100 group-data-[touched=true]:opacity-100 dark:text-black">
            {resolvedIcon}
          </span>
        </span>
        <span className="relative z-10 tracking-wide text-black transition-transform duration-500 group-hover:translate-x-1 group-data-[touched=true]:translate-x-1 dark:text-white">
          {children}
        </span>
      </button>
    );
  }
);

OrbButton.displayName = "OrbButton";

export { OrbButton };
