import { ContactCard } from "@/components/contact/contact-card";
import { FaqSection } from "@/components/faq/faq-section";
import { Hero } from "@/components/hero/hero";
import { SpMapStatsSection } from "@/components/hero/sp-map-section";
import { TiltedCardSection } from "@/components/hero/tilted-card-section";
import { TudoPrecisaSection } from "@/components/hero/tudo-precisa-section";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import SplitText from "@/components/ui/split-text";

const TESTIMONIALS = [
  {
    description:
      "O Market GRU mudou a rotina do nosso condomínio. Os moradores não precisam mais sair tarde da noite pra comprar o básico. É prático, organizado e sempre abastecido.",
    name: "Fernanda Oliveira",
    handle: "Condomínio The Brick",
  },
  {
    description:
      "Como síndico, eu tinha receio da instalação, mas foi tudo limpo e sem dor de cabeça. O Market GRU agregou valor ao prédio e os condôminos adoraram a comodidade.",
    name: "Patrícia Almeida",
    handle: "Condomínio First Apto",
  },
  {
    description:
      "Moro sozinho e o minimercado salva demais. Acabou o leite às 23h? Desço de elevador e resolvo. Os preços são justos e o pagamento pelo celular é super rápido.",
    name: "Rafael Souza",
    handle: "Escola Técnica de Música Nelsom",
  },
  {
    description:
      "Com dois filhos pequenos, não ter que sair de casa pra comprar fralda ou um lanche de última hora é um alívio. O Market GRU é sempre limpo e bem cuidado.",
    name: "Juliana Santos",
    handle: "Clavi Ecco Tower",
  },
  {
    description:
      "Implantamos o Market GRU na última assembleia e foi a melhor decisão. Zero custo pro condomínio, reposição em dia e atendimento atencioso sempre que precisamos.",
    name: "Camila Ferreira",
    handle: "Terrazzo Condomínio Clube",
  },
  {
    description:
      "Recomendo o Market GRU pra qualquer condomínio. A variedade de produtos surpreende pro tamanho, e a praticidade de comprar sem sair do prédio não tem preço.",
    name: "Mariana Costa",
    handle: "Imobiliária Aliança Imóveis",
  },
  {
    description:
      "O que mais me impressionou foi a honestidade do sistema. É tudo no autosserviço e funciona perfeitamente. Os moradores se sentem em casa fazendo as compras.",
    name: "Bruno Carvalho",
    handle: "Condomínio The Brick",
  },
  {
    description:
      "Trabalho em home office e o Market GRU virou meu melhor amigo na hora do almoço. Café, água, snack saudável... tudo ali do lado, sem perder tempo no trânsito.",
    name: "Larissa Rodrigues",
    handle: "Clavi Ecco Tower",
  },
  {
    description:
      "Minha mãe é idosa e tinha dificuldade de ir ao mercado. Agora ela faz as comprinhas dela com tranquilidade dentro do próprio prédio. Gratidão ao Market GRU!",
    name: "Thiago Lima",
    handle: "Terrazzo Condomínio Clube",
  },
];

export const metadata: Metadata = createMetadata({
  title: "Minimercado para condomínios",
  description: `Soluções inteligentes para condomínios com tecnologia, segurança e praticidade para transformar a gestão e o dia a dia.`,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col gap-10">
      <Hero />
      <TudoPrecisaSection />
      <TiltedCardSection />
      <SpMapStatsSection />

      <FadeIn className="flex flex-col items-center gap-5 text-center">
        <h1 className="text-foreground font-serif text-[2.75rem] leading-[1.05] font-medium tracking-tight md:text-[3.25rem] lg:text-[3.75rem]">
          <SplitText
            text="Depoimentos"
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
        <p className="text-foreground/65 [font-family:var(--font-poppins)] text-[20px] leading-[1.4] tracking-tight sm:text-[22px]">
          Veja como a Market Gru vem trazendo mais praticidade e comodidade para
          condomínios.
        </p>
      </FadeIn>

      <section className="w-full">
        <AnimatedTestimonials data={TESTIMONIALS} />
      </section>

      <FaqSection />

      <ContactCard />
      <div className="h-12 sm:h-16" />
    </main>
  );
}
