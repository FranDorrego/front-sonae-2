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
    titulo: "Uvas em nível crítico",
    descricao:
      "Estoque de uvas abaixo de 10%. Verificar disponibilidade no depósito ou contactar fornecedor urgentemente.",
    prioridade: "alta",
    produtosRelacionados: ["p6"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c3",
    tipo: "otimizacao",
    titulo: "Aumentar espaço para bananas",
    descricao:
      "Bananas têm rotação 35% superior à média de frutas. Considerar aumentar espaço em 20% para melhorar vendas.",
    prioridade: "media",
    produtosRelacionados: ["p5"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c4",
    tipo: "reposicao",
    titulo: "Verificar tomates após 14h",
    descricao:
      "Padrão histórico indica queda rápida de estoque de tomates após horário de almoço. Agendar verificação.",
    prioridade: "media",
    produtosRelacionados: ["p10"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c5",
    tipo: "sugestao",
    titulo: "Morangos frescos pela manhã",
    descricao:
      "Vendas de morangos são 60% maiores antes das 11h. Garantir reposição completa até às 9h.",
    prioridade: "media",
    produtosRelacionados: ["p7"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c6",
    tipo: "alerta",
    titulo: "Brócolos em falta",
    descricao:
      "Brócolos com apenas 5% de estoque. Situação crítica que pode resultar em ruptura de stock.",
    prioridade: "alta",
    produtosRelacionados: ["p13"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c7",
    tipo: "otimizacao",
    titulo: "Reduzir espaço de melão",
    descricao:
      "Melão ocupa 11% do espaço mas representa apenas 8.9% das vendas. Considerar redistribuição.",
    prioridade: "baixa",
    produtosRelacionados: ["p8"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c8",
    tipo: "reposicao",
    titulo: "Batatas próximo do crítico",
    descricao:
      "Estoque de batatas em 18%. Tendência de queda nas próximas 2 horas baseado em padrão histórico.",
    prioridade: "media",
    produtosRelacionados: ["p16"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c9",
    tipo: "sugestao",
    titulo: "Cenouras bem equilibradas",
    descricao:
      "Proporção atual de espaço vs vendas de cenoura está ótima. Manter configuração atual.",
    prioridade: "baixa",
    produtosRelacionados: ["p11"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c10",
    tipo: "otimizacao",
    titulo: "Aumentar variedade de verduras",
    descricao:
      "Seção de verduras pode comportar 15% mais produtos. Considerar adicionar novos itens sazonais.",
    prioridade: "baixa",
    produtosRelacionados: ["p9", "p10", "p11"],
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
