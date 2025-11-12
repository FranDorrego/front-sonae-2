import { Produto, ApiResponse, ComentarioProduto } from "@/types";
import { api } from "./api";

const MOCK_PRODUTOS: Produto[] = [
  // Corredor Superior - Cítricos (4 posições)
  { id: "p1", nome: "Laranjas", categoria: "Frutas", quantidadeAtual: 15, quantidadeMaxima: 100, percentual: 15, status: "critico", localizacao: { zona: "A1", posicao: { x: 1, y: 1 } } },
  { id: "p2", nome: "Limões", categoria: "Frutas", quantidadeAtual: 38, quantidadeMaxima: 100, percentual: 38, status: "baixo", localizacao: { zona: "A1", posicao: { x: 2, y: 1 } } },
  { id: "p3", nome: "Tangerinas", categoria: "Frutas", quantidadeAtual: 72, quantidadeMaxima: 100, percentual: 72, status: "ok", localizacao: { zona: "A1", posicao: { x: 3, y: 1 } } },
  { id: "p4", nome: "Toranjas", categoria: "Frutas", quantidadeAtual: 85, quantidadeMaxima: 100, percentual: 85, status: "ok", localizacao: { zona: "A1", posicao: { x: 4, y: 1 } } },

  // Corredor Lateral Esquerdo - Tropicais (3 posições)
  { id: "p9", nome: "Bananas", categoria: "Frutas", quantidadeAtual: 35, quantidadeMaxima: 100, percentual: 35, status: "baixo", localizacao: { zona: "B1", posicao: { x: 1, y: 2 } } },
  { id: "p10", nome: "Manga", categoria: "Frutas", quantidadeAtual: 8, quantidadeMaxima: 100, percentual: 8, status: "critico", localizacao: { zona: "B1", posicao: { x: 1, y: 3 } } },
  { id: "p11", nome: "Abacaxi", categoria: "Frutas", quantidadeAtual: 78, quantidadeMaxima: 100, percentual: 78, status: "ok", localizacao: { zona: "B1", posicao: { x: 1, y: 4 } } },

  // Ilha Central - Frutas Mistas (6 posições)
  { id: "p21", nome: "Maçãs", categoria: "Frutas", quantidadeAtual: 85, quantidadeMaxima: 100, percentual: 85, status: "ok", localizacao: { zona: "C1", posicao: { x: 2, y: 3 } } },
  { id: "p22", nome: "Peras", categoria: "Frutas", quantidadeAtual: 18, quantidadeMaxima: 100, percentual: 18, status: "critico", localizacao: { zona: "C1", posicao: { x: 3, y: 3 } } },
  { id: "p23", nome: "Pêssegos", categoria: "Frutas", quantidadeAtual: 48, quantidadeMaxima: 100, percentual: 48, status: "baixo", localizacao: { zona: "C1", posicao: { x: 4, y: 3 } } },
  { id: "p29", nome: "Melancia", categoria: "Frutas", quantidadeAtual: 68, quantidadeMaxima: 100, percentual: 68, status: "ok", localizacao: { zona: "C2", posicao: { x: 2, y: 4 } } },
  { id: "p30", nome: "Melão", categoria: "Frutas", quantidadeAtual: 11, quantidadeMaxima: 100, percentual: 11, status: "critico", localizacao: { zona: "C2", posicao: { x: 3, y: 4 } } },
  { id: "p31", nome: "Kiwi", categoria: "Frutas", quantidadeAtual: 42, quantidadeMaxima: 100, percentual: 42, status: "baixo", localizacao: { zona: "C2", posicao: { x: 4, y: 4 } } },

  // Corredor Lateral Direito - Verduras (3 posições)
  { id: "p51", nome: "Tomate", categoria: "Verduras", quantidadeAtual: 87, quantidadeMaxima: 100, percentual: 87, status: "ok", localizacao: { zona: "B2", posicao: { x: 4, y: 2 } } },
  { id: "p52", nome: "Produto Desconhecido", categoria: "Frutas", quantidadeAtual: 0, quantidadeMaxima: 100, percentual: 0, status: "desconhecido", localizacao: { zona: "B2", posicao: { x: 4, y: 3 } } },
  { id: "p53", nome: "Pimento", categoria: "Verduras", quantidadeAtual: 44, quantidadeMaxima: 100, percentual: 44, status: "baixo", localizacao: { zona: "B2", posicao: { x: 4, y: 4 } } },

  // Corredor Inferior - Folhosas (4 posições)
  { id: "p37", nome: "Alface", categoria: "Verduras", quantidadeAtual: 78, quantidadeMaxima: 100, percentual: 78, status: "ok", localizacao: { zona: "D1", posicao: { x: 1, y: 5 } } },
  { id: "p38", nome: "Rúcula", categoria: "Verduras", quantidadeAtual: 12, quantidadeMaxima: 100, percentual: 12, status: "critico", localizacao: { zona: "D1", posicao: { x: 2, y: 5 } } },
  { id: "p39", nome: "Espinafre", categoria: "Verduras", quantidadeAtual: 36, quantidadeMaxima: 100, percentual: 36, status: "baixo", localizacao: { zona: "D1", posicao: { x: 3, y: 5 } } },
  { id: "p40", nome: "Couve", categoria: "Verduras", quantidadeAtual: 91, quantidadeMaxima: 100, percentual: 91, status: "ok", localizacao: { zona: "D1", posicao: { x: 4, y: 5 } } },
];

export async function get_data_stock(): Promise<ApiResponse<Produto[]>> {
  return { sucesso: true, dados: MOCK_PRODUTOS };
  try {
    const response = await api<Produto[]>("/stock");

    if (response.sucesso && response.dados) {
      return response;
    }

    throw new Error("Falha na API");
  } catch (erro) {
    console.warn("Usando dados mock de stock");
    return { sucesso: true, dados: MOCK_PRODUTOS };
  }
}

export async function post_comentario_produto(
  comentario: ComentarioProduto
): Promise<ApiResponse<void>> {
  try {
    const response = await api<void>("/stock/comentario", {
      method: "POST",
      body: JSON.stringify(comentario),
    });

    if (response.sucesso) {
      return response;
    }

    throw new Error("Falha na API");
  } catch (erro) {
    console.warn("Simulando envio de comentário");
    return { sucesso: true };
  }
}