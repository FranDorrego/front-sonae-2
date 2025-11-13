import { api } from "./api";

export interface Comentario {
  texto?: string;
  fotos?: string[];
  timestamp: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  zona: string;
  criadaPorIA: boolean;
  status: "pendente" | "concluida" | "erro";
  comentarios: Comentario[];
}

// GET /tarefas/{zona} - Listar tarefas por zona
export async function getTarefasPorZona(zona: string): Promise<Tarefa[]> {
  const response = await api<Tarefa[]>(`/tarefas/${zona}`);
  if (response.sucesso && response.dados) {
    return response.dados;
  }
  return [];
}

// GET /tarefa/{tarefa_id} - Obter uma tarefa por ID
export async function getTarefaPorId(tarefaId: string): Promise<Tarefa | null> {
  const response = await api<Tarefa>(`/tarefa/${tarefaId}`);
  if (response.sucesso && response.dados) {
    return response.dados;
  }
  return null;
}

// POST /tarefa - Criar tarefa
export async function criarTarefa(
  titulo: string,
  descricao: string,
  zona: string,
  criadaPorIA: boolean = false
): Promise<Tarefa | null> {
  const response = await api<Tarefa>(`/tarefa`, {
    method: "POST",
    body: JSON.stringify({ titulo, descricao, zona, criadaPorIA }),
  });
  if (response.sucesso && response.dados) {
    return response.dados;
  }
  return null;
}

// PUT /tarefa/{tarefa_id} - Atualizar tarefa
export async function atualizarTarefa(
  tarefaId: string,
  updates: {
    titulo?: string;
    descricao?: string;
    status?: "pendente" | "concluida" | "erro";
    zona?: string;
  }
): Promise<Tarefa | null> {
  const response = await api<Tarefa>(`/tarefa/${tarefaId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (response.sucesso && response.dados) {
    return response.dados;
  }
  return null;
}

// POST /tarefa/{tarefa_id}/comentario - Adicionar comentário
export async function adicionarComentario(
  tarefaId: string,
  texto: string,
  fotos: string[] = []
): Promise<Comentario | null> {
  const response = await api<Comentario>(`/tarefa/${tarefaId}/comentario`, {
    method: "POST",
    body: JSON.stringify({ texto, fotos }),
  });
  if (response.sucesso && response.dados) {
    return response.dados;
  }
  return null;
}

// DELETE /tarefa/{tarefa_id} - Eliminar tarefa
export async function deletarTarefa(tarefaId: string): Promise<boolean> {
  const response = await api<{ ok: boolean }>(`/tarefa/${tarefaId}`, {
    method: "DELETE",
  });
  return response.sucesso && response.dados?.ok === true;
}
