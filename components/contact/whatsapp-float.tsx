"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Send } from "lucide-react";

/* ─── Config ─────────────────────────────────────────── */
const WHATSAPP_NUMBER = "5511999999999"; // sem + e sem espaços

/* ─── WhatsApp icon (SVG) ────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── Input / Select classes (alinhadas ao design do site) ─── */
const inputCls =
  "w-full rounded-xl border border-foreground/10 bg-foreground/4 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/35 outline-none focus:border-foreground/25 focus:ring-2 focus:ring-foreground/10 transition-colors";

const selectCls =
  "w-full rounded-xl border border-foreground/10 bg-foreground/4 px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground/25 focus:ring-2 focus:ring-foreground/10 transition-colors cursor-pointer dark:bg-zinc-900 dark:[color-scheme:dark]";

type Perfil = "" | "Condomínio" | "Construtora" | "Investidor";

type FormState = {
  nome: string;
  email: string;
  telefone: string;
  perfil: Perfil;
  mensagem: string;
};

const EMPTY: FormState = {
  nome: "",
  email: "",
  telefone: "",
  perfil: "",
  mensagem: "",
};

/* ─── Máscara de telefone BR ─────────────────────────── */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 3) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (len < 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function WhatsAppFloat(): ReactNode {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);

  /* Bloqueia rolagem de fundo quando aberto em telas pequenas */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const next = name === "telefone" ? maskPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: next }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const mensagem =
      `Olá! Vim pelo site.\n\n` +
      `*Nome:* ${form.nome}\n` +
      `*E-mail:* ${form.email}\n` +
      `*Telefone:* ${form.telefone}\n` +
      `*Perfil:* ${form.perfil}\n\n` +
      `*Mensagem:*\n${form.mensagem}`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    setForm(EMPTY);
    setOpen(false);
  }

  return (
    <>
      {/* ─── Botão flutuante ─────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar formulário do WhatsApp" : "Abrir WhatsApp"}
        aria-expanded={open}
        className="group fixed right-5 bottom-5 z-[60] inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-105 active:scale-95 sm:right-7 sm:bottom-7 sm:h-16 sm:w-16"
      >
        {/* Ondas pulsando */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping"
        />
        <span className="relative inline-flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
              </motion.span>
            ) : (
              <motion.span
                key="wa"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      {/* ─── Popover / formulário ────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop só em mobile */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm sm:hidden"
            />

            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Fale conosco pelo WhatsApp"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="border-foreground/8 bg-background fixed inset-x-4 bottom-24 z-[56] flex max-h-[calc(100dvh-7rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:inset-auto sm:right-7 sm:bottom-28 sm:max-h-[min(640px,calc(100dvh-9rem))] sm:w-[380px]"
            >
              {/* Cabeçalho verde */}
              <div className="flex items-center gap-3 bg-[#f4331b] px-5 py-4 text-white">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-tight font-semibold">
                    Fale com a gente
                  </p>
                  <p className="text-[12px] leading-tight opacity-90">
                    Respondemos em poucos minutos
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/15"
                >
                  <X className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col gap-3 overflow-y-auto p-5"
              >
                <input
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                  autoComplete="name"
                  className={inputCls}
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  required
                  autoComplete="email"
                  type="email"
                  className={inputCls}
                />

                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  required
                  autoComplete="tel"
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  className={inputCls}
                />

                <select
                  name="perfil"
                  value={form.perfil}
                  onChange={handleChange}
                  required
                  className={selectCls}
                >
                  <option value="">Selecione um perfil</option>
                  <option value="Condomínio">Condomínio</option>
                  <option value="Construtora">Construtora</option>
                  <option value="Investidor">Investidor</option>
                </select>

                <textarea
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  placeholder="Mensagem"
                  rows={3}
                  required
                  className={`${inputCls} resize-none`}
                />

                <button
                  type="submit"
                  className="shadow-[0_8px_20px_rgba(244, 51, 27,0.5)] mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#f4331b] px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-105 active:scale-[0.99]"
                >
                  Enviar Mensagem
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>

                <p className="text-foreground/45 text-center text-[11px] leading-snug">
                  Ao enviar, você será redirecionado para o WhatsApp.
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
