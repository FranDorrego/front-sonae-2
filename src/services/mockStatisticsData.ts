import { Estatistica, ApiResponse } from "@/types";
import { api } from "./api";

const MOCK_ESTATISTICAS: Estatistica[] = [
  {
    id: "e1",
    nomeProduto: "Maçãs",
    categoria: "Frutas",
    percentualVendas: 14.2,
    percentualEspaco: 10.0,
    eficiencia: 1.42,
  },
  {
    id: "e2",
    nomeProduto: "Bananas",
    categoria: "Frutas",
    percentualVendas: 18.5,
    percentualEspaco: 10.0,
    eficiencia: 1.85,
  },
  {
    id: "e3",
    nomeProduto: "Laranjas",
    categoria: "Frutas",
    percentualVendas: 9.8,
    percentualEspaco: 8.5,
    eficiencia: 1.15,
  },
  {
    id: "e4",
    nomeProduto: "Morangos",
    categoria: "Frutas",
    percentualVendas: 12.3,
    percentualEspaco: 9.0,
    eficiencia: 1.37,
  },
  {
    id: "e5",
    nomeProduto: "Uvas",
    categoria: "Frutas",
    percentualVendas: 7.2,
    percentualEspaco: 8.0,
    eficiencia: 0.90,
  },
  {
    id: "e6",
    nomeProduto: "Melão",
    categoria: "Frutas",
    percentualVendas: 8.9,
    percentualEspaco: 11.0,
    eficiencia: 0.81,
  },
  {
    id: "e7",
    nomeProduto: "Peras",
    categoria: "Frutas",
    percentualVendas: 11.6,
    percentualEspaco: 9.5,
    eficiencia: 1.22,
  },
  {
    id: "e8",
    nomeProduto: "Limões",
    categoria: "Frutas",
    percentualVendas: 5.8,
    percentualEspaco: 7.0,
    eficiencia: 0.83,
  },
  {
    id: "e9",
    nomeProduto: "Tomate",
    categoria: "Verduras",
    percentualVendas: 15.4,
    percentualEspaco: 12.0,
    eficiencia: 1.28,
  },
  {
    id: "e10",
    nomeProduto: "Alface",
    categoria: "Verduras",
    percentualVendas: 10.7,
    percentualEspaco: 9.5,
    eficiencia: 1.13,
  },
  {
    id: "e11",
    nomeProduto: "Cenoura",
    categoria: "Verduras",
    percentualVendas: 13.2,
    percentualEspaco: 10.0,
    eficiencia: 1.32,
  },
  {
    id: "e12",
    nomeProduto: "Pepino",
    categoria: "Verduras",
    percentualVendas: 8.5,
    percentualEspaco: 8.5,
    eficiencia: 1.00,
  },
  {
    id: "e13",
    nomeProduto: "Brócolos",
    categoria: "Verduras",
    percentualVendas: 4.2,
    percentualEspaco: 7.5,
    eficiencia: 0.56,
  },
  {
    id: "e14",
    nomeProduto: "Couve",
    categoria: "Verduras",
    percentualVendas: 6.8,
    percentualEspaco: 8.0,
    eficiencia: 0.85,
  },
  {
    id: "e15",
    nomeProduto: "Espinafre",
    categoria: "Verduras",
    percentualVendas: 9.3,
    percentualEspaco: 8.5,
    eficiencia: 1.09,
  },
  {
    id: "e16",
    nomeProduto: "Batata",
    categoria: "Verduras",
    percentualVendas: 16.7,
    percentualEspaco: 13.0,
    eficiencia: 1.28,
  },
];

export async function get_data_estatisticas(): Promise<
  ApiResponse<Estatistica[]>
> {
  try {
    const response = await api<Estatistica[]>("/estatisticas");

    if (response.sucesso && response.dados) {
      return response;
    }

    throw new Error("Falha na API");
  } catch (erro) {
    console.warn("Usando dados mock de estatísticas");
    return { sucesso: true, dados: MOCK_ESTATISTICAS };
  }
}
