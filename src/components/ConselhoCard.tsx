import { Conselho } from "@/types";
import { Check, X, AlertCircle, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConselhoCardProps {
  conselho: Conselho;
  onAceitar: () => void;
  onRejeitar: () => void;
  isLoading: boolean;
}

export default function ConselhoCard({
  conselho,
  onAceitar,
  onRejeitar,
  isLoading,
}: ConselhoCardProps) {
  const getIcon = () => {
    switch (conselho.tipo) {
      case "reposicao": return <AlertCircle className="w-5 h-5" />;
      case "otimizacao": return <TrendingUp className="w-5 h-5" />;
      case "alerta": return <AlertTriangle className="w-5 h-5" />;
      case "sugestao": return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getPrioridadeColor = () => {
    switch (conselho.prioridade) {
      case "alta": return "border-l-danger";
      case "media": return "border-l-warning";
      case "baixa": return "border-l-secondary";
    }
  };

  return (
    <div
      className={cn(
        "bg-card border-l-4 rounded-lg p-4 space-y-3",
        getPrioridadeColor()
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-card-foreground">
            {conselho.titulo}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {conselho.descricao}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onAceitar}
          disabled={isLoading}
          size="sm"
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-2" />
          Aceitar
        </Button>
        <Button
          onClick={onRejeitar}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <X className="w-4 h-4 mr-2" />
          Rejeitar
        </Button>
      </div>
    </div>
  );
}
