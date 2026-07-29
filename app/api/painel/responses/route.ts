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
    if (counts.q1 && r.q1) counts.q1[r.q1] = (counts.q1[r.q1] ?? 0) + 1;
    if (counts.q5 && r.q5) counts.q5[r.q5] = (counts.q5[r.q5] ?? 0) + 1;
    if (counts.q6 && r.q6) counts.q6[r.q6] = (counts.q6[r.q6] ?? 0) + 1;
    if (counts.q4 && Array.isArray(r.q4)) {
      for (const v of r.q4) counts.q4[v] = (counts.q4[v] ?? 0) + 1;
    }
  }

  const textAnswers = {
    q2: responses.map((r) => r.q2).filter(Boolean),
    q3: responses.map((r) => r.q3).filter(Boolean),
    outros: {
      q4: responses.map((r) => r.q4_outro).filter(Boolean),
      q6: responses.map((r) => r.q6_outro).filter(Boolean),
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
