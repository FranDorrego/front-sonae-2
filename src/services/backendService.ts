import { api } from "./api";
import { ApiResponse } from "@/types";

const BACKEND_URL = "https://backagentesonae.sonae.arducloud.com";

// Interfaces para respuestas del backend
export interface Loja {
  id: number;
  nombre: string;
  zonas: {
    zona: string;
    camara_id: number;
  }[];
}

export interface LojasResponse {
  total: number;
  lojas: Loja[];
}

export interface ProductoStatus {
  id_producto: number;
  id_camara: number;
  coordenadas: { x: number; y: number };
  cantidad_actual: number;
  espacio_total: number;
  timestamp: string;
}

export interface StatusResponse {
  id_loja: number;
  source: string;
  productos: ProductoStatus[];
}

export interface EstadisticaProducto {
  id_producto: number;
  nombre: string;
  "rotacion_%": number;
  "uso_espacio_%": number;
  "eficacia_%": number;
}

export interface EstadisticasResponse {
  id_loja: number;
  source: string;
  estadisticas: EstadisticaProducto[];
}

// Obtener todas las lojas
export async function getLojas(): Promise<ApiResponse<LojasResponse>> {
  try {
    const response = await fetch(`${BACKEND_URL}/lojas`);
    if (!response.ok) throw new Error("Error al cargar lojas");
    
    const datos = await response.json();
    return { sucesso: true, dados: datos };
  } catch (erro) {
    console.warn("Usando datos mock de lojas:", erro);
    return {
      sucesso: false,
      erro: "Error al conectar con el backend",
    };
  }
}

// Obtener status de productos de una loja
export async function getStatus(idLoja: number): Promise<ApiResponse<StatusResponse>> {
  return {
      sucesso: false,
      erro: "Error al conectar con el backend",
    };
  
  try {
    const response = await fetch(`${BACKEND_URL}/status/${idLoja}`);
    if (!response.ok) throw new Error("Error al cargar status");
    
    const datos = await response.json();
    return { sucesso: true, dados: datos };
  } catch (erro) {
    console.warn("Usando datos mock de status:", erro);
    return {
      sucesso: false,
      erro: "Error al conectar con el backend",
    };
  }
}

// Obtener estadísticas de una loja
export async function getEstadisticas(idLoja: number): Promise<ApiResponse<EstadisticasResponse>> {
  return {
      sucesso: false,
      erro: "Error al conectar con el backend",
    };
  
  try {
    const response = await fetch(`${BACKEND_URL}/estadistica/${idLoja}`);
    if (!response.ok) throw new Error("Error al cargar estadísticas");
    
    const datos = await response.json();
    return { sucesso: true, dados: datos };
  } catch (erro) {
    console.warn("Usando datos mock de estadísticas:", erro);
    return {
      sucesso: false,
      erro: "Error al conectar con el backend",
    };
  }
}
