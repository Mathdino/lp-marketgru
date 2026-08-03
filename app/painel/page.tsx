"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, Lock, LogOut, RefreshCw } from "lucide-react";
import { questions, BRAND, CONDOMINIOS, type Question } from "@/lib/survey";

interface TextItem {
  text: string;
  condominio: string;
}

interface PanelData {
  total: number;
  counts: Record<string, Record<string, number>>;
  textAnswers: {
    q2: TextItem[];
    q3: TextItem[];
    outros: { q4: TextItem[]; q6: TextItem[] };
  };
  responses: Array<Record<string, unknown>>;
}

const CONDO_LABEL: Record<string, string> = Object.fromEntries(
  CONDOMINIOS.map((c) => [c.value, c.label])
);

export default function PainelPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [data, setData] = useState<PanelData | null>(null);

  async function load(): Promise<boolean> {
    const res = await fetch("/api/painel/responses", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return false;
    }
    const json = await res.json();
    setData(json);
    setAuthed(true);
    return true;
  }

  useEffect(() => {
    load().finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2
          className="size-6 animate-spin"
          style={{ color: BRAND.primary }}
        />
      </main>
    );
  }

  if (!authed) return <LoginScreen onSuccess={load} />;

  return <Dashboard data={data} reload={load} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => Promise<boolean> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/painel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Falha no login.");
      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-border bg-card w-full max-w-sm rounded-3xl border p-7 shadow-lg"
      >
        <div
          className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: BRAND.primary }}
        >
          <Lock className="size-6" />
        </div>
        <h1 className="text-center [font-family:var(--font-gohan)] text-2xl">
          Painel MarketGru
        </h1>
        <p className="text-muted-foreground mb-6 text-center [font-family:var(--font-poppins)] text-sm">
          Acesse com suas credenciais.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <label className="mb-1 block [font-family:var(--font-poppins)] text-sm font-medium sm:mb-2">
          E-mail
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="border-border bg-background mb-4 w-full rounded-xl border px-4 py-3 [font-family:var(--font-poppins)] text-sm outline-none focus:ring-2"
          style={{ "--tw-ring-color": BRAND.primary } as CSSProperties}
          placeholder="E-mail de acesso"
        />
        <label className="mb-1 block [font-family:var(--font-poppins)] text-sm font-medium sm:mb-2">
          Senha
        </label>
        <div className="relative mb-6">
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="border-border bg-background w-full rounded-xl border px-4 py-3 pr-12 [font-family:var(--font-poppins)] text-sm outline-none focus:ring-2"
            style={{ "--tw-ring-color": BRAND.primary } as CSSProperties}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            {showPass ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 [font-family:var(--font-poppins)] font-semibold text-white disabled:opacity-70"
          style={{ backgroundColor: BRAND.primary }}
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : "Entrar"}
        </button>
      </motion.form>
    </main>
  );
}

function Dashboard({
  data,
  reload,
}: {
  data: PanelData | null;
  reload: () => Promise<boolean>;
}) {
  const [refreshing, setRefreshing] = useState(false);

  async function logout() {
    await fetch("/api/painel/logout", { method: "POST" });
    window.location.reload();
  }

  async function refresh() {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }

  if (!data) return null;

  const choiceQs = questions.filter(
    (q) => q.type === "single" || q.type === "multi"
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-28 pb-24 [font-family:var(--font-poppins)]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="[font-family:var(--font-gohan)] text-3xl text-white">
            Painel de respostas
          </h1>
          <p className="text-muted-foreground [font-family:var(--font-poppins)] text-sm text-white">
            Pesquisa de satisfação · MarketGru
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="border-border bg-card hover:bg-muted flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
          >
            <RefreshCw
              className={refreshing ? "size-4 animate-spin" : "size-4"}
            />
            Atualizar
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: BRAND.dark }}
          >
            <LogOut className="size-4" /> Sair
          </button>
        </div>
      </div>

      {/* Total */}
      <div
        className="mb-8 rounded-3xl p-6 text-white shadow-lg"
        style={{ backgroundColor: BRAND.primary }}
      >
        <p className="text-sm/none opacity-90">Total de respostas</p>
        <p className="mt-2 text-5xl font-bold">{data.total}</p>
      </div>

      {/* Gráficos de escolha */}
      <div className="grid gap-5 sm:grid-cols-2">
        {choiceQs.map((q) => (
          <CountCard
            key={q.id}
            q={q}
            counts={data.counts[q.id] ?? {}}
            total={data.total}
          />
        ))}
      </div>

      {/* Respostas escritas */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <TextCard
          title="Produtos que sentem falta (Q2)"
          items={data.textAnswers.q2}
        />
        <TextCard
          title="Sugestões de melhoria (Q3)"
          items={data.textAnswers.q3}
        />
      </div>

      {(data.textAnswers.outros.q4.length > 0 ||
        data.textAnswers.outros.q6.length > 0) && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextCard
            title='Categorias "Outro" (Q4)'
            items={data.textAnswers.outros.q4}
          />
          <TextCard
            title='Prêmios "Outro" (Q6)'
            items={data.textAnswers.outros.q6}
          />
        </div>
      )}
    </main>
  );
}

function CountCard({
  q,
  counts,
  total,
}: {
  q: Question;
  counts: Record<string, number>;
  total: number;
}) {
  const rows = [
    ...(q.options ?? []),
    ...(q.allowOther ? [{ value: "outro", label: "Outro", emoji: "✍️" }] : []),
  ];
  const max = Math.max(1, ...rows.map((o) => counts[o.value] ?? 0));

  return (
    <div className="border-border bg-card rounded-3xl border p-5 shadow-sm">
      <h3 className="mb-4 text-sm leading-snug font-semibold">{q.title}</h3>
      <div className="flex flex-col gap-3">
        {rows.map((opt) => {
          const c = counts[opt.value] ?? 0;
          const pct = total ? Math.round((c / total) * 100) : 0;
          return (
            <div key={opt.value}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  {opt.emoji && <span>{opt.emoji}</span>}
                  {opt.label}
                </span>
                <span className="text-muted-foreground font-medium">
                  {c} · {pct}%
                </span>
              </div>
              <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: BRAND.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(c / max) * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TextCard({ title, items }: { title: string; items: TextItem[] }) {
  // Agrupa as respostas por condomínio para saber onde aplicar melhorias.
  const groups = new Map<string, string[]>();
  for (const it of items) {
    const key = it.condominio || "sem_condominio";
    const arr = groups.get(key) ?? [];
    arr.push(it.text);
    groups.set(key, arr);
  }
  // Ordem: segue a lista de condomínios, "sem informação" por último.
  const order = [...CONDOMINIOS.map((c) => c.value), "sem_condominio"];
  const sortedKeys = [...groups.keys()].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );

  return (
    <div className="border-border bg-card rounded-3xl border p-5 shadow-sm">
      <h3 className="mb-3 flex items-center justify-between text-sm font-semibold">
        {title}
        <span className="text-muted-foreground font-normal">
          {items.length}
        </span>
      </h3>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nenhuma resposta ainda.</p>
      ) : (
        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-1">
          {sortedKeys.map((key) => {
            const list = groups.get(key) ?? [];
            const label =
              key === "sem_condominio"
                ? "Sem condomínio informado"
                : (CONDO_LABEL[key] ?? key);
            return (
              <div key={key}>
                <p
                  className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wide uppercase"
                  style={{ color: BRAND.primary }}
                >
                  {label}
                  <span className="text-muted-foreground font-normal normal-case">
                    {list.length}
                  </span>
                </p>
                <ul className="flex flex-col gap-2">
                  {list.map((t, i) => (
                    <li
                      key={i}
                      className="bg-muted rounded-xl px-3 py-2 text-sm leading-snug"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
