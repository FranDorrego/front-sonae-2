import { Produto, ApiResponse, ComentarioProduto } from "@/types";
import { api } from "./api";

const MOCK_PRODUTOS: Produto[] = [
  // Ilha A1 - Superior esquerda
  {
    id: "p1",
    nome: "Maçãs",
    categoria: "Frutas",
    quantidadeAtual: 85,
    quantidadeMaxima: 100,
    percentual: 85,
    status: "ok",
    localizacao: { zona: "A1", posicao: { x: 1, y: 1 } },
  },
  {
    id: "p2",
    nome: "Peras",
    categoria: "Frutas",
    quantidadeAtual: 72,
    quantidadeMaxima: 100,
    percentual: 72,
    status: "ok",
    localizacao: { zona: "A1", posicao: { x: 2, y: 1 } },
  },
  {
    id: "p3",
    nome: "Laranjas",
    categoria: "Frutas",
    quantidadeAtual: 15,
    quantidadeMaxima: 100,
    percentual: 15,
    status: "critico",
    localizacao: { zona: "A1", posicao: { x: 3, y: 1 } },
  },
  {
    id: "p4",
    nome: "Limões",
    categoria: "Frutas",
    quantidadeAtual: 38,
    quantidadeMaxima: 100,
    percentual: 38,
    status: "baixo",
    localizacao: { zona: "A1", posicao: { x: 4, y: 1 } },
  },
  // Ilha A2 - Central
  {
    id: "p5",
    nome: "Bananas",
    categoria: "Frutas",
    quantidadeAtual: 35,
    quantidadeMaxima: 100,
    percentual: 35,
    status: "baixo",
    localizacao: { zona: "A2", posicao: { x: 1, y: 2 } },
  },
  {
    id: "p6",
    nome: "Uvas",
    categoria: "Frutas",
    quantidadeAtual: 8,
    quantidadeMaxima: 100,
    percentual: 8,
    status: "critico",
    localizacao: { zona: "A2", posicao: { x: 2, y: 2 } },
  },
  {
    id: "p7",
    nome: "Morangos",
    categoria: "Frutas",
    quantidadeAtual: 65,
    quantidadeMaxima: 100,
    percentual: 65,
    status: "ok",
    localizacao: { zona: "A2", posicao: { x: 3, y: 2 } },
  },
  {
    id: "p8",
    nome: "Melão",
    categoria: "Frutas",
    quantidadeAtual: 42,
    quantidadeMaxima: 100,
    percentual: 42,
    status: "baixo",
    localizacao: { zona: "A2", posicao: { x: 4, y: 2 } },
  },
  // Ilha A3 - Inferior esquerda
  {
    id: "p9",
    nome: "Alface",
    categoria: "Verduras",
    quantidadeAtual: 78,
    quantidadeMaxima: 100,
    percentual: 78,
    status: "ok",
    localizacao: { zona: "A3", posicao: { x: 1, y: 3 } },
  },
  {
    id: "p10",
    nome: "Tomate",
    categoria: "Verduras",
    quantidadeAtual: 12,
    quantidadeMaxima: 100,
    percentual: 12,
    status: "critico",
    localizacao: { zona: "A3", posicao: { x: 2, y: 3 } },
  },
  {
    id: "p11",
    nome: "Cenoura",
    categoria: "Verduras",
    quantidadeAtual: 90,
    quantidadeMaxima: 100,
    percentual: 90,
    status: "ok",
    localizacao: { zona: "A3", posicao: { x: 3, y: 3 } },
  },
  {
    id: "p12",
    nome: "Pepino",
    categoria: "Verduras",
    quantidadeAtual: 28,
    quantidadeMaxima: 100,
    percentual: 28,
    status: "baixo",
    localizacao: { zona: "A3", posicao: { x: 4, y: 3 } },
  },
  // Ilha B1 - Superior direita
  {
    id: "p13",
    nome: "Brócolos",
    categoria: "Verduras",
    quantidadeAtual: 5,
    quantidadeMaxima: 100,
    percentual: 5,
    status: "critico",
    localizacao: { zona: "B1", posicao: { x: 1, y: 4 } },
  },
  {
    id: "p14",
    nome: "Couve",
    categoria: "Verduras",
    quantidadeAtual: 55,
    quantidadeMaxima: 100,
    percentual: 55,
    status: "baixo",
    localizacao: { zona: "B1", posicao: { x: 2, y: 4 } },
  },
  {
    id: "p15",
    nome: "Espinafre",
    categoria: "Verduras",
    quantidadeAtual: 82,
    quantidadeMaxima: 100,
    percentual: 82,
    status: "ok",
    localizacao: { zona: "B1", posicao: { x: 3, y: 4 } },
  },
  {
    id: "p16",
    nome: "Batata",
    categoria: "Verduras",
    quantidadeAtual: 18,
    quantidadeMaxima: 100,
    percentual: 18,
    status: "critico",
    localizacao: { zona: "B1", posicao: { x: 4, y: 4 } },
  },
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
