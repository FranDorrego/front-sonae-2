import { ApiResponse } from "@/types";

// URL base para todas as chamadas da API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Nome do cookie de sessão
const SESSION_COOKIE = "Autenticacao";

// Função para obter o cookie de sessão
const getSessionCookie = (): string => {
  const cookies = document.cookie.split(";");
  const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith(`${SESSION_COOKIE}=`));
  return sessionCookie ? sessionCookie.split("=")[1] : "";
};

// Método genérico para chamadas API
export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const sessionToken = getSessionCookie();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        [SESSION_COOKIE]: sessionToken,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const dados = await response.json();
    return { sucesso: true, dados };
  } catch (erro) {
    console.error("Erro na chamada API:", erro);
    return {
      sucesso: false,
      erro: "Não foi possível completar a operação. Por favor, tente novamente.",
    };
  }
}
