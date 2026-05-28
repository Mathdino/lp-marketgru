"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";

import Grainient from "./grainient";

type GrainientBackgroundProps = {
  /** Tailwind class string to override positioning/opacity. */
  className?: string;
  /** Opacity multiplier applied to the wrapper. */
  opacityClassName?: string;
};

/**
 * Fundo Grainient com cores que alternam automaticamente conforme o tema
 * ativo (next-themes). Posicionado absolutamente por padrão; passe um
 * `className` para sobrescrever (ex.: cobertura full-page).
 */
export function GrainientBackground({
  className = "pointer-events-none absolute inset-0 -z-10",
  opacityClassName = "opacity-60 dark:opacity-50",
}: GrainientBackgroundProps): ReactNode {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita mismatch de hidratação: só renderiza canvas após montar no client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  // Apenas color1 e color3 mudam entre claro/escuro; color2 é o acento (vermelho da marca).
  const color1 = isDark ? "#000000" : "#ffffff";
  const color2 = "#f6311a";
  const color3 = isDark ? "#000000" : "#ffffff";

  return (
    <div aria-hidden="true" className={`${className} ${opacityClassName}`}>
      <Grainient
        color1={color1}
        color2={color2}
        color3={color3}
        timeSpeed={1.55}
        colorBalance={0.41}
        warpStrength={0}
        warpFrequency={5}
        warpSpeed={1.3}
        warpAmplitude={32}
        blendAngle={0}
        blendSoftness={0.15}
        rotationAmount={430}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2.6}
        grainAnimated={false}
        contrast={0.5}
        gamma={0.5}
        saturation={1}
        centerX={-1}
        centerY={-0.28}
        zoom={0.9}
      />
    </div>
  );
}

export default GrainientBackground;
