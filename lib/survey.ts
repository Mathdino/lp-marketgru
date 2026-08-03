export type QuestionType = "single" | "multi" | "text";

export interface Option {
  value: string;
  label: string;
  emoji?: string | undefined;
}

export interface Question {
  id: string;
  title: string;
  help?: string;
  type: QuestionType;
  required?: boolean;
  options?: Option[];
  allowOther?: boolean; // habilita campo "Outro" com texto
  placeholder?: string;
}

export const BRAND = {
  primary: "#f8301a",
  primaryDark: "#cc1f0c",
  dark: "#1f1f1f",
  amber: "#f59e0b",
} as const;

/** Opções de condomínio onde a pesquisa é respondida. */
export const CONDOMINIOS: Option[] = [
  { value: "the_brick", label: "Condomínio The Brick", emoji: "🏢" },
  { value: "terrazzo", label: "Terrazzo Condomínio Clube", emoji: "🏢" },
  { value: "first_apto", label: "First Apto", emoji: "🏢" },
  {
    value: "escola_nelson",
    label: "Escola Técnica de Música Nelsom",
    emoji: "🎵",
  },
  { value: "clavi_ecco", label: "Clavi Ecco Tower", emoji: "🏢" },
  { value: "imob_alianca", label: "Imobiliária Aliança Imóveis", emoji: "🏠" },
  {
    value: "palacio_artes",
    label: "Residencial Palácio das artes",
    emoji: "🏢",
  },
];

export const questions: Question[] = [
  {
    id: "condominio",
    title: "Em qual condomínio você está respondendo a pesquisa?",
    type: "single",
    required: true,
    options: CONDOMINIOS,
  },
  {
    id: "q1",
    title: "Como você avalia o minimercado da MarketGru?",
    type: "single",
    required: true,
    options: [
      { value: "excelente", label: "Excelente", emoji: "⭐" },
      { value: "bom", label: "Bom", emoji: "😊" },
      { value: "regular", label: "Regular", emoji: "😐" },
      { value: "ruim", label: "Ruim", emoji: "😕" },
      { value: "pessimo", label: "Péssimo", emoji: "😞" },
    ],
  },
  {
    id: "q2",
    title:
      "Quais produtos você gostaria que fossem adicionados ao minimercado?",
    help: "Escreva os produtos ou categorias que você sente falta.",
    type: "text",
    placeholder: "Ex.: água de coco, pães frescos, comida fitness...",
  },
  {
    id: "q3",
    title: "O que podemos melhorar na sua experiência com o minimercado?",
    help: "Conte sua sugestão, crítica ou ideia para tornar o serviço melhor.",
    type: "text",
    placeholder: "Deixe sua sugestão aqui...",
  },
  {
    id: "q4",
    title: "Quais categorias de produtos você compra com mais frequência?",
    help: "Você pode escolher mais de uma opção.",
    type: "multi",
    required: true,
    allowOther: true,
    options: [
      { value: "bebidas", label: "Bebidas", emoji: "🥤" },
      { value: "doces", label: "Doces e chocolates", emoji: "🍫" },
      { value: "biscoitos", label: "Salgadinhos e biscoitos ", emoji: "🍪" },
      {
        value: "alimentos",
        label: "Alimentos (macarrão, arroz, farinha, etc. )",
        emoji: "🍝",
      },
      { value: "higiene", label: "Higiene e limpeza", emoji: "🧴" },
      { value: "congelados", label: "Congelados", emoji: "🧊" },
      { value: "laticinios", label: "Laticínios", emoji: "🥛" },
      { value: "saudaveis", label: "Alimentos saudáveis", emoji: "🍎" },
    ],
  },
  {
    id: "q5",
    title:
      "Você gostaria de participar de sorteios e promoções exclusivas da MarketGru?",
    type: "single",
    required: true,
    options: [
      { value: "sim", label: "Sim", emoji: "🎉" },
      { value: "talvez", label: "Talvez", emoji: "🤔" },
      { value: "nao", label: "Não", emoji: "❌" },
    ],
  },
  {
    id: "q6",
    title: "Qual prêmio você gostaria de concorrer em sorteios da MarketGru?",
    type: "single",
    required: true,
    allowOther: true,
    options: [
      { value: "vale", label: "Vale-compras", emoji: "💳" },
      { value: "cesta", label: "Cesta de produtos", emoji: "🛒" },
      { value: "pix", label: "Pix", emoji: "📱" },
      { value: "exclusivos", label: "Produtos exclusivos", emoji: "🎁" },
    ],
  },
];

export interface SurveyResponse {
  id: string;
  createdAt: string;
  condominio: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string[];
  q4_outro?: string | undefined;
  q5: string;
  q6: string;
  q6_outro?: string | undefined;
}
