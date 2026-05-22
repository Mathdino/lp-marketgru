"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import SplitText from "@/components/ui/split-text";

/* ─── Dados ──────────────────────────────────────────── */
const FAQS = [
  {
    question: "Como funciona o minimercado para condomínios?",
    answer:
      "Instalamos um minimercado autônomo completo no seu condomínio, sem custo de implantação. Os moradores têm acesso 24h por dia a produtos de qualidade com pagamento via app ou cartão. Cuidamos de todo o abastecimento e manutenção.",
  },
  {
    question: "Qual o custo para o condomínio?",
    answer:
      "Zero! A implantação, equipamentos e manutenção são totalmente por nossa conta. O condomínio ganha o serviço sem nenhum investimento, enquanto os moradores aproveitam a praticidade.",
  },
  {
    question: "Quais produtos são oferecidos?",
    answer:
      "Oferecemos uma seleção completa de itens do dia a dia: alimentos, bebidas, snacks, produtos de higiene e limpeza. O mix é adaptado ao perfil dos moradores de cada condomínio.",
  },
  {
    question: "Como é feito o abastecimento do mercado?",
    answer:
      "Nossa equipe realiza visitas periódicas para reabastecer os produtos e verificar os equipamentos. Você não precisa se preocupar com nada — cuidamos de tudo do início ao fim.",
  },
  {
    question: "O minimercado funciona sem funcionários?",
    answer:
      "Sim! O sistema é totalmente autônomo com tecnologia de pagamento digital via app, cartão de crédito/débito e Pix. Câmeras de segurança garantem a integridade do espaço.",
  },
  {
    question: "Qual o espaço necessário para instalar?",
    answer:
      "Trabalhamos com diferentes formatos adaptáveis ao espaço disponível no condomínio — de totem compacto a loja completa. Nossa equipe faz uma visita técnica para indicar a melhor solução.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Item do FAQ ─────────────────────────────────────── */
function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
      className="border-foreground/8 border-b last:border-0"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-none"
      >
        <span
          className={`text-[15px] leading-snug font-medium tracking-tight transition-colors duration-200 ${
            isOpen ? "text-foreground" : "text-foreground/70"
          }`}
        >
          {question}
        </span>
        <span className="border-foreground/10 bg-foreground/4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-200">
          <AnimatePresence initial={false} mode="wait">
            {isOpen ? (
              <motion.span
                key="minus"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Minus
                  className="text-foreground h-3.5 w-3.5"
                  strokeWidth={2.5}
                />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus
                  className="text-foreground/60 h-3.5 w-3.5"
                  strokeWidth={2.5}
                />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-foreground/60 pb-4 text-[14px] leading-[1.65] tracking-tight">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Seção FAQ ───────────────────────────────────────── */
export function FaqSection(): ReactNode {
  const [openIndex, setOpenIndex] = useState<number>(0); // primeira aberta

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? -1 : i));

  return (
    <section className="mx-auto mt-20 w-full px-6 sm:px-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* ── Imagem (esquerda) ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=900&auto=format&fit=crop"
            alt="Minimercado Market Gru"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badge flutuante */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/15 p-4 backdrop-blur-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8301a]">
              <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.46 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">
                Sem custo de implantação
              </p>
              <p className="text-[11px] text-white/70">
                Instalação 100% gratuita para o condomínio
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── FAQ (direita) ─────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col gap-3"
          >
            <span className="text-foreground/40 text-[11px] font-semibold tracking-[0.14em] uppercase">
              Perguntas Frequentes
            </span>
            <h2 className="text-foreground [font-family:var(--font-gohan)] text-[2.25rem] leading-[1.05] tracking-wider sm:text-[2.75rem]">
              <SplitText
                text="Tire suas dúvidas"
                tag="span"
                className="[font-family:var(--font-gohan)] tracking-wider"
                textAlign="left"
                delay={20}
                duration={0.7}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-50px"
              />
            </h2>
            <p className="text-foreground/55 text-[16px] leading-[1.5] tracking-tight">
              Entenda como o Market Gru funciona e como pode transformar o dia a
              dia do seu condomínio.
            </p>
          </motion.div>

          {/* Accordion */}
          <div className="divide-y-0">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                index={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
