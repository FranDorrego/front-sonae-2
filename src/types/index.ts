// Interfaces globais do sistema

export type StatusProduto = "ok" | "baixo" | "critico";

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidadeAtual: number;
  quantidadeMaxima: number;
  percentual: number;
  status: StatusProduto;
  localizacao: {
    zona: string;
    posicao: { x: number; y: number };
  };
}

export interface ComentarioProduto {
  produtoId: string;
  comentario: string;
  timestamp: string;
}

export interface Conselho {
  id: string;
  tipo: "reposicao" | "otimizacao" | "alerta" | "sugestao";
  titulo: string;
  descricao: string;
  prioridade: "alta" | "media" | "baixa";
  produtosRelacionados: string[];
  timestamp: string;
  aceito?: boolean;
}

export interface Estatistica {
  id: string;
  nomeProduto: string;
  categoria: string;
  percentualVendas: number;
  percentualEspaco: number;
  eficiencia: number;
}

export interface ApiResponse<T> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
}

export interface LoadingState {
  [key: string]: boolean;
}
