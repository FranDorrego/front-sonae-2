import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import TaskCard from "@/components/TaskCard";
import TaskModal from "@/components/TaskModal";
import { Tarefa, getTarefasPorZona } from "@/services/mockTaskData";

const zonas = [
  { value: "reposicao", label: "Reposição" },
  { value: "carniceria", label: "Carniceria" },
  { value: "panaderia", label: "Padaria" },
];

export default function Task() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [zonaSelecionada, setZonaSelecionada] = useState("reposicao");
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);

  useEffect(() => {
    carregarTarefas();
  }, [zonaSelecionada]);

  const carregarTarefas = async () => {
    try {
      setIsLoading(true);
      setErro(null);
      const dados = await getTarefasPorZona(zonaSelecionada);
      setTarefas(dados);
    } catch (error) {
      setErro("Erro ao carregar tarefas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTarefaClick = (tarefa: Tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  const handleCloseModal = () => {
    setTarefaSelecionada(null);
    carregarTarefas();
  };

  const tarefasPendentes = tarefas.filter(t => t.status === "pendente");
  const tarefasConcluidas = tarefas.filter(t => t.status === "concluida");
  const tarefasComErro = tarefas.filter(t => t.status === "erro");

  return (
    <Layout
      stores={zonas}
      selectedStore={zonaSelecionada}
      onStoreChange={setZonaSelecionada}
      showMockBadge={true}
    >
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas diárias por zona
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : erro ? (
          <ErrorMessage message={erro} />
        ) : tarefas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhuma tarefa encontrada para esta zona
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tarefasPendentes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  Pendentes ({tarefasPendentes.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tarefasPendentes.map((tarefa) => (
                    <TaskCard
                      key={tarefa.id}
                      tarefa={tarefa}
                      onClick={handleTarefaClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {tarefasComErro.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Com Erro ({tarefasComErro.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tarefasComErro.map((tarefa) => (
                    <TaskCard
                      key={tarefa.id}
                      tarefa={tarefa}
                      onClick={handleTarefaClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {tarefasConcluidas.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Concluídas ({tarefasConcluidas.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tarefasConcluidas.map((tarefa) => (
                    <TaskCard
                      key={tarefa.id}
                      tarefa={tarefa}
                      onClick={handleTarefaClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tarefaSelecionada && (
          <TaskModal
            tarefa={tarefaSelecionada}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </Layout>
  );
}
