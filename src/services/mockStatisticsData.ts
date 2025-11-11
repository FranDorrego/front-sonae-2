import { Estatistica, ApiResponse } from "@/types";
import { api } from "./api";

const MOCK_ESTATISTICAS: Estatistica[] = [
  // Top performers
  { id: "e1", nomeProduto: "Bananas", categoria: "Frutas", percentualVendas: 18.5, percentualEspaco: 10.0, eficiencia: 1.85 },
  { id: "e2", nomeProduto: "Maçãs", categoria: "Frutas", percentualVendas: 14.2, percentualEspaco: 10.0, eficiencia: 1.42 },
  { id: "e3", nomeProduto: "Tomate", categoria: "Verduras", percentualVendas: 15.4, percentualEspaco: 12.0, eficiencia: 1.28 },
  { id: "e4", nomeProduto: "Batata", categoria: "Verduras", percentualVendas: 16.7, percentualEspaco: 13.0, eficiencia: 1.28 },
  { id: "e5", nomeProduto: "Cenoura", categoria: "Verduras", percentualVendas: 13.2, percentualEspaco: 10.0, eficiencia: 1.32 },
  
  // Bom desempenho
  { id: "e6", nomeProduto: "Laranjas", categoria: "Frutas", percentualVendas: 9.8, percentualEspaco: 8.5, eficiencia: 1.15 },
  { id: "e7", nomeProduto: "Morangos", categoria: "Frutas", percentualVendas: 12.3, percentualEspaco: 9.0, eficiencia: 1.37 },
  { id: "e8", nomeProduto: "Peras", categoria: "Frutas", percentualVendas: 11.6, percentualEspaco: 9.5, eficiencia: 1.22 },
  { id: "e9", nomeProduto: "Alface", categoria: "Verduras", percentualVendas: 10.7, percentualEspaco: 9.5, eficiencia: 1.13 },
  { id: "e10", nomeProduto: "Espinafre", categoria: "Verduras", percentualVendas: 9.3, percentualEspaco: 8.5, eficiencia: 1.09 },
  { id: "e11", nomeProduto: "Pepino", categoria: "Verduras", percentualVendas: 8.5, percentualEspaco: 8.5, eficiencia: 1.00 },
  
  // Desempenho médio
  { id: "e12", nomeProduto: "Limões", categoria: "Frutas", percentualVendas: 5.8, percentualEspaco: 7.0, eficiencia: 0.83 },
  { id: "e13", nomeProduto: "Melão", categoria: "Frutas", percentualVendas: 8.9, percentualEspaco: 11.0, eficiencia: 0.81 },
  { id: "e14", nomeProduto: "Uvas Verdes", categoria: "Frutas", percentualVendas: 7.2, percentualEspaco: 8.0, eficiencia: 0.90 },
  { id: "e15", nomeProduto: "Couve", categoria: "Verduras", percentualVendas: 6.8, percentualEspaco: 8.0, eficiencia: 0.85 },
  { id: "e16", nomeProduto: "Beringela", categoria: "Verduras", percentualVendas: 4.8, percentualEspaco: 7.0, eficiencia: 0.69 },
  
  // Baixo desempenho
  { id: "e17", nomeProduto: "Brócolos", categoria: "Verduras", percentualVendas: 4.2, percentualEspaco: 7.5, eficiencia: 0.56 },
  { id: "e18", nomeProduto: "Melão Galia", categoria: "Frutas", percentualVendas: 3.2, percentualEspaco: 8.0, eficiencia: 0.40 },
  { id: "e19", nomeProduto: "Romãs", categoria: "Frutas", percentualVendas: 2.8, percentualEspaco: 6.5, eficiencia: 0.43 },
  { id: "e20", nomeProduto: "Acelga", categoria: "Verduras", percentualVendas: 3.1, percentualEspaco: 7.0, eficiencia: 0.44 },
  
  // Frutas especiais
  { id: "e21", nomeProduto: "Framboesas", categoria: "Frutas", percentualVendas: 6.5, percentualEspaco: 6.0, eficiencia: 1.08 },
  { id: "e22", nomeProduto: "Mirtilos", categoria: "Frutas", percentualVendas: 8.1, percentualEspaco: 6.5, eficiencia: 1.25 },
  { id: "e23", nomeProduto: "Manga", categoria: "Frutas", percentualVendas: 7.3, percentualEspaco: 8.0, eficiencia: 0.91 },
  { id: "e24", nomeProduto: "Abacaxi", categoria: "Frutas", percentualVendas: 9.2, percentualEspaco: 10.0, eficiencia: 0.92 },
  { id: "e25", nomeProduto: "Kiwi", categoria: "Frutas", percentualVendas: 6.9, percentualEspaco: 7.5, eficiencia: 0.92 },
  
  // Verduras variadas
  { id: "e26", nomeProduto: "Pimento", categoria: "Verduras", percentualVendas: 10.2, percentualEspaco: 9.5, eficiencia: 1.07 },
  { id: "e27", nomeProduto: "Beterraba", categoria: "Verduras", percentualVendas: 7.4, percentualEspaco: 8.0, eficiencia: 0.93 },
  { id: "e28", nomeProduto: "Rabanete", categoria: "Verduras", percentualVendas: 4.6, percentualEspaco: 6.5, eficiencia: 0.71 },
  { id: "e29", nomeProduto: "Repolho", categoria: "Verduras", percentualVendas: 8.8, percentualEspaco: 9.0, eficiencia: 0.98 },
  { id: "e30", nomeProduto: "Couve-flor", categoria: "Verduras", percentualVendas: 7.9, percentualEspaco: 8.5, eficiencia: 0.93 },
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
