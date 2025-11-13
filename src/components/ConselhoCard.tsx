import { Conselho } from "@/types";
import { Check, X, AlertCircle, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ConselhoCardProps {
  conselho: Conselho;
  onAceitar: () => void;
  onRejeitar: (motivo: string) => void;
  isLoading: boolean;
}

export default function ConselhoCard({
  conselho,
  onAceitar,
  onRejeitar,
  isLoading,
}: ConselhoCardProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");

  const handleReject = () => {
    onRejeitar(motivoRejeicao);
    setShowRejectDialog(false);
    setMotivoRejeicao("");
  };

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
    <>
      <div
        className={cn(
          "bg-card border-l-4 rounded-xl p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5 shadow-md hover:shadow-lg transition-shadow",
          getPrioridadeColor()
        )}
      >
        <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
          <div className="p-2 sm:p-2.5 md:p-3 bg-secondary/10 rounded-xl text-secondary flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 space-y-2 sm:space-y-2.5 md:space-y-3 min-w-0">
            <h3 className="font-bold text-sm sm:text-base md:text-xl text-card-foreground leading-tight">
              {conselho.titulo}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-card-foreground/80 leading-relaxed">
              {conselho.descricao}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          <Button
            onClick={onAceitar}
            disabled={isLoading}
            size="sm"
            className="flex-1 font-semibold text-xs sm:text-sm"
          >
            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Aceitar
          </Button>
          <Button
            onClick={() => setShowRejectDialog(true)}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex-1 font-semibold text-xs sm:text-sm"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Rejeitar
          </Button>
        </div>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Por que você rejeita este conselho?</DialogTitle>
            <DialogDescription className="text-sm">
              Seu feedback nos ajuda a melhorar as sugestões da IA.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Digite o motivo..."
            value={motivoRejeicao}
            onChange={(e) => setMotivoRejeicao(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] text-sm"
          />
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleReject} 
              disabled={!motivoRejeicao.trim()}
              className="w-full sm:w-auto"
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
