import type { ReactNode } from "react";
import { Rocket, Eye, HeartHandshake } from "lucide-react";
import SplitText from "@/components/ui/split-text";

type Pilar = {
  icon: ReactNode;
  title: string;
  text: string;
};

const PILARES: Pilar[] = [
  {
    icon: <Rocket className="h-5 w-5" aria-hidden="true" />,
    title: "Missão",
    text: "Levar praticidade e autonomia para o dia a dia de condomínios e empresas, com minimercados inteligentes que funcionam 24 horas, sem filas e sem custo de implantação.",
  },
  {
    icon: <Eye className="h-5 w-5" aria-hidden="true" />,
    title: "Visão",
    text: "Ser a marca de referência em mercados autônomos no Brasil, presente em cada condomínio que valoriza conforto, tecnologia e economia para os moradores.",
  },
  {
    icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />,
    title: "Valores",
    text: "Confiança, transparência e proximidade. Tratamos cada parceria como uma relação de longo prazo, com produtos de qualidade e atendimento humano de verdade.",
  },
];

const DIFERENCIAIS = [
  "Instalação sem custo",
  "Funcionamento 24h",
  "Sem filas e sem caixa",
  "Pagamento por app, Pix e cartão",
  "Reposição automática",
  "Produtos de marcas conhecidas",
  "Mais valorização para o condomínio",
  "Contrato flexível",
];

export function Valores(): ReactNode {
  return (
    <div className="mt-5 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h3 className="text-foreground font-serif text-[25px] font-semibold tracking-tight">
          <SplitText
            text="No que acreditamos"
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PILARES.map((p) => (
            <div
              key={p.title}
              className="group border-foreground/10 bg-background/80 hover:border-foreground/25 hover:bg-background/90 flex flex-col gap-3 rounded-4xl border p-6 [font-family:var(--font-poppins)] shadow-sm backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
            >
              <span className="bg-background text-foreground ring-foreground/8 inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 dark:ring-white/10">
                {p.icon}
              </span>
              <span className="text-foreground text-[17px] font-semibold tracking-tight sm:text-[18px]">
                {p.title}
              </span>
              <p className="text-foreground/70 text-[14px] leading-[1.6] tracking-tight sm:text-[15px]">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-foreground font-serif text-[25px] font-semibold tracking-tight">
          <SplitText
            text="Nossos diferenciais"
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
        <div className="border-foreground/10 rounded-4xl p-2 [font-family:var(--font-poppins)] backdrop-blur-xl sm:p-4">
          <div className="flex flex-wrap gap-3">
            {DIFERENCIAIS.map((d) => (
              <span
                key={d}
                className="border-foreground/8 bg-background text-foreground/85 hover:border-foreground/25 hover:text-foreground cursor-default rounded-full border px-4 py-2 text-[14px] tracking-tight transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md sm:text-[15px]"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
