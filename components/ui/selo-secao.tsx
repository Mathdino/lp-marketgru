import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* =============================================================================
   SELO DE SEÇÃO — a linha miúda em caixa alta que antecede o H2.

   Antes era um filete neutro; agora cada seção entra com o ícone do próprio
   assunto, que é o que diferencia um selo do outro numa rolagem rápida.
   O ícone é decorativo: quem lê por leitor de tela ouve só o texto do selo.
   ========================================================================== */

export function SeloSecao({
  icone: Icone,
  children,
}: {
  icone: LucideIcon;
  children: ReactNode;
}): ReactNode {
  return (
    <span className="mb-3 inline-flex items-center gap-2 [font-family:var(--font-poppins)] text-[12px] font-semibold tracking-[0.14em] text-[var(--mg-accent)] uppercase">
      <Icone
        aria-hidden="true"
        strokeWidth={2.25}
        className="h-[15px] w-[15px] shrink-0"
      />
      {children}
    </span>
  );
}
