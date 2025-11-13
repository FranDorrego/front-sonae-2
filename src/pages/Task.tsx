import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import TaskModal from "@/components/TaskModal";
import { Tarefa, getTarefasPorZona } from "@/services/taskService";
import { Clock, AlertCircle } from "lucide-react";

const zonas = [
  { value: "carniceria", label: "Carniceria" },
  { value: "reposicao", label: "Reposição" },
  { value: "panaderia", label: "Padaria" },
];

export default function Task() {
  const [searchParams] = useSearchParams();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [zonaSelecionada, setZonaSelecionada] = useState("reposicao");
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Tarefa | null>(null);
  const view = searchParams.get("view") || "gerente";

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

  // Filtrar solo tarefas pendentes y con erro (no mostrar completadas)
  const tarefasActivas = tarefas.filter(t => t.status === "pendente" || t.status === "erro");

  return (
    <Layout
      stores={zonas}
      selectedStore={zonaSelecionada}
      onStoreChange={setZonaSelecionada}
      showMockBadge={true}
      currentView={view}
    >
      <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-5xl">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2">Tarefas</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie suas tarefas diárias por zona
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : erro ? (
          <ErrorMessage message={erro} />
        ) : tarefasActivas.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <p className="text-sm md:text-base text-muted-foreground">
              Nenhuma tarefa pendente para esta zona
            </p>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {tarefasActivas.map((tarefa) => (
              <div
                key={tarefa.id}
                onClick={() => handleTarefaClick(tarefa)}
                className="bg-card border border-border rounded-lg p-3 md:p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary/50 active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                      <h3 className="font-semibold text-sm md:text-base truncate">
                        {tarefa.titulo}
                      </h3>
                      {tarefa.criadaPorIA && (
                        <span className="shrink-0 text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 md:px-2 py-0.5 rounded">
                          IA
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {tarefa.descricao}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    {tarefa.status === "erro" ? (
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-1 text-red-500">
                        <AlertCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span className="text-[10px] md:text-xs font-medium">Erro</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-1 text-yellow-600">
                        <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        <span className="text-[10px] md:text-xs font-medium">Pendente</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
