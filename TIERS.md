# Arquitetura de Tiers — marketgru.com.br

Padrão **dispatcher + array** do Base Padrão da Busca Orgânica, adaptado ao Next.js
(App Router). Método e estratégia: `GUIA TIER/ESTRUTURA-TIERS.md`,
`DIRETRIZES-CONTEUDO.md` e `PLAYBOOK-COLABORADOR.md`.

> **Regra de ouro:** criar página = adicionar 1 entrada num array. Não se cria
> arquivo de rota por página e não se edita o sitemap à mão.

---

## 1. Rotas e fontes de dados

| Tier                  | URL                                           | Dispatcher                        | Array                            | Schema                                    |
| --------------------- | --------------------------------------------- | --------------------------------- | -------------------------------- | ----------------------------------------- |
| Hub de atuação        | `/{slug}`                                     | `app/[slug]/page.tsx`             | `lib/atuacao-data.ts`            | `Service` + `FAQPage`                     |
| Keyword (cauda longa) | `/{slug}`                                     | `app/[slug]/page.tsx`             | `lib/blog-data.ts` (`isKeyword`) | `Article`                                 |
| Post                  | `/blog/{slug}`                                | `app/blog/[slug]/page.tsx`        | `lib/blog-data.ts`               | `Article`                                 |
| Listagem de atuação   | `/atuacao`                                    | `app/atuacao/page.tsx`            | `lib/atuacao-data.ts`            | `CollectionPage` + `ItemList` + `FAQPage` |
| Listagem de blog      | `/blog`                                       | `app/blog/page.tsx`               | `lib/blog-data.ts`               | `CollectionPage` + `ItemList`             |
| Institucionais        | `/`, `/minimercado`, `/sobre-nos`, `/contato` | páginas próprias                  | —                                | `Service` / `AboutPage` / `ContactPage`   |
| Geradores             | `/sitemap.xml`, `/robots.txt`                 | `app/sitemap.ts`, `app/robots.ts` | todos os arrays                  | —                                         |

`app/[slug]/page.tsx` resolve nesta ordem: **área de atuação → página de
keyword → `notFound()`**. Slug que não casa com nenhum array dá 404 de verdade;
página 200 com conteúdo vazio é soft 404 e queima rastreio.

---

## 2. Mapa publicado

**Áreas de atuação (2)** — `lib/atuacao-data.ts`

| URL                        | Recorte que justifica a página                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `/mercado-para-condominio` | Síndico/assembleia decide; mix de reposição doméstica; pico noturno; objeção central é furto                        |
| `/mercado-para-empresas`   | Facilities/RH decide; mix de consumo imediato; pico nas viradas de turno; existe subsídio e crédito por colaborador |

As duas páginas **não compartilham nenhum parágrafo**. É a regra anti-doorway
do guia: página que é a mesma trocando o segmento é conteúdo duplicado, e o
Google trata como tal.

**Hub** — `/atuacao`, com o comparativo entre os dois segmentos. Esse comparativo
é o conteúdo que só o hub pode ter; hub que resume as filhas é página fina.

---

## 3. Como adicionar uma área nova

1. Uma entrada em `lib/atuacao-data.ts`.
2. Só isso.

Entram sozinhos: a rota (`app/[slug]`), o menu suspenso (a nav lê o mesmo
array), o hub `/atuacao`, o sitemap e o schema.

Campos obrigatórios e as regras que o guia fixa para eles:

| Campo             | Regra                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `metaTitle`       | ≤ 60 caracteres, com a keyword, **sem** a marca (o template do Next acrescenta `\| MarketGRU`)  |
| `metaDescription` | 130–160 caracteres, com keyword + diferencial                                                   |
| `h1`              | Único na página, com a keyword                                                                  |
| `resumo`          | **Answer-first**: 1–2 frases que respondem antes de qualquer contexto. É o trecho citado por IA |
| `numeros`         | Fatos concretos. Motor generativo cita número, não adjetivo                                     |
| `blocos`          | `texto`, `lista`, `tabela` ou `passos`. Headings semânticos saem do tipo                        |
| `faq`             | 3–6 perguntas reais. Vira `FAQPage` a partir do mesmo array que a tela mostra                   |
| `relacionados`    | Pirâmide de autoridade: hub aponta para a cauda longa e para o blog                             |

---

## 4. Schema

`lib/schema.ts` concentra os construtores. Três decisões que não devem ser afrouxadas:

- **Renderizado no servidor.** `components/seo/json-ld.tsx` não tem `"use client"`.
  JSON-LD montado no cliente passa no Rich Results Test e desaparece para todo
  agente que não executa script — exatamente o público que se quer atingir.
- **Grafo costurado por `@id`.** `Organization` e `WebSite` entram em toda página
  e os demais nós os referenciam. Antes havia um `Organization` solto no
  `layout.tsx`, sem `@id`: somado ao novo, virava **duas entidades** disputando
  a mesma marca no mesmo HTML. Foi removido.
- **Paridade markup ↔ tela.** O `FAQPage` sai do mesmo array que o acordeão
  renderiza; o `ItemList` lista o que está naquela página, nunca o site inteiro.

O FAQ da home mora em `lib/faq-home.ts`, um módulo **sem** `"use client"`.
Dado dentro de módulo cliente importado por Server Component chega como proxy no
build (`FAQS.map is not a function`) — por isso a separação.

---

## 5. Design e animação

- **Dois temas.** Tokens em `app/globals.css`. O acento da marca tem três
  variantes porque `#f8301a` sobre branco dá 3,87:1 e reprova no AA:

  | Token              | Valor                              | Uso                                                      |
  | ------------------ | ---------------------------------- | -------------------------------------------------------- |
  | `--mg-accent`      | `#d9260f` claro / `#ff5a41` escuro | Texto e acento sobre o fundo da página (4,96:1 nos dois) |
  | `--mg-accent-soft` | `#f8301a`                          | Preenchimento decorativo, sem texto em cima              |
  | `--frame-accent`   | `#ff5a41` claro / `#d9260f` escuro | Sobre a moldura (`--frame`), que **inverte** com o tema  |

  O rodapé usava `#f82f19` fixo e ficava em 3,72:1 no tema escuro, onde a
  moldura é clara. Agora usa `--frame-accent`.

- **GSAP.** `components/ui/gsap-reveal.tsx` (entrada em série),
  `components/atuacao/linha-passos.tsx` (traço da linha do tempo com `scrub`) e
  `numeros-strip.tsx`. Três regras:
  1. O estado inicial é aplicado por JS (`gsap.set`), **nunca** por CSS. Se o
     script não rodar, o conteúdo aparece.
  2. `gsap.matchMedia()` cobre breakpoint e `prefers-reduced-motion`, e reverte
     sozinho. Com movimento reduzido nada é animado.
  3. Gatilho em `top 95%` e duração abaixo de meio segundo. Animação que faz
     esperar para ler atrapalha a leitura.

  A faixa de números **não** conta de 0 até o valor, de propósito: número que
  anima é número que fica errado no caminho, e o argumento central da página é
  "R$ 0 de implantação".

- **Menu suspenso.** A visibilidade é do CSS (`data-aberto`), não da biblioteca
  de animação — se o motion não rodar, o menu ainda abre. Os itens são `<Link>`
  reais e existem no DOM mesmo fechados, então o crawler os segue sem simular
  interação. Abre por clique, hover e foco; fecha com Escape devolvendo o foco
  ao gatilho.

---

## 6. O que ficou pendente

- **Cobertura geográfica** está escrita como São Paulo e região metropolitana,
  a partir do `llms.txt` existente. Se a operação já atende outras praças, a
  frase precisa mudar em `lib/atuacao-data.ts` e no `llms.txt`.
- **Números de condomínio e empresa** (6 m², 8 m², faixas de formato, prazo de
  15 a 30 dias) foram derivados do material existente e da lógica do serviço.
  **Confirme com a operação antes de publicar** — são os fatos que um motor
  generativo vai citar, e citar errado é pior que não citar.
- `siteConfig` existe duplicado em `lib/config.ts` e `lib/metadata.ts`, com
  nomes diferentes para a mesma marca ("Market Gru" e "MarketGRU"). Vale
  unificar num só arquivo.
