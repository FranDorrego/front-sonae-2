import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles, CheckCircle2, XCircle, Upload } from "lucide-react";
import { Tarefa, atualizarTarefa } from "@/services/mockTaskData";
import { useToast } from "@/hooks/use-toast";

interface TaskModalProps {
  tarefa: Tarefa;
  onClose: () => void;
}

export default function TaskModal({ tarefa, onClose }: TaskModalProps) {
  const [comentario, setComentario] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotos(Array.from(e.target.files));
    }
  };

  const handleConcluir = async () => {
    try {
      setIsLoading(true);
      await atualizarTarefa(tarefa.id, "concluida", {
        texto: comentario,
        fotos: fotos.map(f => f.name),
      });
      toast({
        title: "Tarefa Concluída",
        description: "A tarefa foi marcada como concluída com sucesso.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarcarErro = async () => {
    try {
      setIsLoading(true);
      await atualizarTarefa(tarefa.id, "erro", {
        texto: comentario,
        fotos: fotos.map(f => f.name),
      });
      toast({
        title: "Erro Reportado",
        description: "A tarefa foi marcada com erro.",
        variant: "destructive",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (tarefa.status) {
      case "concluida":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Concluída
          </Badge>
        );
      case "erro":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Com Erro
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Pendente
          </Badge>
        );
    }
  };

  const isPendente = tarefa.status === "pendente";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{tarefa.titulo}</DialogTitle>
            <div className="flex gap-2 shrink-0">
              {tarefa.criadaPorIA && (
                <Badge variant="secondary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  IA
                </Badge>
              )}
              {getStatusBadge()}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-sm text-muted-foreground">{tarefa.descricao}</p>
          </div>

          {tarefa.comentarios && tarefa.comentarios.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Comentários Anteriores</h3>
              <div className="space-y-2">
                {tarefa.comentarios.map((com, idx) => (
                  <div key={idx} className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">{com.texto}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(com.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPendente && (
            <>
              <div>
                <Label htmlFor="comentario">Comentário (opcional)</Label>
                <Textarea
                  id="comentario"
                  placeholder="Adicione observações sobre a tarefa..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="fotos">Fotos (opcional)</Label>
                <div className="mt-2">
                  <label
                    htmlFor="fotos"
                    className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">
                      {fotos.length > 0
                        ? `${fotos.length} foto(s) selecionada(s)`
                        : "Clique para adicionar fotos"}
                    </span>
                  </label>
                  <input
                    id="fotos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleConcluir}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Concluída
                </Button>
                <Button
                  onClick={handleMarcarErro}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reportar Erro
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
