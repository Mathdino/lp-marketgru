import {
  Building2,
  Briefcase,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

/* =============================================================================
   ÁREAS DE ATUAÇÃO — padrão TIER (dispatcher + array)

   Regra de ouro do guia: criar página = adicionar 1 entrada neste array.
   Não se cria arquivo de rota por página e não se edita o sitemap à mão —
   `app/[slug]/page.tsx` despacha e `app/sitemap.ts` lê daqui.

   REGRAS INEGOCIÁVEIS (DIRETRIZES-CONTEUDO.md, anti-doorway)
    1. Conteúdo ÚNICO por página. Proibido "mesma página trocando o segmento".
       Condomínio e empresa não compartilham nenhum parágrafo: o ângulo, os
       números, as objeções e o FAQ são de fato diferentes, porque quem decide
       é diferente (síndico x RH/facilities) e o que ele mede é diferente
       (valorização e conveniência x produtividade e retenção).
    2. metaTitle ≤ 60 caracteres, com a keyword, SEM repetir a marca — o
       template do Next já acrescenta "| MarketGRU".
    3. metaDescription entre 130 e 160 caracteres, com keyword + diferencial.
    4. `resumo` é ANSWER-FIRST: 1–2 frases que respondem a intenção antes de
       qualquer contexto. É o trecho que motor generativo cita.
    5. FAQ de 3 a 6 perguntas REAIS, que viram FAQPage.
    6. Uma página, uma intenção. Sem canibalizar as páginas de keyword que já
       existem em BLOG_POSTS (essas são de cauda longa; estas são os hubs).
   ========================================================================== */

export type AtuacaoBloco =
  | { tipo: "texto"; titulo: string; paragrafos: string[] }
  | {
      tipo: "lista";
      titulo: string;
      intro?: string;
      /* Selo acima do H2. Sem estes dois, a view cai no padrão do bloco
         ("Em detalhe" + lupa); com eles, a seção entra com o assunto dela. */
      selo?: string;
      seloIcone?: LucideIcon;
      /* Item com `imagem` vira cartão ilustrado (título sobre a foto, texto
         subindo no hover); sem imagem, segue como cartão de texto. A view
         decide sozinha, então a escolha do formato mora no dado. */
      itens: {
        titulo: string;
        texto: string;
        imagem?: string;
        imagemAlt?: string;
      }[];
    }
  | {
      tipo: "tabela";
      titulo: string;
      intro?: string;
      legenda: string;
      colunas: string[];
      linhas: string[][];
    }
  | {
      tipo: "passos";
      titulo: string;
      intro?: string;
      passos: { titulo: string; texto: string }[];
    };

export type AtuacaoArea = {
  slug: string;
  /** Rótulo curto — usado no menu e nos cards. O H1 completo fica na página. */
  label: string;
  icon: LucideIcon;
  /** ≤ 60 caracteres, com a keyword, sem a marca. */
  metaTitle: string;
  /** 130–160 caracteres. */
  metaDescription: string;
  /** Único na página, com a keyword principal. */
  h1: string;
  /** Answer-first: 1–2 frases. Obrigatório. */
  resumo: string;
  keyword: string;
  imagem: string;
  imagemAlt: string;
  /** Números concretos. LLM cita fato, não adjetivo. */
  numeros: { valor: string; rotulo: string }[];
  blocos: AtuacaoBloco[];
  faq: { q: string; a: string }[];
  /** Pirâmide de autoridade: hub aponta para a cauda longa e para o blog. */
  relacionados: { titulo: string; href: string }[];
  /** Público do Service no schema. */
  audiencia: string;
};

export const ATUACAO_AREAS: AtuacaoArea[] = [
  /* ═══════════════════════════════════════════════════════ CONDOMÍNIO ═════ */
  {
    slug: "mercado-para-condominio",
    label: "Condomínios",
    icon: Building2,
    metaTitle: "Mercado para condomínio: minimercado 24h sem custo",
    metaDescription:
      "Mercado para condomínio instalados sem custo de implantação: loja 24h dentro do prédio, pagamento por app ou Pix e reposição feita pela nossa equipe.",
    h1: "Mercado para condomínio: uma loja 24 horas dentro do prédio",
    keyword: "mercado para condomínio",
    resumo:
      "Instalamos o mercado dentro do condomínio sem nenhum custo de implantação para a administração: equipamento, estoque, reposição e manutenção são nossos. O morador compra 24 horas por dia, sem atendente, pagando por app, Pix ou cartão na própria loja.",
    imagem: "/mercado-para-condominio.webp",
    imagemAlt:
      "Minimercado autônomo instalado na área comum de um condomínio residencial",
    numeros: [
      { valor: "24h", rotulo: "aberto todos os dias, inclusive feriado" },
      { valor: "R$ 0", rotulo: "de investimento para o condomínio" },
      { valor: "6 m²", rotulo: "de área mínima para o formato compacto" },
      { valor: "500+", rotulo: "itens no mix padrão residencial" },
    ],
    blocos: [
      {
        tipo: "texto",
        titulo: "O que o condomínio precisa fornecer",
        paragrafos: [
          "Três coisas: um espaço de área comum a partir de 6 m², uma tomada 220 V e a aprovação em assembleia ou pelo síndico, conforme a convenção do prédio. Não há obra, não há quebra de parede e não há mudança na estrutura elétrica além do ponto de energia.",
          "Todo o resto é nosso: geladeiras, prateleiras, totem de pagamento, câmeras, estoque inicial, reposição, manutenção e seguro do equipamento. O condomínio não assina aval, não compra mercadoria e não assume risco de estoque.",
          "O contrato é de comodato do espaço, com prazo e cláusula de saída negociados antes da assinatura. Se o condomínio quiser encerrar, retiramos tudo e devolvemos o espaço no estado em que recebemos.",
        ],
      },
      {
        tipo: "lista",
        titulo: "O que muda no dia a dia do morador",
        intro:
          "A conveniência real não é ter um mercado no prédio — é não precisar planejar a falta. Estes são os usos que mais aparecem nos nossos relatórios de venda por horário.",
        itens: [
          {
            titulo: "A compra de emergência às 23h",
            texto:
              "Fralda, leite, remédio de farmácia básica, pão. A faixa das 22h à 1h concentra parte relevante das vendas justamente porque é quando o mercado da rua já fechou.",
          },
          {
            titulo: "O café da manhã que acabou",
            texto:
              "Entre 6h e 8h o carrinho médio é pequeno e recorrente: café, leite, pão, fruta. É o morador que desce de chinelo em vez de sair de carro.",
          },
          {
            titulo: "A visita que chegou sem avisar",
            texto:
              "Bebida, gelo e snack no fim de semana. O mix de fim de semana é diferente do de segunda a sexta, e o abastecimento acompanha isso.",
          },
          {
            titulo: "O morador que não dirige",
            texto:
              "Idosos e quem não tem carro deixam de depender de terceiros para uma compra pequena. É o benefício que mais aparece espontaneamente nas conversas de assembleia.",
          },
        ],
      },
      {
        tipo: "passos",
        titulo: "Como é a implantação, passo a passo",
        intro:
          "Do primeiro contato à loja aberta, o prazo típico é de 15 a 30 dias — a maior parte dele esperando a assembleia, não a obra.",
        passos: [
          {
            titulo: "Visita técnica",
            texto:
              "Medimos o espaço disponível, conferimos o ponto de energia e definimos o formato (compacto, médio ou loja completa). A visita não tem custo e não gera compromisso.",
          },
          {
            titulo: "Proposta e material para a assembleia",
            texto:
              "Entregamos a proposta com layout, mix previsto e minuta de contrato, mais um material objetivo para o síndico apresentar aos condôminos. A dúvida mais comum na assembleia é furto — e ela tem resposta com número, não com promessa.",
          },
          {
            titulo: "Aprovação e contrato",
            texto:
              "Assinatura do comodato do espaço. Nenhum valor é cobrado do condomínio nesta etapa nem em nenhuma outra.",
          },
          {
            titulo: "Instalação",
            texto:
              "A montagem leva de 4 a 8 horas e acontece em dia e horário combinados com a portaria, para não atrapalhar a circulação.",
          },
          {
            titulo: "Abertura e acompanhamento",
            texto:
              "Comunicamos os moradores, abrimos a loja e acompanhamos as primeiras semanas ajustando o mix ao que de fato sai naquele prédio.",
          },
        ],
      },
      {
        tipo: "texto",
        titulo: "Segurança: a pergunta que sempre aparece na assembleia",
        paragrafos: [
          "A objeção número um não é preço, é furto. A resposta honesta: perda existe em qualquer varejo, inclusive no supermercado com caixa e segurança. O que o modelo autônomo faz é mantê-la baixa o suficiente para o negócio se pagar — e a perda é risco nosso, não do condomínio.",
          "O controle é feito em camadas: câmeras cobrindo a área de compra, identificação do comprador no app antes de abrir a porta ou concluir o pagamento, e conferência de estoque a cada reposição. Em um condomínio, diferente de um espaço público, o comprador é morador identificado — e isso, sozinho, muda o comportamento.",
          "Nada disso é responsabilidade do síndico. Não há necessidade de funcionário do condomínio operando, conferindo caixa ou respondendo por diferença de estoque.",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Formatos por tamanho de prédio",
        intro:
          "O formato é definido na visita técnica e pode mudar depois: prédio que cresce em consumo é migrado para o formato seguinte sem custo.",
        legenda: "Formatos de mercado autônomo por porte do condomínio",
        colunas: ["Formato", "Área", "Unidades indicadas", "Mix aproximado"],
        linhas: [
          ["Compacto", "6 a 10 m²", "Até 60 apartamentos", "300 itens"],
          ["Médio", "10 a 18 m²", "60 a 150 apartamentos", "500 itens"],
          [
            "Loja completa",
            "acima de 18 m²",
            "Mais de 150 apartamentos",
            "800+ itens",
          ],
        ],
      },
    ],
    faq: [
      {
        q: "O condomínio paga alguma coisa pela instalação?",
        a: "Não. Equipamento, estoque, instalação, reposição, manutenção e seguro são por nossa conta. O condomínio entra com o espaço de área comum e o ponto de energia. Não há taxa de adesão, mensalidade nem participação em prejuízo.",
      },
      {
        q: "Precisa aprovar em assembleia?",
        a: "Depende da convenção do prédio. Quando o uso de área comum exige deliberação, sim — e nesse caso entregamos ao síndico o material de apresentação com layout, contrato e as respostas às objeções mais frequentes. Em muitos condomínios a decisão é do síndico, pelo caráter de melhoria sem ônus.",
      },
      {
        q: "E se houver furto?",
        a: "A perda é risco nosso, nunca do condomínio. O controle é feito por câmeras, identificação do comprador no app e conferência a cada reposição. Em condomínio o comprador é morador identificado, o que reduz muito a ocorrência em comparação com espaços de circulação pública.",
      },
      {
        q: "Quem repõe os produtos?",
        a: "Nossa equipe, em visitas programadas cuja frequência varia com o giro daquele prédio. Nenhum funcionário do condomínio participa da operação, do caixa ou da conferência de estoque.",
      },
      {
        q: "Os preços são maiores que os do supermercado?",
        a: "Ficam entre o supermercado e a loja de conveniência, e abaixo de delivery com taxa de entrega. A comparação justa é com o que o morador gastaria para resolver a mesma necessidade às 23h — normalmente um aplicativo de entrega.",
      },
      {
        q: "Dá para tirar depois se não der certo?",
        a: "Dá. O contrato tem cláusula de saída acordada antes da assinatura. Retiramos os equipamentos e devolvemos o espaço no estado em que recebemos, sem cobrança de multa do condomínio.",
      },
    ],
    relacionados: [
      {
        titulo: "Minimercado autônomo para condomínio",
        href: "/minimercado-autonomo-para-condominio",
      },
      {
        titulo: "Mercadinho no condomínio sem custo",
        href: "/mercadinho-no-condominio-sem-custo",
      },
      {
        titulo: "Mercado autônomo para síndicos",
        href: "/mercado-autonomo-para-sindicos",
      },
      {
        titulo: "Minimercado no condomínio: como funciona",
        href: "/blog/minimercado-no-condominio-como-funciona",
      },
      {
        titulo: "Perguntas do síndico sobre mercado autônomo",
        href: "/blog/perguntas-sindico-mercado-autonomo",
      },
    ],
    audiencia: "Condomínios residenciais, síndicos e administradoras",
  },

  /* ═════════════════════════════════════════════════════════ EMPRESAS ═════ */
  {
    slug: "mercado-para-empresas",
    label: "Empresas",
    icon: Briefcase,
    metaTitle: "Mercado para empresas: minimercado autônomo interno",
    metaDescription:
      "Mercado para empresas instalados sem custo: loja autônoma dentro da operação, aberta nos três turnos, com relatório de consumo e opção de subsídio pelo RH.",
    h1: "Mercado para empresas: conveniência dentro da operação",
    keyword: "mercado para empresas",
    resumo:
      "Instalamos a loja autônoma dentro da empresa sem custo de implantação, aberta nos três turnos e sem operador. O ganho que o RH mede não é o mercado em si: é o tempo que o time deixa de gastar saindo da empresa para comprar café, lanche ou remédio.",
    imagem: "/mercado-para-empresa.webp",
    imagemAlt:
      "Loja autônoma MarketGRU instalada em área de convivência de uma empresa",
    numeros: [
      { valor: "3 turnos", rotulo: "incluindo madrugada e fim de semana" },
      { valor: "R$ 0", rotulo: "de implantação para a empresa" },
      { valor: "8 m²", rotulo: "de área mínima em ambiente corporativo" },
      { valor: "0", rotulo: "funcionários seus na operação" },
    ],
    blocos: [
      {
        tipo: "texto",
        titulo: "O problema que a empresa está resolvendo",
        paragrafos: [
          "Em planta industrial, centro de distribuição e hospital, o turno da noite quase nunca tem opção de compra. O funcionário traz o que comer de casa ou fica sem — e o efeito aparece em clima, não em planilha.",
          "Em escritório, o custo é outro: cada saída para comprar café ou lanche na rua consome de 15 a 25 minutos entre elevador, caminhada e fila. Multiplicado por turno e por pessoa, vira uma perda silenciosa que ninguém contabiliza porque não tem centro de custo.",
          "A loja dentro da operação elimina o deslocamento e cobre o turno que a rua não cobre. É esse o argumento que sustenta o projeto em facilities e em RH — conveniência é consequência, não o objetivo.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Três modelos de operação",
        selo: "Modelos",
        seloIcone: CreditCard,
        intro:
          "A diferença entre eles é quem paga a compra. A instalação continua sem custo nos três.",
        itens: [
          {
            titulo: "Integral pelo colaborador",
            texto:
              "O modelo mais comum. A empresa cede o espaço e o funcionário paga a própria compra por app, Pix ou cartão. Custo zero para a empresa em qualquer cenário de consumo.",
            imagem: "/modelos/integral.webp",
            imagemAlt:
              "Homem aproximando o celular do totem de pagamento do minimercado autônomo",
          },
          {
            titulo: "Subsidiado",
            texto:
              "A empresa banca um percentual ou uma categoria — café e água liberados, o resto pago pelo colaborador, por exemplo. O desconto é aplicado automaticamente no pagamento e sai em relatório mensal fechado.",
            imagem: "/modelos/subsidiados.webp",
            imagemAlt:
              "Colaboradora usando o totem do minimercado autônomo instalado no escritório, ao lado da prateleira de café e snacks",
          },
          {
            titulo: "Crédito por colaborador",
            texto:
              "Cada pessoa recebe um valor mensal para consumir na loja, como benefício. Funciona para escala de plantão e para turno da madrugada, onde o vale-refeição não resolve porque não há estabelecimento aberto.",
            imagem: "/modelos/creditos-por-colaborador.webp",
            imagemAlt:
              "Colaboradora com cesta de compras pagando pelo celular dentro da loja MarketGRU",
          },
        ],
      },
      {
        tipo: "texto",
        titulo: "Mix corporativo é diferente de mix residencial",
        paragrafos: [
          "O mix de um condomínio é de reposição doméstica: leite, pão, fralda, produto de limpeza. O de uma empresa é de consumo imediato — café, snack proteico, bebida gelada, refeição pronta para o turno da noite, e uma prateleira de farmácia básica com analgésico, antiácido e curativo.",
          "Em operação industrial entram itens que escritório não pede: isotônico, barra de cereal de maior densidade calórica e refeição pronta capaz de substituir uma janta que não existe às 3h da manhã.",
          "O mix é ajustado nas primeiras semanas pelo que de fato sai naquela unidade, e revisado periodicamente. Empresa com refeitório próprio recebe um mix complementar ao cardápio, não concorrente: a loja cobre os intervalos em que o refeitório está fechado.",
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que muda por tipo de operação",
        intro:
          "O formato, o horário de pico e o mix mudam conforme o ambiente. A visita técnica define os três.",
        legenda: "Configuração da loja autônoma por tipo de operação",
        colunas: ["Ambiente", "Pico de consumo", "Destaque do mix", "Formato"],
        linhas: [
          [
            "Escritório",
            "9h–10h e 15h–16h",
            "Café, snack, bebida gelada",
            "Compacto",
          ],
          [
            "Indústria / CD",
            "Viradas de turno e madrugada",
            "Refeição pronta, isotônico, café",
            "Médio",
          ],
          [
            "Hospital / clínica",
            "Plantão noturno e fim de semana",
            "Farmácia básica, refeição, café",
            "Médio",
          ],
          [
            "Faculdade",
            "Entre aulas e período noturno",
            "Snack, bebida, material rápido",
            "Loja completa",
          ],
        ],
      },
      {
        tipo: "lista",
        titulo: "O que a empresa recebe além da loja",
        itens: [
          {
            titulo: "Relatório de consumo",
            texto:
              "Volume por categoria e por faixa de horário, sem nenhum dado individual de colaborador. Serve para dimensionar benefício e para ajustar o mix.",
          },
          {
            titulo: "Operação sem headcount",
            texto:
              "Reposição, manutenção, troca de equipamento e suporte são nossos. Nenhuma pessoa da sua folha entra na operação da loja.",
          },
          {
            titulo: "Cobertura de turno",
            texto:
              "A loja não fecha. Escala noturna, fim de semana e feriado ficam cobertos sem custo adicional e sem escala extra.",
          },
          {
            titulo: "Saída sem multa",
            texto:
              "Cláusula de encerramento acordada antes da assinatura. Retiramos o equipamento e devolvemos o espaço como recebemos.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "A empresa paga para instalar?",
        a: "Não. Equipamento, estoque, instalação, reposição e manutenção são por nossa conta. A empresa entra com o espaço e o ponto de energia. Só existe custo se a empresa optar pelos modelos subsidiado ou de crédito, e nesses casos ela define o valor.",
      },
      {
        q: "Funciona no turno da noite e no fim de semana?",
        a: "Sim, e normalmente é esse o motivo do projeto. A loja é autônoma: não depende de operador e não tem horário de fechamento. Em operação 24 horas, o turno da madrugada costuma ser o de maior ticket médio, porque não há alternativa aberta na região.",
      },
      {
        q: "Dá para subsidiar a compra do colaborador?",
        a: "Dá, de duas formas: percentual ou categoria liberada (café e água, por exemplo), com desconto aplicado automaticamente no pagamento; ou crédito mensal por colaborador. Nos dois casos a empresa recebe relatório fechado do que foi consumido.",
      },
      {
        q: "Substitui o refeitório?",
        a: "Não, complementa. A loja cobre os intervalos em que o refeitório está fechado — madrugada, fim de semana e as horas entre as refeições. Em empresa com refeitório, montamos um mix que não concorre com o cardápio servido.",
      },
      {
        q: "Precisa de funcionário nosso para operar?",
        a: "Nenhum. Não há caixa, conferência de estoque nem responsabilidade sobre perda. Toda a operação é nossa, incluindo o risco de furto.",
      },
      {
        q: "A empresa recebe dados de consumo individual?",
        a: "Não, e isso é deliberado. O relatório traz volume por categoria e por faixa de horário, nunca o que cada pessoa comprou. Dado de consumo individual de colaborador é informação sensível e não é compartilhado com o contratante.",
      },
    ],
    relacionados: [
      { titulo: "Empresa de minimercados", href: "/empresa-de-minimercados" },
      {
        titulo: "Empresa de minimercados para prédio",
        href: "/empresa-de-minimercados-para-predio",
      },
      {
        titulo: "Honest market para condomínios",
        href: "/honest-market-para-condominios",
      },
      {
        titulo: "Crescimento do mercado autônomo no Brasil",
        href: "/blog/crescimento-mercado-autonomo-brasil",
      },
      {
        titulo: "Honest market: tendência para condomínios",
        href: "/blog/honest-market-tendencia-condominios",
      },
    ],
    audiencia: "Empresas, indústrias, hospitais e instituições de ensino",
  },
];

export function getAtuacaoArea(slug: string): AtuacaoArea | undefined {
  return ATUACAO_AREAS.find((area) => area.slug === slug);
}

export const ATUACAO_SLUGS: string[] = ATUACAO_AREAS.map((a) => a.slug);
