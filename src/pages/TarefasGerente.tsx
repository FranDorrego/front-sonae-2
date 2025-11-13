import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tarefa, getTarefasPorZona } from "@/services/mockTaskData";
import { Plus, Trash2, Sparkles, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const zonas = [
  { value: "carniceria", label: "Carniceria" },
  { value: "reposicao", label: "Reposição" },
  { value: "panaderia", label: "Padaria" },
];

export default function TarefasGerente() {
  const [searchParams] = useSearchParams();
  const [tarefasPorZona, setTarefasPorZona] = useState<Record<string, Tarefa[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const { toast } = useToast();
  const view = searchParams.get("view") || "gerente";

  useEffect(() => {
    carregarTodasTarefas();
  }, []);

  const carregarTodasTarefas = async () => {
    try {
      setIsLoading(true);
      const tarefas: Record<string, Tarefa[]> = {};
      
      for (const zona of zonas) {
        const dados = await getTarefasPorZona(zona.value);
        tarefas[zona.value] = dados.filter(t => t.status === "pendente" || t.status === "erro");
      }
      
      setTarefasPorZona(tarefas);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as tarefas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    
    toast({
      title: "Tarefa Adicionada",
      description: `Nova tarefa adicionada à zona de ${zonas.find(z => z.value === zonaSeleccionada)?.label}`,
    });
    
    setShowAddModal(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setZonaSeleccionada("");
    carregarTodasTarefas();
  };

  const handleDeleteTask = (zona: string, tarefaId: string) => {
    toast({
      title: "Tarefa Removida",
      description: "A tarefa foi removida com sucesso",
    });
    carregarTodasTarefas();
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    toast({
      title: "Sugestão Aplicada",
      description: "As tarefas sugeridas pela IA foram adicionadas",
    });
    setShowSuggestionsModal(false);
    carregarTodasTarefas();
  };

  const aiSuggestions = [
    {
      zona: "reposicao",
      titulo: "Otimizar organização das prateleiras",
      descricao: "Reorganizar produtos por categoria para melhorar a experiência do cliente",
    },
    {
      zona: "carniceria",
      titulo: "Revisar sistema de refrigeração",
      descricao: "Verificação preventiva dos equipamentos de refrigeração",
    },
    {
      zona: "panaderia",
      titulo: "Implementar novo sistema de produção",
      descricao: "Otimizar horários de produção baseado em picos de demanda",
    },
  ];

  return (
    <Layout
      stores={[{ value: "default", label: "Visão Geral" }]}
      selectedStore="default"
      onStoreChange={() => {}}
      showMockBadge={true}
      currentView={view}
    >
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Gestão de Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie tarefas para todas as zonas
            </p>
          </div>
          <Button onClick={() => setShowSuggestionsModal(true)} variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Ver Sugestões IA
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {zonas.map((zona) => {
              const tarefas = tarefasPorZona[zona.value] || [];
              
              return (
                <Card key={zona.value}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{zona.label}</CardTitle>
                      <Button
                        size="sm"
                        onClick={() => {
                          setZonaSeleccionada(zona.value);
                          setShowAddModal(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tarefas.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma tarefa pendente
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {tarefas.map((tarefa) => (
                          <div
                            key={tarefa.id}
                            className="border border-border rounded-lg p-3 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{tarefa.titulo}</h4>
                                {tarefa.criadaPorIA && (
                                  <span className="shrink-0 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                    IA
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTask(zona.value, tarefa.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {tarefa.descricao}
                            </p>
                            <div className="flex items-center gap-1">
                              {tarefa.status === "erro" ? (
                                <div className="flex items-center gap-1 text-red-500">
                                  <AlertCircle className="h-3 w-3" />
                                  <span className="text-xs font-medium">Erro</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-xs font-medium">Pendente</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Task Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Adicionar Tarefa - {zonas.find(z => z.value === zonaSeleccionada)?.label}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Digite o título da tarefa"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Digite a descrição da tarefa"
                  className="mt-2"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                Adicionar Tarefa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AI Suggestions Modal */}
        <Dialog open={showSuggestionsModal} onOpenChange={setShowSuggestionsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Sugestões da IA
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {aiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {zonas.find(z => z.value === suggestion.zona)?.label}
                        </span>
                      </div>
                      <h4 className="font-semibold">{suggestion.titulo}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.descricao}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptSuggestion(suggestion.titulo)}
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
