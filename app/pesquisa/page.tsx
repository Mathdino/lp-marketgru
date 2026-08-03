"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Send } from "lucide-react";
import { questions, BRAND, type Question } from "@/lib/survey";
import { cn } from "@/lib/utils";

type Answers = {
  condominio: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string[];
  q4_outro: string;
  q5: string;
  q6: string;
  q6_outro: string;
};

const initial: Answers = {
  condominio: "",
  q1: "",
  q2: "",
  q3: "",
  q4: [],
  q4_outro: "",
  q5: "",
  q6: "",
  q6_outro: "",
};

export default function PesquisaPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string>("");

  const answered = useMemo(() => {
    let n = 0;
    if (answers.condominio) n++;
    if (answers.q1) n++;
    if (answers.q2.trim()) n++;
    if (answers.q3.trim()) n++;
    if (answers.q4.length) n++;
    if (answers.q5) n++;
    if (answers.q6) n++;
    return n;
  }, [answers]);
  const progress = Math.round((answered / questions.length) * 100);

  function setSingle(id: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function toggleMulti(value: string) {
    setAnswers((a) => ({
      ...a,
      q4: a.q4.includes(value)
        ? a.q4.filter((v) => v !== value)
        : [...a.q4, value],
    }));
  }

  async function handleSubmit() {
    setError("");
    if (
      !answers.condominio ||
      !answers.q1 ||
      answers.q4.length === 0 ||
      !answers.q5 ||
      !answers.q6
    ) {
      setError("Responda as perguntas obrigatórias (1, 2, 5, 6 e 7).");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Erro");
      setStatus("done");
      setTimeout(() => router.push("/"), 2800);
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Erro ao enviar.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-28 pb-24 [font-family:var(--font-poppins)] sm:pt-32">
      {/* Cabeçalho */}
      <div className="mb-6 text-center">
        <span
          className="inline-block rounded-full px-4 py-1.5 [font-family:var(--font-poppins)] text-xs font-semibold tracking-wider text-white uppercase"
          style={{ backgroundColor: BRAND.primary }}
        >
          Pesquisa de satisfação
        </span>
        <h1 className="mt-4 [font-family:var(--font-gohan)] text-3xl text-white sm:text-4xl">
          Sua opinião move a{" "}
          <span
            style={{
              color: BRAND.primary,
              WebkitTextStroke: "2px #fff",
              paintOrder: "stroke fill",
              letterSpacing: "0.05em",
            }}
          >
            MarketGru
          </span>
        </h1>
        <p className="mx-auto mt-2 max-w-md [font-family:var(--font-poppins)] text-sm text-white/85">
          Leva menos de 2 minutos. Suas respostas ajudam a deixar o minimercado
          cada vez melhor pra você.
        </p>
      </div>

      {/* Barra de progresso fixa */}
      <div className="bg-background/80 sticky top-[84px] z-20 mb-6 rounded-full p-1 backdrop-blur">
        <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: BRAND.primary }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="mt-1.5 text-center [font-family:var(--font-poppins)] text-sm">
          {answered} de {questions.length} respondidas
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Perguntas */}
      <div className="flex flex-col gap-5">
        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            q={q}
            index={index}
            answers={answers}
            onSingle={setSingle}
            onToggleMulti={toggleMulti}
            onText={setSingle}
          />
        ))}
      </div>

      {/* Enviar */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "sending"}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 [font-family:var(--font-poppins)] text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
        style={{ backgroundColor: BRAND.primary }}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-5 animate-spin" /> Enviando...
          </>
        ) : (
          <>
            <Send className="size-5" /> Enviar respostas
          </>
        )}
      </button>

      {/* Overlay animado de confirmação */}
      <AnimatePresence>
        {status === "done" && <SuccessOverlay />}
      </AnimatePresence>
    </main>
  );
}

function QuestionCard({
  q,
  index,
  answers,
  onSingle,
  onToggleMulti,
  onText,
}: {
  q: Question;
  index: number;
  answers: Answers;
  onSingle: (id: keyof Answers, v: string) => void;
  onToggleMulti: (v: string) => void;
  onText: (id: keyof Answers, v: string) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="border-border bg-card rounded-3xl border p-5 shadow-sm"
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full [font-family:var(--font-poppins)] text-sm font-bold text-white"
          style={{ backgroundColor: BRAND.primary }}
        >
          {index + 1}
        </span>
        <div>
          <h2 className="[font-family:var(--font-poppins)] text-base leading-snug font-semibold sm:text-lg">
            {q.title}
            {q.required && <span style={{ color: BRAND.primary }}> *</span>}
          </h2>
          {q.help && (
            <p className="text-muted-foreground mt-1.5 [font-family:var(--font-poppins)] text-sm">
              {q.help}
            </p>
          )}
        </div>
      </div>

      {/* SINGLE */}
      {q.type === "single" && (
        <div className="flex flex-col gap-2.5 [font-family:var(--font-poppins)]">
          {q.options?.map((opt) => {
            const active = answers[q.id as keyof Answers] === opt.value;
            return (
              <OptionRow
                key={opt.value}
                active={active}
                emoji={opt.emoji}
                label={opt.label}
                shape="radio"
                onClick={() => onSingle(q.id as keyof Answers, opt.value)}
              />
            );
          })}
          {q.allowOther && (
            <>
              <OptionRow
                active={answers.q6 === "outro"}
                label="Outro (especifique)"
                emoji="✍️"
                shape="radio"
                onClick={() => onSingle("q6", "outro")}
              />
              {answers.q6 === "outro" && (
                <input
                  value={answers.q6_outro}
                  onChange={(e) => onText("q6_outro", e.target.value)}
                  placeholder="Qual prêmio você gostaria?"
                  className="border-border bg-background mt-1 w-full rounded-xl border px-4 py-3 [font-family:var(--font-poppins)] text-sm outline-none focus:border-transparent focus:ring-2"
                  style={{ "--tw-ring-color": BRAND.primary } as CSSProperties}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* MULTI */}
      {q.type === "multi" && (
        <div className="flex flex-col gap-2.5">
          {q.options?.map((opt) => (
            <OptionRow
              key={opt.value}
              active={answers.q4.includes(opt.value)}
              emoji={opt.emoji}
              label={opt.label}
              shape="check"
              onClick={() => onToggleMulti(opt.value)}
            />
          ))}
          {q.allowOther && (
            <>
              <OptionRow
                active={answers.q4.includes("outro")}
                label="Outro"
                emoji="✍️"
                shape="check"
                onClick={() => onToggleMulti("outro")}
              />
              {answers.q4.includes("outro") && (
                <input
                  value={answers.q4_outro}
                  onChange={(e) => onText("q4_outro", e.target.value)}
                  placeholder="Qual categoria?"
                  className="border-border bg-background mt-1 w-full rounded-xl border px-4 py-3 [font-family:var(--font-poppins)] text-sm outline-none focus:ring-2"
                  style={{ "--tw-ring-color": BRAND.primary } as CSSProperties}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* TEXT */}
      {q.type === "text" && (
        <textarea
          value={answers[q.id as keyof Answers] as string}
          onChange={(e) => onText(q.id as keyof Answers, e.target.value)}
          placeholder={q.placeholder}
          rows={4}
          className="border-border bg-background w-full resize-none rounded-2xl border px-4 py-3 [font-family:var(--font-poppins)] text-sm outline-none focus:ring-2"
          style={{ "--tw-ring-color": BRAND.primary } as CSSProperties}
        />
      )}
    </motion.section>
  );
}

function OptionRow({
  active,
  emoji,
  label,
  shape,
  onClick,
}: {
  active: boolean;
  emoji?: string | undefined;
  label: string;
  shape: "radio" | "check";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left [font-family:var(--font-poppins)] text-sm font-medium transition-all active:scale-[0.99]",
        active
          ? "border-transparent text-white shadow-md"
          : "border-border bg-background hover:border-foreground/30"
      )}
      style={active ? { backgroundColor: BRAND.primary } : undefined}
    >
      {emoji && <span className="text-xl">{emoji}</span>}
      <span className="flex-1">{label}</span>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border-2 [font-family:var(--font-poppins)]",
          shape === "radio" ? "rounded-full" : "rounded-md",
          active ? "border-white bg-white/20" : "border-border"
        )}
      >
        {active && <Check className="size-3.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

function SuccessOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center text-white"
      style={{ backgroundColor: BRAND.primary }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="flex size-28 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 14,
            delay: 0.35,
          }}
        >
          <Check className="size-16" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 [font-family:var(--font-poppins)] text-3xl font-bold"
      >
        Resposta enviada! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mt-3 max-w-sm [font-family:var(--font-poppins)] text-white/90"
      >
        Muito obrigado por ajudar a MarketGru a melhorar. Redirecionando para a
        página inicial...
      </motion.p>

      <motion.div
        className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/25"
        aria-hidden
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.6, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}
