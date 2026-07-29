import { NextResponse } from "next/server";
import {
  PANEL_EMAIL,
  PANEL_PASSWORD,
  SESSION_COOKIE,
  SESSION_TOKEN,
} from "@/lib/survey-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (email.toLowerCase() !== PANEL_EMAIL || password !== PANEL_PASSWORD) {
      return NextResponse.json(
        { ok: false, error: "E-mail ou senha inválidos." },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro no login." },
      { status: 500 },
    );
  }
}
