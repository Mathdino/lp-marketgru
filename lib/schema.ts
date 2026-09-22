import { siteConfig } from "@/lib/metadata";
import { siteConfig as contactConfig } from "@/lib/config";

/* =============================================================================
   SCHEMA.ORG — construtores de nós JSON-LD.

   Tudo aqui roda no SERVIDOR (Server Component). JSON-LD montado no cliente
   passa no Rich Results Test e some para quem não executa JavaScript — que é
   metade dos agentes de IA que hoje leem o site.

   Regra que vale para todos os nós: **não marque o que não está na tela.**
   Número, FAQ e nome de serviço no JSON-LD têm que existir no HTML renderizado.
   Schema que promete o que a página não mostra é o caminho mais curto para
   perder o rich result inteiro.

   Costura do grafo: todos os nós usam `@id` e se referenciam entre si, em vez
   de ficarem soltos. É o que permite ao Google (e ao crawler de IA) entender
   que a Organization da home é a mesma do provider do Service.
   ========================================================================== */

const URL_BASE = siteConfig.url;

export const ID_ORG = `${URL_BASE}/#organization`;
export const ID_SITE = `${URL_BASE}/#website`;

export function urlAbs(path: string): string {
  return path.startsWith("http") ? path : `${URL_BASE}${path}`;
}

/* ─── Organization ────────────────────────────────────────────────────────── */
/**
 * Âncora de entidade da marca. É este nó que o Google e os motores generativos
 * usam para saber *quem* está respondendo.
 *
 * `knowsAbout` não é enfeite: é o campo que ancora a marca nos temas que ela
 * domina, e o que sustenta a citação em resposta de IA sobre o assunto.
 */
export function schemaOrganization() {
  return {
    "@type": "Organization",
    "@id": ID_ORG,
    name: siteConfig.name,
    alternateName: "Market Gru",
    url: URL_BASE,
    logo: {
      "@type": "ImageObject",
      url: urlAbs("/logo-black.png"),
      caption: siteConfig.name,
    },
    image: urlAbs(siteConfig.ogImage),
    description: siteConfig.description,
    email: contactConfig.contact.email,
    telephone: contactConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: contactConfig.contact.phone,
        contactType: "sales",
        areaServed: "BR",
        availableLanguage: "Portuguese",
      },
    ],
    sameAs: [
      contactConfig.social.instagram,
      contactConfig.social.facebook,
      contactConfig.social.youtube,
    ],
    areaServed: { "@type": "State", name: "São Paulo" },
    knowsAbout: [
      "Minimercado autônomo",
      "Mercado autônomo para condomínios",
      "Mercado autônomo para empresas",
      "Honest market",
      "Loja autônoma 24 horas",
      "Franquia de minimercado",
      "Microfranquia",
    ],
  };
}

/* ─── WebSite ─────────────────────────────────────────────────────────────── */
export function schemaWebSite() {
  return {
    "@type": "WebSite",
    "@id": ID_SITE,
    url: URL_BASE,
    name: siteConfig.name,
    publisher: { "@id": ID_ORG },
    inLanguage: "pt-BR",
  };
}

/* ─── BreadcrumbList ──────────────────────────────────────────────────────── */
/**
 * Mínimo 2 itens, `position` sequencial começando em 1, e o ÚLTIMO item sem
 * `item` — ele é a página atual, não um link.
 *
 * `trilha` não inclui a home: ela é adicionada aqui.
 */
export function schemaBreadcrumb(
  trilha: { nome: string; path: string }[],
  canonical: string
) {
  const itens = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: URL_BASE + "/",
    },
    ...trilha.map((t, i) => {
      const ultimo = i === trilha.length - 1;
      return {
        "@type": "ListItem",
        position: i + 2,
        name: t.nome,
        ...(ultimo ? {} : { item: urlAbs(t.path) }),
      };
    }),
  ];

  return {
    "@type": "BreadcrumbList",
    "@id": `${urlAbs(canonical)}#breadcrumb`,
    itemListElement: itens,
  };
}

/* ─── WebPage ─────────────────────────────────────────────────────────────── */
export function schemaWebPage({
  canonical,
  nome,
  descricao,
  imagem,
}: {
  canonical: string;
  nome: string;
  descricao: string;
  imagem?: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${urlAbs(canonical)}#webpage`,
    url: urlAbs(canonical),
    name: nome,
    description: descricao,
    inLanguage: "pt-BR",
    isPartOf: { "@id": ID_SITE },
    about: { "@id": ID_ORG },
    publisher: { "@id": ID_ORG },
    ...(imagem ? { primaryImageOfPage: urlAbs(imagem) } : {}),
    breadcrumb: { "@id": `${urlAbs(canonical)}#breadcrumb` },
  };
}

/* ─── Service ─────────────────────────────────────────────────────────────── */
/**
 * O nó de serviço de cada área de atuação.
 *
 * `offers` com `price: "0"` descreve o que a página afirma no texto: não há
 * custo de implantação para o contratante. Preço no schema precisa bater com o
 * que está escrito na tela — e está.
 */
export function schemaService({
  canonical,
  nome,
  descricao,
  audiencia,
}: {
  canonical: string;
  nome: string;
  descricao: string;
  audiencia: string;
}) {
  return {
    "@type": "Service",
    "@id": `${urlAbs(canonical)}#service`,
    name: nome,
    description: descricao,
    serviceType: "Instalação e operação de minimercado autônomo",
    provider: { "@id": ID_ORG },
    areaServed: { "@type": "State", name: "São Paulo" },
    audience: { "@type": "BusinessAudience", audienceType: audiencia },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      description: "Implantação, equipamentos e manutenção sem custo para o contratante",
      availability: "https://schema.org/InStock",
      seller: { "@id": ID_ORG },
    },
    mainEntityOfPage: { "@id": `${urlAbs(canonical)}#webpage` },
  };
}

/* ─── FAQPage ─────────────────────────────────────────────────────────────── */
/**
 * O rich result sanfonado de FAQ acabou na SERP, mas o bloco continua valendo
 * para o featured snippet e, principalmente, para citação por motor generativo.
 *
 * Só emita a partir das MESMAS perguntas que estão visíveis no HTML. É por isso
 * que a função recebe o array que o componente também renderiza.
 */
export function schemaFaq(
  faq: { q: string; a: string }[],
  canonical: string
) {
  if (!faq.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${urlAbs(canonical)}#faq`,
    isPartOf: { "@id": ID_SITE },
    about: { "@id": ID_ORG },
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/* ─── CollectionPage + ItemList ───────────────────────────────────────────── */
/**
 * O ItemList lista **o que está na tela daquela página**, nada além disso.
 * Página de hub que lista 2 áreas emite 2 itens — não as 14 páginas de cauda
 * longa que existem no site.
 */
export function schemaCollection({
  canonical,
  nome,
  descricao,
  itens,
}: {
  canonical: string;
  nome: string;
  descricao: string;
  itens: { nome: string; path: string; descricao?: string }[];
}) {
  return {
    "@type": "CollectionPage",
    "@id": `${urlAbs(canonical)}#collection`,
    url: urlAbs(canonical),
    name: nome,
    description: descricao,
    inLanguage: "pt-BR",
    isPartOf: { "@id": ID_SITE },
    about: { "@id": ID_ORG },
    breadcrumb: { "@id": `${urlAbs(canonical)}#breadcrumb` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itens.length,
      itemListElement: itens.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.nome,
        url: urlAbs(it.path),
        ...(it.descricao ? { description: it.descricao } : {}),
      })),
    },
  };
}

/* ─── Article ─────────────────────────────────────────────────────────────── */

const MESES_PT: Record<string, string> = {
  jan: "01",
  fev: "02",
  mar: "03",
  abr: "04",
  mai: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  set: "09",
  out: "10",
  nov: "11",
  dez: "12",
};

/**
 * `datePublished` e `dateModified` exigem ISO 8601. O campo `date` do array é
 * escrito para leitura humana ("26 Mai, 2026") e, nas páginas de keyword, às
 * vezes nem é data ("SEO") — jogar esse texto cru no JSON-LD invalida a data
 * inteira aos olhos do Google.
 *
 * Converte o que dá para converter e devolve `undefined` no resto. Data
 * ausente é válida em Article; data inventada, não — por isso aqui não se
 * chuta uma data para preencher o campo.
 */
function paraIso(valor?: string): string | undefined {
  if (!valor) return undefined;

  const bruto = valor.trim();

  /* Já em ISO (2026-05-26 ou 2026-05-26T10:00:00Z) */
  if (/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(bruto)) return bruto;

  /* "26 Mai, 2026" / "07 mai 2026" */
  const m = /^(\d{1,2})\s+([A-Za-zçÇ]{3,})\.?,?\s+(\d{4})$/.exec(bruto);
  if (!m) return undefined;

  const dia = m[1];
  const mesTexto = m[2];
  const ano = m[3];
  if (!dia || !mesTexto || !ano) return undefined;

  const mes = MESES_PT[mesTexto.slice(0, 3).toLowerCase()];
  if (!mes) return undefined;

  return `${ano}-${mes}-${dia.padStart(2, "0")}`;
}

export function schemaArticle({
  canonical,
  titulo,
  descricao,
  imagem,
  publicado,
  modificado,
}: {
  canonical: string;
  titulo: string;
  descricao: string;
  imagem?: string;
  publicado?: string;
  modificado?: string;
}) {
  return {
    "@type": "Article",
    "@id": `${urlAbs(canonical)}#article`,
    headline: titulo,
    description: descricao,
    inLanguage: "pt-BR",
    author: { "@id": ID_ORG },
    publisher: { "@id": ID_ORG },
    ...(imagem ? { image: [urlAbs(imagem)] } : {}),
    ...(paraIso(publicado) ? { datePublished: paraIso(publicado) } : {}),
    ...(paraIso(modificado) ? { dateModified: paraIso(modificado) } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": urlAbs(canonical) },
  };
}

/* ─── Emissão ─────────────────────────────────────────────────────────────── */
/**
 * Monta o @graph. Organization e WebSite entram em toda página: é o que costura
 * a entidade da marca em cada URL, em vez de existir só na home.
 */
export function montarGrafo(nos: (object | null | undefined)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [schemaOrganization(), schemaWebSite(), ...nos.filter(Boolean)],
  };
}
