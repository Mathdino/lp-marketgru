import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ContactCard } from "@/components/contact/contact-card";
import { BrilhoTopo } from "@/components/ui/brilho-topo";
import { GsapReveal } from "@/components/ui/gsap-reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { Projects } from "@/components/projects/projects";
import SplitText from "@/components/ui/split-text";
import { createMetadata } from "@/lib/metadata";
import {
  montarGrafo,
  schemaBreadcrumb,
  schemaService,
  schemaWebPage,
} from "@/lib/schema";

/* =============================================================================
   /minimercado — o que é e onde já está instalado.

   A página tinha só o componente de unidades, cujo título é <h2> "Nossas
   unidades": ou seja, rodava sem H1 e sem nenhuma frase que respondesse a
   busca. Agora tem cabeçalho próprio com a keyword, resposta direta antes do
   contexto e schema — e o componente de unidades segue como <h2>, que é o
   nível correto para ele.
   ========================================================================== */

const CANONICAL = "/minimercado";

const META_DESCRIPTION =
  "Minimercado autônomo instalado sem custo em condomínios e empresas: loja 24h, sem operador de caixa, com pagamento por app, Pix ou cartão. Veja as unidades.";

const RESUMO =
  "Minimercado autônomo é uma loja sem operador de caixa, aberta 24 horas, instalada dentro do condomínio ou da empresa. O cliente escolhe o produto na prateleira e paga ali mesmo, por app, Pix ou cartão — sem fila e sem horário de fechamento.";

export const metadata: Metadata = createMetadata({
  title: "Minimercado autônomo 24h: como funciona",
  description: META_DESCRIPTION,
  path: CANONICAL,
});

export default function MinimercadoPage(): ReactNode {
  const grafo = montarGrafo([
    schemaWebPage({
      canonical: CANONICAL,
      nome: "Minimercado autônomo 24h",
      descricao: META_DESCRIPTION,
    }),
    schemaBreadcrumb([{ nome: "Minimercado", path: CANONICAL }], CANONICAL),
    schemaService({
      canonical: CANONICAL,
      nome: "Minimercado autônomo 24 horas",
      descricao: RESUMO,
      audiencia: "Condomínios residenciais e empresas",
    }),
  ]);

  return (
    <>
      <JsonLd data={grafo} />

      <main id="main-content" className="flex flex-1 flex-col">
        {/* O fundo vive DENTRO do cabeçalho e termina com ele. Antes ele era
            filho do <main> com 900px de altura, e por isso passava por baixo de
            "Nossas unidades", que é outro bloco. */}
        <section className="relative isolate overflow-hidden pt-36 sm:pt-44">
          {/* Brilho de acento no lugar do shader: o shader pinta escuro nos
              dois temas, e no claro engolia o texto escuro do cabeçalho. A
              máscara dissolve a base, para o bloco não terminar em linha reta
              atravessando a página. */}
          <BrilhoTopo className="[mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]" />

          <div className="mx-auto w-full max-w-6xl px-6">
            <nav aria-label="Trilha de navegação" className="mb-8">
              <ol className="text-foreground/65 flex flex-wrap items-center gap-2 [font-family:var(--font-poppins)] text-[13px]">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Início
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground/80 font-medium">Minimercado</li>
              </ol>
            </nav>

            <h1 className="text-foreground [font-family:var(--font-gohan)] text-[2.4rem] leading-[1.05] font-medium tracking-wide sm:text-[3.4rem]">
              <SplitText
                text="Minimercado autônomo 24 horas"
                tag="span"
                className="[font-family:var(--font-gohan)] tracking-wide"
                textAlign="left"
                delay={22}
                duration={0.7}
                ease="power3.out"
                splitType="words"
                from={{ opacity: 0, y: 32 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-40px"
              />
            </h1>

            <GsapReveal className="mt-7" delay={0.15}>
              <p className="text-foreground/80 border-l-2 border-[var(--mg-accent)] pl-5 [font-family:var(--font-poppins)] text-lg leading-relaxed">
                {RESUMO}
              </p>
            </GsapReveal>

            <GsapReveal className="mt-6">
              <p className="text-foreground/70 [font-family:var(--font-poppins)] text-[17px] leading-relaxed">
                A implantação é sem custo para quem recebe a loja: equipamento,
                estoque, reposição e manutenção são nossos. Abaixo estão
                unidades já em operação — e, se quiser o recorte do seu caso,
                veja as páginas de{" "}
                <Link
                  href="/mercado-para-condominio"
                  className="text-[var(--mg-accent)] underline underline-offset-4"
                >
                  mercados para condomínio
                </Link>{" "}
                e{" "}
                <Link
                  href="/mercado-para-empresas"
                  className="text-[var(--mg-accent)] underline underline-offset-4"
                >
                  mercados para empresas
                </Link>
                .
              </p>
            </GsapReveal>
          </div>
        </section>

        <Projects />
        <ContactCard />
        <div className="h-12 sm:h-16" />
      </main>
    </>
  );
}
