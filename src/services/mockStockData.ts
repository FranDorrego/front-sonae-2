import { Produto, ApiResponse, ComentarioProduto } from "@/types";
import { api } from "./api";

const MOCK_PRODUTOS: Produto[] = [
  // Corredor Superior - Frutas Cítricas (8 posições)
  { id: "p1", nome: "Laranjas", categoria: "Frutas", quantidadeAtual: 15, quantidadeMaxima: 100, percentual: 15, status: "critico", localizacao: { zona: "A1", posicao: { x: 1, y: 1 } } },
  { id: "p2", nome: "Limões", categoria: "Frutas", quantidadeAtual: 38, quantidadeMaxima: 100, percentual: 38, status: "baixo", localizacao: { zona: "A1", posicao: { x: 2, y: 1 } } },
  { id: "p3", nome: "Tangerinas", categoria: "Frutas", quantidadeAtual: 72, quantidadeMaxima: 100, percentual: 72, status: "ok", localizacao: { zona: "A1", posicao: { x: 3, y: 1 } } },
  { id: "p4", nome: "Limas", categoria: "Frutas", quantidadeAtual: 85, quantidadeMaxima: 100, percentual: 85, status: "ok", localizacao: { zona: "A1", posicao: { x: 4, y: 1 } } },
  { id: "p5", nome: "Toranjas", categoria: "Frutas", quantidadeAtual: 45, quantidadeMaxima: 100, percentual: 45, status: "baixo", localizacao: { zona: "A1", posicao: { x: 5, y: 1 } } },
  { id: "p6", nome: "Pomelos", categoria: "Frutas", quantidadeAtual: 90, quantidadeMaxima: 100, percentual: 90, status: "ok", localizacao: { zona: "A1", posicao: { x: 6, y: 1 } } },
  { id: "p7", nome: "Clementinas", categoria: "Frutas", quantidadeAtual: 12, quantidadeMaxima: 100, percentual: 12, status: "critico", localizacao: { zona: "A1", posicao: { x: 7, y: 1 } } },
  { id: "p8", nome: "Bergamotas", categoria: "Frutas", quantidadeAtual: 67, quantidadeMaxima: 100, percentual: 67, status: "ok", localizacao: { zona: "A1", posicao: { x: 8, y: 1 } } },

  // Corredor Lateral Esquerdo - Frutas Tropicais (6 posições)
  { id: "p9", nome: "Bananas", categoria: "Frutas", quantidadeAtual: 35, quantidadeMaxima: 100, percentual: 35, status: "baixo", localizacao: { zona: "B1", posicao: { x: 1, y: 2 } } },
  { id: "p10", nome: "Manga", categoria: "Frutas", quantidadeAtual: 8, quantidadeMaxima: 100, percentual: 8, status: "critico", localizacao: { zona: "B1", posicao: { x: 1, y: 3 } } },
  { id: "p11", nome: "Abacaxi", categoria: "Frutas", quantidadeAtual: 78, quantidadeMaxima: 100, percentual: 78, status: "ok", localizacao: { zona: "B1", posicao: { x: 1, y: 4 } } },
  { id: "p12", nome: "Papaia", categoria: "Frutas", quantidadeAtual: 42, quantidadeMaxima: 100, percentual: 42, status: "baixo", localizacao: { zona: "B1", posicao: { x: 1, y: 5 } } },
  { id: "p13", nome: "Maracujá", categoria: "Frutas", quantidadeAtual: 88, quantidadeMaxima: 100, percentual: 88, status: "ok", localizacao: { zona: "B1", posicao: { x: 1, y: 6 } } },
  { id: "p14", nome: "Coco", categoria: "Frutas", quantidadeAtual: 15, quantidadeMaxima: 100, percentual: 15, status: "critico", localizacao: { zona: "B1", posicao: { x: 1, y: 7 } } },

  // Corredor Lateral Direito - Frutas Vermelhas (6 posições)
  { id: "p15", nome: "Morangos", categoria: "Frutas", quantidadeAtual: 65, quantidadeMaxima: 100, percentual: 65, status: "ok", localizacao: { zona: "B2", posicao: { x: 8, y: 2 } } },
  { id: "p16", nome: "Framboesas", categoria: "Frutas", quantidadeAtual: 28, quantidadeMaxima: 100, percentual: 28, status: "baixo", localizacao: { zona: "B2", posicao: { x: 8, y: 3 } } },
  { id: "p17", nome: "Mirtilos", categoria: "Frutas", quantidadeAtual: 92, quantidadeMaxima: 100, percentual: 92, status: "ok", localizacao: { zona: "B2", posicao: { x: 8, y: 4 } } },
  { id: "p18", nome: "Amoras", categoria: "Frutas", quantidadeAtual: 7, quantidadeMaxima: 100, percentual: 7, status: "critico", localizacao: { zona: "B2", posicao: { x: 8, y: 5 } } },
  { id: "p19", nome: "Cerejas", categoria: "Frutas", quantidadeAtual: 55, quantidadeMaxima: 100, percentual: 55, status: "baixo", localizacao: { zona: "B2", posicao: { x: 8, y: 6 } } },
  { id: "p20", nome: "Groselhas", categoria: "Frutas", quantidadeAtual: 81, quantidadeMaxima: 100, percentual: 81, status: "ok", localizacao: { zona: "B2", posicao: { x: 8, y: 7 } } },

  // Ilha Central Superior - Frutas de Caroço (8 posições)
  { id: "p21", nome: "Maçãs", categoria: "Frutas", quantidadeAtual: 85, quantidadeMaxima: 100, percentual: 85, status: "ok", localizacao: { zona: "C1", posicao: { x: 2, y: 3 } } },
  { id: "p22", nome: "Peras", categoria: "Frutas", quantidadeAtual: 72, quantidadeMaxima: 100, percentual: 72, status: "ok", localizacao: { zona: "C1", posicao: { x: 3, y: 3 } } },
  { id: "p23", nome: "Pêssegos", categoria: "Frutas", quantidadeAtual: 18, quantidadeMaxima: 100, percentual: 18, status: "critico", localizacao: { zona: "C1", posicao: { x: 4, y: 3 } } },
  { id: "p24", nome: "Nectarinas", categoria: "Frutas", quantidadeAtual: 48, quantidadeMaxima: 100, percentual: 48, status: "baixo", localizacao: { zona: "C1", posicao: { x: 5, y: 3 } } },
  { id: "p25", nome: "Damascos", categoria: "Frutas", quantidadeAtual: 76, quantidadeMaxima: 100, percentual: 76, status: "ok", localizacao: { zona: "C1", posicao: { x: 6, y: 3 } } },
  { id: "p26", nome: "Ameixas", categoria: "Frutas", quantidadeAtual: 33, quantidadeMaxima: 100, percentual: 33, status: "baixo", localizacao: { zona: "C1", posicao: { x: 7, y: 3 } } },
  { id: "p27", nome: "Uvas Verdes", categoria: "Frutas", quantidadeAtual: 8, quantidadeMaxima: 100, percentual: 8, status: "critico", localizacao: { zona: "C1", posicao: { x: 2, y: 4 } } },
  { id: "p28", nome: "Uvas Pretas", categoria: "Frutas", quantidadeAtual: 94, quantidadeMaxima: 100, percentual: 94, status: "ok", localizacao: { zona: "C1", posicao: { x: 3, y: 4 } } },

  // Ilha Central Inferior - Melões (8 posições)
  { id: "p29", nome: "Melão", categoria: "Frutas", quantidadeAtual: 42, quantidadeMaxima: 100, percentual: 42, status: "baixo", localizacao: { zona: "C2", posicao: { x: 4, y: 4 } } },
  { id: "p30", nome: "Melancia", categoria: "Frutas", quantidadeAtual: 68, quantidadeMaxima: 100, percentual: 68, status: "ok", localizacao: { zona: "C2", posicao: { x: 5, y: 4 } } },
  { id: "p31", nome: "Melão Galia", categoria: "Frutas", quantidadeAtual: 11, quantidadeMaxima: 100, percentual: 11, status: "critico", localizacao: { zona: "C2", posicao: { x: 6, y: 4 } } },
  { id: "p32", nome: "Meloa", categoria: "Frutas", quantidadeAtual: 89, quantidadeMaxima: 100, percentual: 89, status: "ok", localizacao: { zona: "C2", posicao: { x: 7, y: 4 } } },
  { id: "p33", nome: "Kiwi", categoria: "Frutas", quantidadeAtual: 25, quantidadeMaxima: 100, percentual: 25, status: "baixo", localizacao: { zona: "C2", posicao: { x: 2, y: 5 } } },
  { id: "p34", nome: "Figos", categoria: "Frutas", quantidadeAtual: 77, quantidadeMaxima: 100, percentual: 77, status: "ok", localizacao: { zona: "C2", posicao: { x: 3, y: 5 } } },
  { id: "p35", nome: "Romãs", categoria: "Frutas", quantidadeAtual: 9, quantidadeMaxima: 100, percentual: 9, status: "critico", localizacao: { zona: "C2", posicao: { x: 4, y: 5 } } },
  { id: "p36", nome: "Caqui", categoria: "Frutas", quantidadeAtual: 61, quantidadeMaxima: 100, percentual: 61, status: "ok", localizacao: { zona: "C2", posicao: { x: 5, y: 5 } } },

  // Corredor Inferior - Verduras Folhosas (8 posições)
  { id: "p37", nome: "Alface", categoria: "Verduras", quantidadeAtual: 78, quantidadeMaxima: 100, percentual: 78, status: "ok", localizacao: { zona: "D1", posicao: { x: 1, y: 8 } } },
  { id: "p38", nome: "Rúcula", categoria: "Verduras", quantidadeAtual: 12, quantidadeMaxima: 100, percentual: 12, status: "critico", localizacao: { zona: "D1", posicao: { x: 2, y: 8 } } },
  { id: "p39", nome: "Espinafre", categoria: "Verduras", quantidadeAtual: 82, quantidadeMaxima: 100, percentual: 82, status: "ok", localizacao: { zona: "D1", posicao: { x: 3, y: 8 } } },
  { id: "p40", nome: "Agrião", categoria: "Verduras", quantidadeAtual: 36, quantidadeMaxima: 100, percentual: 36, status: "baixo", localizacao: { zona: "D1", posicao: { x: 4, y: 8 } } },
  { id: "p41", nome: "Couve", categoria: "Verduras", quantidadeAtual: 55, quantidadeMaxima: 100, percentual: 55, status: "baixo", localizacao: { zona: "D1", posicao: { x: 5, y: 8 } } },
  { id: "p42", nome: "Repolho", categoria: "Verduras", quantidadeAtual: 91, quantidadeMaxima: 100, percentual: 91, status: "ok", localizacao: { zona: "D1", posicao: { x: 6, y: 8 } } },
  { id: "p43", nome: "Acelga", categoria: "Verduras", quantidadeAtual: 14, quantidadeMaxima: 100, percentual: 14, status: "critico", localizacao: { zona: "D1", posicao: { x: 7, y: 8 } } },
  { id: "p44", nome: "Chicória", categoria: "Verduras", quantidadeAtual: 69, quantidadeMaxima: 100, percentual: 69, status: "ok", localizacao: { zona: "D1", posicao: { x: 8, y: 8 } } },

  // Verduras de Raiz - Lateral (6 posições)
  { id: "p45", nome: "Cenoura", categoria: "Verduras", quantidadeAtual: 90, quantidadeMaxima: 100, percentual: 90, status: "ok", localizacao: { zona: "E1", posicao: { x: 6, y: 5 } } },
  { id: "p46", nome: "Batata", categoria: "Verduras", quantidadeAtual: 18, quantidadeMaxima: 100, percentual: 18, status: "critico", localizacao: { zona: "E1", posicao: { x: 7, y: 5 } } },
  { id: "p47", nome: "Beterraba", categoria: "Verduras", quantidadeAtual: 73, quantidadeMaxima: 100, percentual: 73, status: "ok", localizacao: { zona: "E1", posicao: { x: 6, y: 6 } } },
  { id: "p48", nome: "Rabanete", categoria: "Verduras", quantidadeAtual: 29, quantidadeMaxima: 100, percentual: 29, status: "baixo", localizacao: { zona: "E1", posicao: { x: 7, y: 6 } } },
  { id: "p49", nome: "Nabo", categoria: "Verduras", quantidadeAtual: 84, quantidadeMaxima: 100, percentual: 84, status: "ok", localizacao: { zona: "E1", posicao: { x: 6, y: 7 } } },
  { id: "p50", nome: "Batata Doce", categoria: "Verduras", quantidadeAtual: 5, quantidadeMaxima: 100, percentual: 5, status: "critico", localizacao: { zona: "E1", posicao: { x: 7, y: 7 } } },

  // Verduras Diversas - Lateral (6 posições)
  { id: "p51", nome: "Tomate", categoria: "Verduras", quantidadeAtual: 12, quantidadeMaxima: 100, percentual: 12, status: "critico", localizacao: { zona: "E2", posicao: { x: 2, y: 6 } } },
  { id: "p52", nome: "Pepino", categoria: "Verduras", quantidadeAtual: 28, quantidadeMaxima: 100, percentual: 28, status: "baixo", localizacao: { zona: "E2", posicao: { x: 3, y: 6 } } },
  { id: "p53", nome: "Pimento", categoria: "Verduras", quantidadeAtual: 87, quantidadeMaxima: 100, percentual: 87, status: "ok", localizacao: { zona: "E2", posicao: { x: 2, y: 7 } } },
  { id: "p54", nome: "Beringela", categoria: "Verduras", quantidadeAtual: 44, quantidadeMaxima: 100, percentual: 44, status: "baixo", localizacao: { zona: "E2", posicao: { x: 3, y: 7 } } },
  { id: "p55", nome: "Brócolos", categoria: "Verduras", quantidadeAtual: 5, quantidadeMaxima: 100, percentual: 5, status: "critico", localizacao: { zona: "E2", posicao: { x: 4, y: 6 } } },
  { id: "p56", nome: "Couve-flor", categoria: "Verduras", quantidadeAtual: 79, quantidadeMaxima: 100, percentual: 79, status: "ok", localizacao: { zona: "E2", posicao: { x: 5, y: 6 } } },
];

export async function get_data_stock(): Promise<ApiResponse<Produto[]>> {
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
