import { Conselho, ApiResponse } from "@/types";
import { api } from "./api";

const MOCK_CONSELHOS: Conselho[] = [
  {
    id: "c1",
    tipo: "reposicao",
    titulo: "Repor laranjas antes das 14h",
    descricao:
      "Histórico mostra pico de vendas de frutas às 14h. Recomenda-se repor laranjas para 90% da capacidade antes desse horário.",
    prioridade: "alta",
    produtosRelacionados: ["p3"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c2",
    tipo: "alerta",
    titulo: "Queijos em nível crítico",
    descricao:
      "Estoque de queijos abaixo de 10%. Verificar disponibilidade no depósito ou contactar fornecedor.",
    prioridade: "alta",
    produtosRelacionados: ["p6"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c3",
    tipo: "otimizacao",
    titulo: "Aumentar espaço para bananas",
    descricao:
      "Bananas têm rotação 35% superior à média. Considerar aumentar espaço em 20% para melhorar vendas.",
    prioridade: "media",
    produtosRelacionados: ["p2"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c4",
    tipo: "reposicao",
    titulo: "Verificar seção de peixes após 14h",
    descricao:
      "Padrão histórico indica queda de estoque de peixes após horário de almoço. Agendar verificação.",
    prioridade: "media",
    produtosRelacionados: ["p12"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c5",
    tipo: "sugestao",
    titulo: "Croissants frescos pela manhã",
    descricao:
      "Vendas de croissants são 60% maiores antes das 11h. Garantir reposição completa até às 9h.",
    prioridade: "media",
    produtosRelacionados: ["p9"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c6",
    tipo: "otimizacao",
    titulo: "Reduzir espaço de iogurtes",
    descricao:
      "Iogurtes ocupam 15% do espaço mas representam apenas 8% das vendas. Considerar redistribuição.",
    prioridade: "baixa",
    produtosRelacionados: ["p5"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c7",
    tipo: "alerta",
    titulo: "Frango próximo do crítico",
    descricao:
      "Estoque de frango em 32%. Tendência de queda nas próximas 2 horas baseado em padrão histórico.",
    prioridade: "media",
    produtosRelacionados: ["p11"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c8",
    tipo: "reposicao",
    titulo: "Pão fresco em alta demanda",
    descricao:
      "Pão fresco mantém vendas consistentes. Manter nível acima de 85% durante todo o dia.",
    prioridade: "baixa",
    produtosRelacionados: ["p7"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c9",
    tipo: "sugestao",
    titulo: "Promover bolos no período da tarde",
    descricao:
      "Bolos têm melhor performance entre 15h-17h. Considerar posicionamento estratégico ou promoção.",
    prioridade: "baixa",
    produtosRelacionados: ["p8"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c10",
    tipo: "otimizacao",
    titulo: "Leite integral bem equilibrado",
    descricao:
      "Proporção atual de espaço vs vendas de leite está ótima. Manter configuração atual.",
    prioridade: "baixa",
    produtosRelacionados: ["p4"],
    timestamp: new Date().toISOString(),
  },
];

export async function get_data_conselhos(): Promise<ApiResponse<Conselho[]>> {
  try {
    const response = await api<Conselho[]>("/conselhos");

    if (response.sucesso && response.dados) {
      return response;
    }

    throw new Error("Falha na API");
  } catch (erro) {
    console.warn("Usando dados mock de conselhos");
    return { sucesso: true, dados: MOCK_CONSELHOS };
  }
}

export async function post_resposta_conselho(
  conselhoId: string,
  aceito: boolean
): Promise<ApiResponse<void>> {
  try {
    const response = await api<void>(`/conselhos/${conselhoId}`, {
      method: "POST",
      body: JSON.stringify({ aceito }),
    });

    if (response.sucesso) {
      return response;
    }

    throw new Error("Falha na API");
  } catch (erro) {
    console.warn("Simulando resposta a conselho");
    return { sucesso: true };
  }
}
