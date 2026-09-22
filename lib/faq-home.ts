export type FaqItem = { question: string; answer: string };

/* =============================================================================
   FAQ DA HOME — módulo neutro (sem "use client").

   O mesmo array alimenta o acordeão visível e o FAQPage do JSON-LD. Manter os
   dois na mesma fonte é o que garante a paridade markup ↔ tela: schema com
   pergunta que não está na página é o caminho mais curto para perder o rich
   result inteiro.
   ========================================================================== */
export const FAQS: FaqItem[] = [
  {
    question: "Como funciona o minimercado para condomínios?",
    answer:
      "Instalamos um minimercado autônomo completo no seu condomínio, sem custo de implantação. Os moradores têm acesso 24h por dia a produtos de qualidade com pagamento via app ou cartão. Cuidamos de todo o abastecimento e manutenção.",
  },
  {
    question: "Qual o custo para o condomínio?",
    answer:
      "Zero! A implantação, equipamentos e manutenção são totalmente por nossa conta. O condomínio ganha o serviço sem nenhum investimento, enquanto os moradores aproveitam a praticidade.",
  },
  {
    question: "Quais produtos são oferecidos?",
    answer:
      "Oferecemos uma seleção completa de itens do dia a dia: alimentos, bebidas, snacks, produtos de higiene e limpeza. O mix é adaptado ao perfil dos moradores de cada condomínio.",
  },
  {
    question: "Como é feito o abastecimento do mercado?",
    answer:
      "Nossa equipe realiza visitas periódicas para reabastecer os produtos e verificar os equipamentos. Você não precisa se preocupar com nada — cuidamos de tudo do início ao fim.",
  },
  {
    question: "O minimercado funciona sem funcionários?",
    answer:
      "Sim! O sistema é totalmente autônomo com tecnologia de pagamento digital via app, cartão de crédito/débito e Pix. Câmeras de segurança garantem a integridade do espaço.",
  },
  {
    question: "Qual o espaço necessário para instalar?",
    answer:
      "Trabalhamos com diferentes formatos adaptáveis ao espaço disponível no condomínio — de totem compacto a loja completa. Nossa equipe faz uma visita técnica para indicar a melhor solução.",
  },
];
