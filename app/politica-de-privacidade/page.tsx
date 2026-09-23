import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CookiePreferencesButton } from "@/components/layout/cookie-consent";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/metadata";

/* =============================================================================
   POLÍTICA DE PRIVACIDADE

   Texto-base escrito a partir do que o site faz hoje (GA4 com Consent Mode,
   formulário que abre o WhatsApp, pesquisa de satisfação). Precisa ser
   revisado pela MarketGRU — razão social, CNPJ e encarregado (DPO) entram
   quando forem informados. Se o site ganhar um pixel de anúncio ou outro
   formulário, esta página muda junto.

   Fundo sólido pelo mesmo motivo da 404: o texto começa alto e cairia em
   cima do shader do layout.
   ========================================================================== */

export const metadata: Metadata = createMetadata({
  title: "Política de privacidade",
  description:
    "Como a MarketGRU trata dados pessoais e cookies neste site, em conformidade com a LGPD.",
  path: "/politica-de-privacidade",
});

const ATUALIZADA_EM = "23 de setembro de 2026";

export default function PoliticaPrivacidadePage(): ReactNode {
  const email = siteConfig.contact.email;

  return (
    <main
      id="main-content"
      className="bg-background relative z-0 w-full [font-family:var(--font-poppins)]"
    >
      <article className="text-foreground/80 [&_h2]:text-foreground mx-auto w-full max-w-3xl px-6 pt-40 pb-20 text-[15px] leading-[1.7] sm:px-10 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="text-foreground [font-family:var(--font-gohan)] text-[2rem] leading-[1.15] tracking-wider sm:text-[2.5rem]">
          Política de privacidade
        </h1>
        <p className="text-foreground/55 mt-3 text-[13px]">
          Atualizada em {ATUALIZADA_EM}
        </p>

        <p className="mt-8">
          Esta política explica quais dados pessoais a MarketGRU trata quando
          você usa o site {siteConfig.url.replace("https://", "")}, para quê, e
          como exercer os seus direitos previstos na Lei Geral de Proteção de
          Dados (Lei 13.709/2018 — LGPD).
        </p>

        <h2>1. Quais dados tratamos</h2>
        <ul>
          <li>
            <strong>Formulário de contato (botão do WhatsApp):</strong> nome,
            e-mail, telefone, perfil e mensagem que você digitar. Esses dados
            não ficam guardados no site — eles são usados para montar a mensagem
            que abre no seu WhatsApp, e só chegam até nós se você enviar.
          </li>
          <li>
            <strong>Pesquisa de satisfação:</strong> nome do condomínio e as
            respostas do questionário, guardados para avaliarmos o serviço.
          </li>
          <li>
            <strong>Navegação (somente com a sua autorização):</strong> páginas
            visitadas, tempo de permanência, tipo de dispositivo, cidade
            aproximada e origem do acesso, coletados pelo Google Analytics de
            forma agregada.
          </li>
        </ul>

        <h2>2. Para que usamos e com qual base legal</h2>
        <ul>
          <li>
            Responder contatos e apresentar a proposta de minimercado —
            procedimentos preliminares a contrato, a seu pedido (art. 7º, V).
          </li>
          <li>
            Melhorar o serviço a partir da pesquisa — legítimo interesse (art.
            7º, IX).
          </li>
          <li>
            Medir o uso do site — consentimento (art. 7º, I), que você dá ou
            recusa no aviso de cookies.
          </li>
        </ul>

        <h2>3. Cookies</h2>
        <p>
          Cookies são pequenos arquivos gravados no seu navegador. Usamos três
          categorias:
        </p>
        <ul>
          <li>
            <strong>Essenciais</strong> (sempre ativos): lembram a sua escolha
            sobre cookies (<code>mg_consent</code>, 12 meses) e mantêm a sessão
            da área administrativa.
          </li>
          <li>
            <strong>Análise</strong> (opcional): Google Analytics, cookies{" "}
            <code>_ga</code> e <code>_ga_*</code> (até 2 anos).
          </li>
          <li>
            <strong>Marketing</strong> (opcional): medição de anúncios e
            remarketing do Google. Hoje o site não usa esses cookies; a escolha
            fica registrada caso passe a usar.
          </li>
        </ul>
        <p className="mt-3">
          Enquanto você não autoriza, o Google Analytics funciona no modo de
          consentimento negado: não grava cookies e recebe apenas sinais
          anônimos, sem identificador do seu navegador. Você pode mudar a
          escolha a qualquer momento:{" "}
          <CookiePreferencesButton className="text-foreground cursor-pointer underline underline-offset-2" />
          .
        </p>

        <h2>4. Com quem compartilhamos</h2>
        <ul>
          <li>
            <strong>Google</strong> (Google Analytics), quando você autoriza a
            análise. O Google pode tratar dados fora do Brasil, com as garantias
            previstas nos seus termos.
          </li>
          <li>
            <strong>WhatsApp (Meta)</strong>, quando você escolhe falar conosco
            por lá.
          </li>
          <li>
            <strong>Provedores de hospedagem e banco de dados</strong> que
            mantêm o site no ar.
          </li>
        </ul>
        <p className="mt-3">Não vendemos dados pessoais.</p>

        <h2>5. Por quanto tempo guardamos</h2>
        <p>
          Contatos, pelo tempo da negociação e do contrato que dela resultar.
          Respostas da pesquisa, enquanto forem úteis para avaliar o serviço.
          Dados do Google Analytics, pelo prazo de retenção configurado na
          ferramenta (até 14 meses).
        </p>

        <h2>6. Seus direitos</h2>
        <p>
          Você pode pedir confirmação de que tratamos seus dados, acesso,
          correção, anonimização ou eliminação, portabilidade, informação sobre
          compartilhamento e revogação do consentimento. Basta escrever para{" "}
          <a
            href={`mailto:${email}`}
            className="text-foreground underline underline-offset-2"
          >
            {email}
          </a>
          . Você também pode reclamar à Autoridade Nacional de Proteção de Dados
          (ANPD).
        </p>

        <h2>7. Segurança</h2>
        <p>
          O site usa conexão criptografada (HTTPS) e o acesso aos dados é
          restrito a quem precisa deles para atender você.
        </p>

        <h2>8. Mudanças nesta política</h2>
        <p>
          Quando esta política mudar, a data no topo da página é atualizada. Se
          a mudança afetar o uso de cookies, o aviso volta a aparecer para você
          escolher de novo.
        </p>
      </article>
    </main>
  );
}
