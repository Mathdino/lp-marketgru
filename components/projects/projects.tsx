import { Building2 } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import Image from "next/image";

import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";

type Unidade = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  iconLabel: string;
  title: string;
  description: string;
  meta: string;
  imageRatio: number;
  image: string;
  imageAlt: string;
};

const UNIDADES: Unidade[] = [
  {
    id: "residencial-1",
    icon: Building2,
    iconLabel: "Condomínio residencial",
    title: "Comodidade que combina com a rotina de quem mora aqui.",
    description:
      "Os moradores têm o minimercado autônomo à disposição a qualquer hora, com praticidade, variedade e pagamento rápido pelo celular.",
    meta: "Unidade MarketGRU",
    imageRatio: 4 / 3,
    image: "/unidades/residencial/img-5.webp",
    imageAlt: "Minimercado autônomo MarketGRU em condomínio residencial",
  },
  {
    id: "residencial-2",
    icon: Building2,
    iconLabel: "Condomínio residencial",
    title: "Sempre abastecido, organizado e disponível 24 horas.",
    description:
      "Os moradores não precisam mais sair tarde da noite pra comprar o básico. É prático, organizado e sempre abastecido.",
    meta: "Unidade MarketGRU",
    imageRatio: 4 / 3,
    image: "/minimercado-1.webp",
    imageAlt: "Minimercado autônomo MarketGRU aberto 24 horas em condomínio",
  },
  {
    id: "residencial-3",
    icon: Building2,
    iconLabel: "Edifício residencial",
    title: "Instalação limpa, sem dor de cabeça e que valoriza o prédio.",
    description:
      "A instalação foi tudo limpo e sem dor de cabeça. Agregou valor ao prédio e os condôminos adoraram a comodidade.",
    meta: "Unidade MarketGRU",
    imageRatio: 4 / 3,
    image: "/ambiente-moderno.webp",
    imageAlt: "Minimercado autônomo MarketGRU em edifício residencial",
  },
  {
    id: "corporativo",
    icon: Building2,
    iconLabel: "Edifício corporativo",
    title: "Café, água e snack ali do lado, sem perder tempo.",
    description:
      "Virou o melhor amigo na hora do almoço. Café, água, snack saudável, tudo ali do lado, sem perder tempo no trânsito.",
    meta: "Unidade MarketGRU",
    imageRatio: 4 / 3,
    image: "/compra-facil.webp",
    imageAlt: "Minimercado autônomo MarketGRU em edifício corporativo",
  },
  {
    id: "condominio-clube",
    icon: Building2,
    iconLabel: "Condomínio clube",
    title: "Zero custo, reposição em dia e atendimento atencioso.",
    description:
      "A melhor decisão da assembleia. Zero custo pro condomínio, reposição em dia e atendimento atencioso sempre que precisamos.",
    meta: "Unidade MarketGRU",
    imageRatio: 4 / 3,
    image: "/mais-protecao.webp",
    imageAlt: "Minimercado autônomo MarketGRU em condomínio clube",
  },
  {
    id: "escola",
    icon: Building2,
    iconLabel: "Instituição de ensino",
    title: "Preços justos e pagamento pelo celular super rápido.",
    description:
      "Acabou o item às 23h? Resolve na hora. Os preços são justos e o pagamento pelo celular é super rápido.",
    meta: "Unidade MarketGRU",
    imageRatio: 4 / 3,
    image: "/faq.webp",
    imageAlt: "Minimercado autônomo MarketGRU em instituição de ensino",
  },
  {
    id: "empresa",
    icon: Building2,
    iconLabel: "Empresa",
    title: "Variedade que surpreende e comodidade que não tem preço.",
    description:
      "A variedade de produtos surpreende pro tamanho, e a praticidade de comprar sem sair do prédio não tem preço.",
    meta: "Unidade MarketGRU",
    imageRatio: 4 / 3,
    image: "/blog/investir-em-mercado-autonomo.webp",
    imageAlt: "Minimercado autônomo MarketGRU dentro de empresa",
  },
];

export function Projects(): ReactNode {
  return (
    <section className="relative w-full [font-family:var(--font-poppins)]">
      <div className="mx-auto w-full px-6 pt-40 sm:px-24">
        <FadeIn className="flex flex-col items-center gap-5 pb-10 text-center sm:pb-14">
          <h2 className="text-foreground font-serif text-[2rem] leading-[1.05] font-medium tracking-tight md:text-[2.5rem] lg:text-[3rem]">
            <SplitText
              text="Nossas unidades"
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
          </h2>
          <p className="text-foreground/65 max-w-[46ch] text-[18px] leading-[1.45] tracking-tight sm:text-[20px]">
            Mais de 100 condomínios, empresas e instituições já contam com
            um minimercado autônomo MarketGRU no dia a dia.
          </p>
        </FadeIn>

        <div className="columns-1 gap-6 md:columns-2 md:gap-7">
          {UNIDADES.map((unidade, index) => (
            <UnidadeCard key={unidade.id} unidade={unidade} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function UnidadeCard({
  unidade,
  index,
}: {
  unidade: Unidade;
  index: number;
}): ReactNode {
  const Icon = unidade.icon;
  return (
    <FadeIn
      delay={Math.min(index * 0.06, 0.3)}
      className="mb-6 break-inside-avoid md:mb-7"
    >
      <article className="project-card group border-foreground/8 bg-background flex cursor-default flex-col gap-4 rounded-3xl border p-3 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl sm:p-3.5">
        <header className="flex items-center gap-2.5 px-1 pt-2">
          <span className="border-foreground/10 bg-background inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 ease-out group-hover:scale-110">
            <Icon className="text-foreground h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-foreground text-[20px] font-medium tracking-tight">
            {unidade.iconLabel}
          </span>
        </header>

        <div
          className="project-card__image ring-foreground/5 bg-foreground/5 relative w-full overflow-hidden rounded-2xl ring-1"
          style={{ aspectRatio: unidade.imageRatio }}
        >
          <div className="project-card__image-inner">
            <Image
              src={unidade.image}
              alt={unidade.imageAlt}
              fill
              sizes="(min-width: 1024px) 540px, (min-width: 768px) 45vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={index < 2}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 px-1 pb-1">
          <h3 className="text-foreground font-serif text-[20px] leading-[1.2] font-medium tracking-tight sm:text-[22px]">
            <SplitText
              text={unidade.title}
              tag="span"
              className="[font-family:var(--font-gohan)] tracking-wider"
              textAlign="left"
              delay={20}
              duration={0.6}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-20px"
            />
          </h3>
          <p className="text-foreground/65 text-[14px] leading-normal tracking-tight sm:text-[15px]">
            {unidade.description}
          </p>
        </div>

        <p className="text-foreground/50 px-1 pb-2 text-[12px] tracking-tight">
          {unidade.meta}
        </p>
      </article>
    </FadeIn>
  );
}
