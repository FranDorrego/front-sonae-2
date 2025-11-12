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
          "bg-card border-l-4 rounded-xl p-6 space-y-5 shadow-md hover:shadow-lg transition-shadow",
          getPrioridadeColor()
        )}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="font-bold text-xl text-card-foreground leading-tight">
              {conselho.titulo}
            </h3>
            <p className="text-base text-card-foreground/80 leading-relaxed">
              {conselho.descricao}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onAceitar}
            disabled={isLoading}
            size="default"
            className="flex-1 font-semibold"
          >
            <Check className="w-4 h-4 mr-2" />
            Aceitar
          </Button>
          <Button
            onClick={() => setShowRejectDialog(true)}
            disabled={isLoading}
            variant="outline"
            size="default"
            className="flex-1 font-semibold"
          >
            <X className="w-4 h-4 mr-2" />
            Rejeitar
          </Button>
        </div>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Por qué rechazas este consejo?</DialogTitle>
            <DialogDescription>
              Tu feedback nos ayuda a mejorar las sugerencias de la IA.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Escribe el motivo..."
            value={motivoRejeicao}
            onChange={(e) => setMotivoRejeicao(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReject} disabled={!motivoRejeicao.trim()}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
