import { ContactCard } from "@/components/contact/contact-card";
import { Projects } from "@/components/projects/projects";
import { GrainientBackground } from "@/components/shaders/grainient-background";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Minimercado",
  description:
    "Minimercado autônomo para condomínios com compras rápidas, segurança, praticidade e funcionamento 24 horas por dia.",
  path: "/minimercado",
});

export default function ProjectsPage(): ReactNode {
  return (
    <main id="main-content" className="relative flex flex-1 flex-col">
      <GrainientBackground className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden" />
      <Projects />
      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
