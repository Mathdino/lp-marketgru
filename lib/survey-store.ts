import "server-only";
import { neon } from "@neondatabase/serverless";
import type { SurveyResponse } from "@/lib/survey";

/** Credenciais do painel MarketGru */
export const PANEL_EMAIL = "contato@marketgru.com.br";
export const PANEL_PASSWORD = "markerGRU@1";
export const SESSION_COOKIE = "mg_panel_session";
export const SESSION_TOKEN = "mg-panel-authenticated-v1";

type SqlClient = ReturnType<typeof neon>;
let _sql: SqlClient | null = null;

/** Cliente Neon criado sob demanda (evita avaliar no build sem env). */
function getSql(): SqlClient {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL não configurada.");
    _sql = neon(url);
  }
  return _sql;
}

let ready: Promise<void> | null = null;

/** Cria a tabela uma única vez por instância. */
function ensureTable(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS survey_responses (
          id          TEXT PRIMARY KEY,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
          condominio  TEXT NOT NULL DEFAULT '',
          q1          TEXT NOT NULL,
          q2          TEXT DEFAULT '',
          q3          TEXT DEFAULT '',
          q4          JSONB NOT NULL DEFAULT '[]'::jsonb,
          q4_outro    TEXT,
          q5          TEXT NOT NULL,
          q6          TEXT NOT NULL,
          q6_outro    TEXT
        )
      `;
      // Migração incremental: adiciona coluna em bancos já existentes sem resetar.
      await sql`
        ALTER TABLE survey_responses
        ADD COLUMN IF NOT EXISTS condominio TEXT NOT NULL DEFAULT ''
      `;
    })().catch((err) => {
      ready = null; // permite retry em caso de falha
      throw err;
    });
  }
  return ready;
}

interface Row {
  id: string;
  created_at: string | Date;
  condominio: string | null;
  q1: string;
  q2: string | null;
  q3: string | null;
  q4: string[] | null;
  q4_outro: string | null;
  q5: string;
  q6: string;
  q6_outro: string | null;
}

function toResponse(r: Row): SurveyResponse {
  return {
    id: r.id,
    createdAt:
      r.created_at instanceof Date
        ? r.created_at.toISOString()
        : new Date(r.created_at).toISOString(),
    condominio: r.condominio ?? "",
    q1: r.q1,
    q2: r.q2 ?? "",
    q3: r.q3 ?? "",
    q4: Array.isArray(r.q4) ? r.q4 : [],
    q4_outro: r.q4_outro ?? undefined,
    q5: r.q5,
    q6: r.q6,
    q6_outro: r.q6_outro ?? undefined,
  };
}

export async function readResponses(): Promise<SurveyResponse[]> {
  await ensureTable();
  const rows = (await getSql()`
    SELECT id, created_at, condominio, q1, q2, q3, q4, q4_outro, q5, q6, q6_outro
    FROM survey_responses
    ORDER BY created_at ASC
  `) as Row[];
  return rows.map(toResponse);
}

export async function addResponse(entry: SurveyResponse): Promise<void> {
  await ensureTable();
  await getSql()`
    INSERT INTO survey_responses
      (id, created_at, condominio, q1, q2, q3, q4, q4_outro, q5, q6, q6_outro)
    VALUES (
      ${entry.id},
      ${entry.createdAt},
      ${entry.condominio},
      ${entry.q1},
      ${entry.q2},
      ${entry.q3},
      ${JSON.stringify(entry.q4)}::jsonb,
      ${entry.q4_outro ?? null},
      ${entry.q5},
      ${entry.q6},
      ${entry.q6_outro ?? null}
    )
  `;
}
