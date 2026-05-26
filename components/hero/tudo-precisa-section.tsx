"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";

const FEATURES = [
  {
    title: "Preço justo e promoções exclusivas",
    text: "Com presença em todas as regiões do Brasil, a Market Gru tem negociações exclusivas com diversas marcas para levar preços justos e oferecer promoções personalizadas para nossos clientes.",
  },
  {
    title: "Abastecimento inteligente",
    text: "As lojas Market Gru são reabastecidas com o uso de inteligência artificial que identifica quais itens devem ser repostos antes mesmo de esgotarem nas gôndolas.",
  },
  {
    title: "Portal do síndico",
    text: "O síndico (ou o gestor da empresa) tem acesso em tempo real a todas as informações do mercadinho para controle interno.",
  },
  {
    title: "Sem reformas",
    text: "Adaptamos os projetos de nossos minimercados de acordo com o local disponibilizado pelo condomínio ou empresa.",
  },
];

const HERO_IMAGE = "/minimercado-1.webp";

export function TudoPrecisaSection(): ReactNode {
  return (
    <section className="relative w-full p-6 sm:px-20">
      <div className="mb-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Imagem */}
        <FadeIn>
          <div className="border-foreground/8 relative aspect-[4/5] w-full overflow-hidden rounded-3xl border shadow-sm sm:aspect-[5/6]">
            <Image
              src={HERO_IMAGE}
              alt="Pessoas aproveitando produtos do minimercado 24h"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              priority={false}
            />
            {/* Sutil overlay para integrar ao tema */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.18) 100%)",
              }}
            />
          </div>
        </FadeIn>

        {/* Conteúdo */}
        <div className="flex flex-col gap-6">
          <FadeIn>
            <h2 className="pb-8 font-serif text-[2.25rem] leading-[1.05] font-medium tracking-tight text-white md:text-[2.75rem] lg:text-[3rem]">
              <SplitText
                text="Tudo o que você precisa"
                tag="span"
                className="[font-family:var(--font-gohan)] tracking-wider"
                textAlign="left"
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
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-foreground/65 max-w-[44ch] [font-family:var(--font-poppins)] text-[18px] leading-[1.45] tracking-tight sm:text-[19px]">
              Um minimercado com mais de 500 itens que funciona 24h e sem
              atendentes.
            </p>
          </FadeIn>

          <motion.ul
            className="mt-2 flex flex-col gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.14,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {FEATURES.map((feat) => (
              <motion.li
                key={feat.title}
                className="group flex items-start gap-4"
                variants={{
                  hidden: { opacity: 0, x: -32, filter: "blur(6px)" },
                  visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                <motion.span
                  className="bg-foreground/4 border-foreground/10 mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-[#f03616]/40 group-hover:bg-[#f03616]/10"
                  initial={{ scale: 0.4, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 18,
                    delay: 0.35,
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  <CheckCircle2
                    className="h-5 w-5 text-[#f83021]"
                    strokeWidth={2.2}
                  />
                </motion.span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-foreground [font-family:var(--font-gohan)] text-[18px] leading-snug tracking-tight sm:text-[20px]">
                    {feat.title}
                  </h3>
                  <p className="text-foreground/60 [font-family:var(--font-poppins)] text-[14.5px] leading-[1.55] tracking-tight">
                    {feat.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
