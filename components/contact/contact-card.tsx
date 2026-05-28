"use client";

import {
  useState,
  type FormEvent,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Instagram, Facebook, Youtube, Mail, Send } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/ui/motion-primitives";
import SplitText from "@/components/ui/split-text";
import { GrainientBackground } from "@/components/shaders/grainient-background";
import { siteConfig } from "@/lib/config";

/* ─── Estados BR ─────────────────────────────────────── */
const ESTADOS_BR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

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

/* ─── Link com ícone e label ─────────────────────────── */
function ContactLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}): ReactNode {
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      aria-label={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group text-foreground/60 hover:text-foreground inline-flex items-center gap-3 transition-colors duration-200"
    >
      <span className="border-foreground/8 hover:border-foreground/20 bg-background inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

/* ─── Input / Textarea base classes ─────────────────── */
const inputCls =
  "w-full rounded-xl border border-foreground/10 bg-foreground/4 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/35 outline-none focus:border-foreground/25 focus:ring-2 focus:ring-foreground/10 transition-colors";

const selectCls =
  "rounded-xl border border-foreground/10 bg-foreground/4 px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground/25 focus:ring-2 focus:ring-foreground/10 transition-colors cursor-pointer dark:bg-zinc-900 dark:[color-scheme:dark]";

/* ─── Formulário ─────────────────────────────────────── */
type FormState = {
  nome: string;
  empresa: string;
  telefone: string;
  email: string;
  cidade: string;
  estado: string;
  mensagem: string;
};

const EMPTY: FormState = {
  nome: "",
  empresa: "",
  telefone: "",
  email: "",
  cidade: "",
  estado: "",
  mensagem: "",
};

/* ─── Card principal ─────────────────────────────────── */
const CARD_FADE_MASK =
  "radial-gradient(ellipse 90% 110% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.15) 100%)";

export function ContactCard(): ReactNode {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);

    /* --- WhatsApp --- */
    const waMensagem =
      `Olá! Vim pelo site.\n\n` +
      `*Nome:* ${form.nome}\n` +
      `*Empresa:* ${form.empresa}\n` +
      `*Telefone:* ${form.telefone}\n` +
      `*E-mail:* ${form.email}\n` +
      `*Cidade/Estado:* ${form.cidade} / ${form.estado}\n\n` +
      `*Mensagem:*\n${form.mensagem}`;

    const waUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(waMensagem)}`;
    window.open(waUrl, "_blank");

    /* --- E-mail (mailto) --- */
    const mailBody =
      `Nome: ${form.nome}\n` +
      `Empresa: ${form.empresa}\n` +
      `Telefone: ${form.telefone}\n` +
      `E-mail: ${form.email}\n` +
      `Cidade: ${form.cidade}\n` +
      `Estado: ${form.estado}\n\n` +
      `Mensagem:\n${form.mensagem}`;

    const mailtoUrl =
      `mailto:${siteConfig.contact.email}` +
      `?subject=${encodeURIComponent(`Contato via site – ${form.nome}`)}` +
      `&body=${encodeURIComponent(mailBody)}`;

    window.location.href = mailtoUrl;

    setForm(EMPTY);
    setEnviando(false);
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  }

  return (
    <section className="mx-auto my-12 w-full px-6 [font-family:var(--font-poppins)] sm:my-20 sm:px-28">
      <FadeIn>
        <div className="border-foreground/8 bg-background relative w-full overflow-hidden rounded-4xl border p-1.5 shadow-sm">
          <div className="relative w-full overflow-hidden rounded-[1.6rem]">
            {/* Grainient background (light/dark automático) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                WebkitMaskImage: CARD_FADE_MASK,
                maskImage: CARD_FADE_MASK,
              }}
            >
              <GrainientBackground
                className="pointer-events-none absolute inset-0"
                opacityClassName="opacity-70 dark:opacity-50"
              />
            </div>

            <div className="relative grid gap-8 p-6 sm:gap-10 sm:p-7 md:grid-cols-[1fr_1.4fr] md:items-stretch md:gap-6 md:p-6">
              {/* ── LADO ESQUERDO ───────────────────────── */}
              <div className="flex flex-col gap-7">
                {/* Título + subtítulo */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-foreground [font-family:var(--font-gohan)] text-[2.25rem] leading-[1.05] tracking-wider sm:text-[2.75rem] lg:text-[3rem]">
                    <SplitText
                      text="Vamos Conversar ?"
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
                  <p className="text-foreground/65 max-w-[28ch] text-[16px] leading-[1.45] tracking-tight sm:text-[18px]">
                    Preencha o formulário e entre em contato pelo WhatsApp!
                  </p>
                </div>

                {/* Redes Sociais */}
                <div className="flex flex-col gap-3">
                  <p className="text-[14px] font-semibold tracking-[0.12em] text-[#f82f19] uppercase">
                    Redes Sociais
                  </p>
                  <div className="flex flex-col gap-2">
                    <ContactLink
                      href={siteConfig.social.instagram}
                      label="Instagram"
                      Icon={Instagram}
                    />
                    <ContactLink
                      href={siteConfig.social.facebook}
                      label="Facebook"
                      Icon={Facebook}
                    />
                    <ContactLink
                      href={siteConfig.social.youtube}
                      label="Youtube"
                      Icon={Youtube}
                    />
                  </div>
                </div>

                {/* Contatos */}
                <div className="flex flex-col gap-3">
                  <p className="text-[14px] font-semibold tracking-[0.12em] text-[#f82f19] uppercase">
                    Contatos
                  </p>
                  <div className="flex flex-col gap-2">
                    <ContactLink
                      href={`mailto:${siteConfig.contact.email}`}
                      label="E-mail"
                      Icon={Mail}
                    />
                    <ContactLink
                      href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                      label="WhatsApp"
                      Icon={WhatsAppIcon}
                    />
                  </div>
                </div>
              </div>

              {/* ── LADO DIREITO — FORMULÁRIO ────────────── */}
              <div className="border-foreground/8 bg-background flex flex-col rounded-[1.1rem] border p-5 sm:p-6">
                <form
                  onSubmit={handleSubmit}
                  className="flex h-full flex-col gap-3"
                >
                  {/* Nome */}
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    required
                    autoComplete="name"
                    className={inputCls}
                  />

                  {/* Empresa */}
                  <input
                    name="empresa"
                    value={form.empresa}
                    onChange={handleChange}
                    placeholder="Empresa"
                    autoComplete="organization"
                    className={inputCls}
                  />

                  {/* Telefone */}
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="Telefone / WhatsApp"
                    required
                    autoComplete="tel"
                    type="tel"
                    className={inputCls}
                  />

                  {/* Email */}
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

                  {/* Cidade + Estado */}
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <input
                      name="cidade"
                      value={form.cidade}
                      onChange={handleChange}
                      placeholder="Cidade"
                      autoComplete="address-level2"
                      className={inputCls}
                    />
                    <select
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      className={`${selectCls} w-[90px]`}
                    >
                      <option value="">UF</option>
                      {ESTADOS_BR.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mensagem */}
                  <textarea
                    name="mensagem"
                    value={form.mensagem}
                    onChange={handleChange}
                    placeholder="Mensagem"
                    rows={4}
                    className={`${inputCls} flex-1 resize-none`}
                  />

                  {/* Botão */}
                  <button
                    type="submit"
                    disabled={enviando}
                    className="bg-foreground text-background mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#f82f19] disabled:opacity-50"
                  >
                    {enviando ? (
                      "Enviando…"
                    ) : enviado ? (
                      "Mensagem enviada ✓"
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
