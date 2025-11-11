import { Conselho, ApiResponse } from "@/types";
import { api } from "./api";

const MOCK_CONSELHOS: Conselho[] = [
  {
    id: "c1",
    tipo: "alerta",
    titulo: "Múltiplos produtos críticos detectados",
    descricao:
      "Sistema detectou 14 produtos abaixo de 20%. Priorizar: Laranjas (15%), Clementinas (12%), Manga (8%), Tomate (12%), Rúcula (12%).",
    prioridade: "alta",
    produtosRelacionados: ["p1", "p7", "p10", "p38", "p51"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c2",
    tipo: "reposicao",
    titulo: "Repor Frutas Vermelhas antes das 14h",
    descricao:
      "Amoras (7%) e Framboesas (28%) estão em níveis baixos. Histórico indica pico de vendas às 14h para esta categoria.",
    prioridade: "alta",
    produtosRelacionados: ["p18", "p16"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c3",
    tipo: "alerta",
    titulo: "Batata Doce e Batata em estado crítico",
    descricao:
      "Produtos de alta rotação com stock crítico. Batata Doce: 5%, Batata: 18%. Contactar fornecedor urgentemente.",
    prioridade: "alta",
    produtosRelacionados: ["p50", "p46"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c4",
    tipo: "otimizacao",
    titulo: "Redistribuir espaço de frutas cítricas",
    descricao:
      "Limas (85%) e Pomelos (90%) mantêm stock alto consistentemente. Considerar reduzir 15% do espaço para produtos de maior rotação.",
    prioridade: "media",
    produtosRelacionados: ["p4", "p6"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c5",
    tipo: "reposicao",
    titulo: "Verificar Brócolos e Acelga",
    descricao:
      "Verduras em estado crítico. Brócolos: 5%, Acelga: 14%. Padrão indica que queda continua após 15h. Repor imediatamente.",
    prioridade: "alta",
    produtosRelacionados: ["p55", "p43"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c6",
    tipo: "sugestao",
    titulo: "Aumentar espaço para Uvas Pretas",
    descricao:
      "Uvas Pretas mantêm 94% de stock mas têm rotação 45% superior à média. Oportunidade de aumentar vendas.",
    prioridade: "media",
    produtosRelacionados: ["p28"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c7",
    tipo: "alerta",
    titulo: "Coco e Romãs próximos da ruptura",
    descricao:
      "Stock crítico em frutas exóticas. Coco: 15%, Romãs: 9%. Estas têm lead time de fornecedor de 48h. Ação urgente necessária.",
    prioridade: "alta",
    produtosRelacionados: ["p14", "p35"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c8",
    tipo: "otimizacao",
    titulo: "Melão Galia com baixa rotação",
    descricao:
      "Melão Galia ocupa 8% do espaço mas representa apenas 3.2% das vendas desta categoria. Considerar substituir por Meloa.",
    prioridade: "baixa",
    produtosRelacionados: ["p31"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c9",
    tipo: "reposicao",
    titulo: "Pêssegos e Rabanetes necessitam atenção",
    descricao:
      "Produtos em nível baixo com tendência de queda. Pêssegos: 18%, Rabanetes: 29%. Agendar reposição para próximas 2 horas.",
    prioridade: "media",
    produtosRelacionados: ["p23", "p48"],
    timestamp: new Date().toISOString(),
  },
  {
    id: "c10",
    tipo: "sugestao",
    titulo: "Seção de verduras folhosas bem equilibrada",
    descricao:
      "Espinafre (82%), Repolho (91%) e Chicória (69%) mantêm níveis ótimos. Proporção atual está ideal para demanda.",
    prioridade: "baixa",
    produtosRelacionados: ["p39", "p42", "p44"],
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
