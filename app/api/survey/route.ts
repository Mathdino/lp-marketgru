import { NextResponse } from "next/server";
import { addResponse } from "@/lib/survey-store";
import type { SurveyResponse } from "@/lib/survey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    const q1 = str(body.q1);
    const q4 = Array.isArray(body.q4)
      ? body.q4.filter((x: unknown) => typeof x === "string")
      : [];
    const q5 = str(body.q5);
    const q6 = str(body.q6);

    // Validação mínima dos campos obrigatórios
    if (!q1 || q4.length === 0 || !q5 || !q6) {
      return NextResponse.json(
        { ok: false, error: "Responda todas as perguntas obrigatórias." },
        { status: 400 },
      );
    }

    const entry: SurveyResponse = {
      id: `${Date.now()}-${Math.round(Number.MAX_SAFE_INTEGER * Math.random())}`,
      createdAt: new Date().toISOString(),
      q1,
      q2: str(body.q2),
      q3: str(body.q3),
      q4,
      q4_outro: str(body.q4_outro) || undefined,
      q5,
      q6,
      q6_outro: str(body.q6_outro) || undefined,
    };

    await addResponse(entry);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao salvar a resposta." },
      { status: 500 },
    );
  }
}
