import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readResponses, SESSION_COOKIE, SESSION_TOKEN } from "@/lib/survey-store";
import { questions } from "@/lib/survey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const store = await cookies();
  if (store.get(SESSION_COOKIE)?.value !== SESSION_TOKEN) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  const responses = await readResponses();

  // Agregações por pergunta de escolha
  const counts: Record<string, Record<string, number>> = {};
  for (const q of questions) {
    if (q.type === "single" || q.type === "multi") {
      const c: Record<string, number> = {};
      for (const opt of q.options ?? []) c[opt.value] = 0;
      if (q.allowOther) c["outro"] = 0;
      counts[q.id] = c;
    }
  }

  for (const r of responses) {
    if (counts.condominio && r.condominio)
      counts.condominio[r.condominio] =
        (counts.condominio[r.condominio] ?? 0) + 1;
    if (counts.q1 && r.q1) counts.q1[r.q1] = (counts.q1[r.q1] ?? 0) + 1;
    if (counts.q5 && r.q5) counts.q5[r.q5] = (counts.q5[r.q5] ?? 0) + 1;
    if (counts.q6 && r.q6) counts.q6[r.q6] = (counts.q6[r.q6] ?? 0) + 1;
    if (counts.q4 && Array.isArray(r.q4)) {
      for (const v of r.q4) counts.q4[v] = (counts.q4[v] ?? 0) + 1;
    }
  }

  // Respostas escritas com o condomínio de origem, para separar por local.
  const withCond = (pick: (r: (typeof responses)[number]) => string) =>
    responses
      .map((r) => ({ text: pick(r), condominio: r.condominio || "" }))
      .filter((x) => x.text);

  const textAnswers = {
    q2: withCond((r) => r.q2),
    q3: withCond((r) => r.q3),
    outros: {
      q4: withCond((r) => r.q4_outro ?? ""),
      q6: withCond((r) => r.q6_outro ?? ""),
    },
  };

  return NextResponse.json({
    ok: true,
    total: responses.length,
    counts,
    textAnswers,
    responses: [...responses].reverse(),
  });
}
