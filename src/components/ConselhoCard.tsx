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
        "bg-card border-l-4 rounded-xl p-5 space-y-4 shadow-md hover:shadow-lg transition-shadow",
        getPrioridadeColor()
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-secondary/10 rounded-xl text-secondary flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-card-foreground">
            {conselho.titulo}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {conselho.descricao}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onAceitar}
          disabled={isLoading}
          size="sm" // chico
          className="flex-1 font-semibold"
        >
          <Check className="w-3 h-3 mr-1" />
          Aceitar
        </Button>
        <Button
          onClick={onRejeitar}
          disabled={isLoading}
          variant="outline"
          size="sm" // chico
          className="flex-1 font-semibold"
        >
          <X className="w-1 h-1 mr-1" />
          Rejeitar
        </Button>
      </div>
    </div>
  );
}
