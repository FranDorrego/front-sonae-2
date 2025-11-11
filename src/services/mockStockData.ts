import { Produto, ApiResponse, ComentarioProduto } from "@/types";
import { api } from "./api";

const MOCK_PRODUTOS: Produto[] = [
  {
    id: "p1",
    nome: "Maçãs Vermelhas",
    categoria: "Frutas",
    quantidadeAtual: 85,
    quantidadeMaxima: 100,
    percentual: 85,
    status: "ok",
    localizacao: { zona: "A1", posicao: { x: 15, y: 20 } },
  },
  {
    id: "p2",
    nome: "Bananas",
    categoria: "Frutas",
    quantidadeAtual: 35,
    quantidadeMaxima: 100,
    percentual: 35,
    status: "baixo",
    localizacao: { zona: "A2", posicao: { x: 25, y: 20 } },
  },
  {
    id: "p3",
    nome: "Laranjas",
    categoria: "Frutas",
    quantidadeAtual: 12,
    quantidadeMaxima: 100,
    percentual: 12,
    status: "critico",
    localizacao: { zona: "A3", posicao: { x: 35, y: 20 } },
  },
  {
    id: "p4",
    nome: "Leite Integral",
    categoria: "Laticínios",
    quantidadeAtual: 90,
    quantidadeMaxima: 100,
    percentual: 90,
    status: "ok",
    localizacao: { zona: "B1", posicao: { x: 55, y: 35 } },
  },
  {
    id: "p5",
    nome: "Iogurtes",
    categoria: "Laticínios",
    quantidadeAtual: 28,
    quantidadeMaxima: 100,
    percentual: 28,
    status: "baixo",
    localizacao: { zona: "B2", posicao: { x: 65, y: 35 } },
  },
  {
    id: "p6",
    nome: "Queijos",
    categoria: "Laticínios",
    quantidadeAtual: 5,
    quantidadeMaxima: 100,
    percentual: 5,
    status: "critico",
    localizacao: { zona: "B3", posicao: { x: 75, y: 35 } },
  },
  {
    id: "p7",
    nome: "Pão Fresco",
    categoria: "Padaria",
    quantidadeAtual: 95,
    quantidadeMaxima: 100,
    percentual: 95,
    status: "ok",
    localizacao: { zona: "C1", posicao: { x: 15, y: 50 } },
  },
  {
    id: "p8",
    nome: "Bolos",
    categoria: "Padaria",
    quantidadeAtual: 42,
    quantidadeMaxima: 100,
    percentual: 42,
    status: "baixo",
    localizacao: { zona: "C2", posicao: { x: 25, y: 50 } },
  },
  {
    id: "p9",
    nome: "Croissants",
    categoria: "Padaria",
    quantidadeAtual: 18,
    quantidadeMaxima: 100,
    percentual: 18,
    status: "critico",
    localizacao: { zona: "C3", posicao: { x: 35, y: 50 } },
  },
  {
    id: "p10",
    nome: "Carne Bovina",
    categoria: "Carnes",
    quantidadeAtual: 78,
    quantidadeMaxima: 100,
    percentual: 78,
    status: "ok",
    localizacao: { zona: "D1", posicao: { x: 55, y: 65 } },
  },
  {
    id: "p11",
    nome: "Frango",
    categoria: "Carnes",
    quantidadeAtual: 32,
    quantidadeMaxima: 100,
    percentual: 32,
    status: "baixo",
    localizacao: { zona: "D2", posicao: { x: 65, y: 65 } },
  },
  {
    id: "p12",
    nome: "Peixe Fresco",
    categoria: "Carnes",
    quantidadeAtual: 8,
    quantidadeMaxima: 100,
    percentual: 8,
    status: "critico",
    localizacao: { zona: "D3", posicao: { x: 75, y: 65 } },
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
