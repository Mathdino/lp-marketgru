"use client";

import TiltedCard from "@/components/ui/tilted-card";
import SplitText from "@/components/ui/split-text";
import { FadeIn } from "../ui/motion-primitives";
import { OrbButton } from "@/components/ui/orb-button";
import { TrendingUp } from "lucide-react";

const MARKET_CARDS = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=900&auto=format&fit=crop",
    altText: "Prateleiras de mercado com produtos variados",
    captionText: "Ambiente Moderno",
    title: "Ambiente Moderno",
    text: "Estrutura planejada com acabamento sofisticado e visual moderno, criando um espaço mais agradável e valorizado para moradores e colaboradores.",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=900&auto=format&fit=crop",
    altText: "Corredor de conveniencia com produtos organizados",
    captionText: "Compra Fácil",
    title: "Compra Fácil",
    text: "Experiência rápida e prática de autoatendimento, permitindo que o cliente escolha os produtos e finalize a compra de forma simples.",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=900&auto=format&fit=crop",
    altText: "Predio residencial moderno visto da rua",
    captionText: "Mais Proteção",
    title: "Mais Proteção",
    text: "Sistema desenvolvido para garantir mais controle, segurança e tranquilidade no funcionamento do minimercado 24h, com monitoramento do ambiente econtrole de acesso.",
  },
];

export function TiltedCardSection() {
  return (
    <section className="relative w-full">
      <FadeIn className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
          <SplitText
            text="Soluções de minimercado 24h para condomínios"
            tag="span"
            className="[font-family:var(--font-gohan)] tracking-wider"
            textAlign="center"
            delay={25}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
          />
        </h1>
        <p className="text-foreground/65 max-w-[100ch] pb-15 text-[20px] leading-[1.4] tracking-tight sm:text-[22px]">
          Levamos mais praticidade para sua rotina com um minimercado 24h no seu
          condomínio ou prédio, reunindo produtos essenciais, conveniência e
          empório em um só lugar.
        </p>
      </FadeIn>
      <div className="mx-auto grid w-full grid-cols-1 gap-10 px-6 sm:px-20 md:grid-cols-3 md:gap-7">
        {MARKET_CARDS.map((card) => (
          <article key={card.captionText} className="flex flex-col gap-5">
            <TiltedCard
              imageSrc={card.imageSrc}
              altText={card.altText}
              captionText={card.captionText}
              containerHeight="clamp(240px, 25vw, 340px)"
              containerWidth="100%"
              imageHeight="clamp(240px, 25vw, 340px)"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip
            />
            <div className="flex flex-col gap-2 px-1">
              <h3 className="text-foreground [font-family:var(--font-gohan)] text-[24px] leading-tight tracking-tight">
                {card.title}
              </h3>
              <p className="text-foreground/65 [font-family:var(--font-poppins)] text-[16px] leading-[1.45] tracking-tight">
                {card.text}
              </p>
              <OrbButton
                dotClassName="bg-[#f8301a] dark:bg-[#f8301a]"
                Icon={TrendingUp}
                className="mt-3 [font-family:var(--font-poppins)]"
              >
                Entre em Contato
              </OrbButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
