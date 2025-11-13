import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { Tarefa } from "@/services/taskService";

interface TaskCardProps {
  tarefa: Tarefa;
  onClick: (tarefa: Tarefa) => void;
}

export default function TaskCard({ tarefa, onClick }: TaskCardProps) {
  const getStatusColor = () => {
    switch (tarefa.status) {
      case "concluida":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "erro":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  const getStatusIcon = () => {
    switch (tarefa.status) {
      case "concluida":
        return <CheckCircle2 className="h-4 w-4" />;
      case "erro":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (tarefa.status) {
      case "concluida":
        return "Concluída";
      case "erro":
        return "Com Erro";
      default:
        return "Pendente";
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
      onClick={() => onClick(tarefa)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2">{tarefa.titulo}</CardTitle>
          {tarefa.criadaPorIA && (
            <Badge variant="secondary" className="shrink-0">
              <Sparkles className="h-3 w-3 mr-1" />
              IA
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tarefa.descricao}
        </p>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
