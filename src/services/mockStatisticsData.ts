import { Estatistica, ApiResponse } from "@/types";
import { api } from "./api";

const MOCK_ESTATISTICAS: Estatistica[] = [
  {
    id: "e1",
    nomeProduto: "Maçãs Vermelhas",
    categoria: "Frutas",
    percentualVendas: 12.5,
    percentualEspaco: 8.0,
    eficiencia: 1.56,
  },
  {
    id: "e2",
    nomeProduto: "Bananas",
    categoria: "Frutas",
    percentualVendas: 18.3,
    percentualEspaco: 10.0,
    eficiencia: 1.83,
  },
  {
    id: "e3",
    nomeProduto: "Laranjas",
    categoria: "Frutas",
    percentualVendas: 8.7,
    percentualEspaco: 7.5,
    eficiencia: 1.16,
  },
  {
    id: "e4",
    nomeProduto: "Leite Integral",
    categoria: "Laticínios",
    percentualVendas: 15.2,
    percentualEspaco: 12.0,
    eficiencia: 1.27,
  },
  {
    id: "e5",
    nomeProduto: "Iogurtes",
    categoria: "Laticínios",
    percentualVendas: 6.8,
    percentualEspaco: 11.0,
    eficiencia: 0.62,
  },
  {
    id: "e6",
    nomeProduto: "Queijos",
    categoria: "Laticínios",
    percentualVendas: 9.4,
    percentualEspaco: 9.0,
    eficiencia: 1.04,
  },
  {
    id: "e7",
    nomeProduto: "Pão Fresco",
    categoria: "Padaria",
    percentualVendas: 22.1,
    percentualEspaco: 15.0,
    eficiencia: 1.47,
  },
  {
    id: "e8",
    nomeProduto: "Bolos",
    categoria: "Padaria",
    percentualVendas: 5.9,
    percentualEspaco: 8.0,
    eficiencia: 0.74,
  },
  {
    id: "e9",
    nomeProduto: "Croissants",
    categoria: "Padaria",
    percentualVendas: 7.3,
    percentualEspaco: 6.0,
    eficiencia: 1.22,
  },
  {
    id: "e10",
    nomeProduto: "Carne Bovina",
    categoria: "Carnes",
    percentualVendas: 11.2,
    percentualEspaco: 10.5,
    eficiencia: 1.07,
  },
  {
    id: "e11",
    nomeProduto: "Frango",
    categoria: "Carnes",
    percentualVendas: 14.6,
    percentualEspaco: 11.0,
    eficiencia: 1.33,
  },
  {
    id: "e12",
    nomeProduto: "Peixe Fresco",
    categoria: "Carnes",
    percentualVendas: 3.8,
    percentualEspaco: 7.0,
    eficiencia: 0.54,
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
