export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  zona: string;
  criadaPorIA: boolean;
  status: "pendente" | "concluida" | "erro";
  comentarios?: {
    texto?: string;
    fotos?: string[];
    timestamp: string;
  }[];
}

const tarefasReposicao: Tarefa[] = [
  {
    id: "t1",
    titulo: "Reabastecer Tomates",
    descricao: "Stock crítico de tomates na zona B1. Prioridade alta para reposição imediata.",
    zona: "reposicao",
    criadaPorIA: true,
    status: "pendente",
  },
  {
    id: "t2",
    titulo: "Verificar Validade Alfaces",
    descricao: "Realizar inspeção de validade das alfaces na zona A2.",
    zona: "reposicao",
    criadaPorIA: false,
    status: "pendente",
  },
  {
    id: "t3",
    titulo: "Organizar Maçãs",
    descricao: "Reorganizar display de maçãs na entrada. Produto em destaque da semana.",
    zona: "reposicao",
    criadaPorIA: false,
    status: "concluida",
    comentarios: [
      {
        texto: "Display reorganizado conforme solicitado",
        timestamp: new Date().toISOString(),
      }
    ]
  },
  {
    id: "t4",
    titulo: "Repor Bananas",
    descricao: "Nível de stock baixo detectado. Necessário reposição nas próximas 2 horas.",
    zona: "reposicao",
    criadaPorIA: true,
    status: "pendente",
  },
];

const tarefasCarniceria: Tarefa[] = [
  {
    id: "tc1",
    titulo: "Preparar Cortes Especiais",
    descricao: "Cliente solicitou 5kg de picanha cortada em bifes de 200g.",
    zona: "carniceria",
    criadaPorIA: false,
    status: "pendente",
  },
  {
    id: "tc2",
    titulo: "Limpeza da Câmara Fria",
    descricao: "Realizar limpeza e higienização da câmara fria conforme protocolo.",
    zona: "carniceria",
    criadaPorIA: false,
    status: "pendente",
  },
  {
    id: "tc3",
    titulo: "Verificar Temperatura",
    descricao: "Temperatura da vitrine acima do ideal (4.5°C). Verificar equipamento.",
    zona: "carniceria",
    criadaPorIA: true,
    status: "erro",
    comentarios: [
      {
        texto: "Técnico foi acionado. Aguardando manutenção.",
        timestamp: new Date().toISOString(),
      }
    ]
  },
];

const tarefasPanaderia: Tarefa[] = [
  {
    id: "tp1",
    titulo: "Preparar Massa para Amanhã",
    descricao: "Preparar 20kg de massa para pães de forma e 15kg para baguetes.",
    zona: "panaderia",
    criadaPorIA: false,
    status: "pendente",
  },
  {
    id: "tp2",
    titulo: "Repor Pães na Vitrine",
    descricao: "Vitrine com baixo estoque de pães. Necessário reposição imediata.",
    zona: "panaderia",
    criadaPorIA: true,
    status: "pendente",
  },
  {
    id: "tp3",
    titulo: "Higienização dos Equipamentos",
    descricao: "Realizar limpeza profunda dos fornos e bancadas.",
    zona: "panaderia",
    criadaPorIA: false,
    status: "concluida",
  },
];

export const getTarefasPorZona = (zona: string): Promise<Tarefa[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (zona) {
        case "reposicao":
          resolve(tarefasReposicao);
          break;
        case "carniceria":
          resolve(tarefasCarniceria);
          break;
        case "panaderia":
          resolve(tarefasPanaderia);
          break;
        default:
          resolve([]);
      }
    }, 500);
  });
};

export const atualizarTarefa = (
  tarefaId: string,
  status: "concluida" | "erro",
  comentario?: { texto?: string; fotos?: string[] }
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Tarefa atualizada:", { tarefaId, status, comentario });
      resolve();
    }, 500);
  });
};
