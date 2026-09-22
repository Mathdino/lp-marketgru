import type { MetadataRoute } from "next";

import { ATUACAO_AREAS } from "@/lib/atuacao-data";
import { BLOG_POSTS } from "@/lib/blog-data";
import { siteConfig } from "@/lib/metadata";

/* =============================================================================
   SITEMAP GERADO

   Substitui o public/sitemap.xml escrito à mão. Regra de ouro do guia TIER:
   não se edita sitemap à mão — ele se gera a partir dos mesmos arrays que
   geram as páginas. Sitemap manual fica desatualizado no dia em que alguém
   publica uma página e esquece do arquivo, e aí o sitemap passa a contradizer
   o próprio site.

   O que ficou de fora, e por quê:
    · <priority> — o Google ignora por completo. Manter é ruído.
    · <changefreq> — idem.
    · /painel, /pesquisa e /api — bloqueados no robots.ts; URL bloqueada
      dentro do sitemap é contradição que só gasta rastreio.

   `lastModified` só é honesto quando reflete alteração real. O conteúdo destas
   páginas mora em arquivos versionados, então a data de build é a melhor
   aproximação disponível — e é estável entre deploys sem mudança de conteúdo.
   ========================================================================== */

const BASE = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  const fixas = [
    "/",
    "/atuacao",
    "/minimercado",
    "/sobre-nos",
    "/blog",
    "/contato",
  ];

  const areas = ATUACAO_AREAS.map((a) => `/${a.slug}`);

  const keywords = BLOG_POSTS.filter((p) => p.isKeyword).map((p) => `/${p.slug}`);

  const posts = BLOG_POSTS.filter((p) => !p.isKeyword).map(
    (p) => `/blog/${p.slug}`
  );

  return [...fixas, ...areas, ...keywords, ...posts].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: agora,
  }));
}
