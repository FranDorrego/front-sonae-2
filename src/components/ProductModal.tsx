import { useState } from "react";
import { Produto } from "@/types";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { post_comentario_produto } from "@/services/mockStockData";
import { toast } from "sonner";

interface ProductModalProps {
  produto: Produto;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ produto, isOpen, onClose }: ProductModalProps) {
  const [comentario, setComentario] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (acao: "ok" | "nao") => {
    setIsLoading(true);
    
    const response = await post_comentario_produto({
      produtoId: produto.id,
      comentario: acao === "ok" ? comentario : "Operação não realizada",
      timestamp: new Date().toISOString(),
    });

    setIsLoading(false);

    if (response.sucesso) {
      toast.success(acao === "ok" ? "Comentário enviado" : "Operação cancelada");
      setComentario("");
      onClose();
    } else {
      toast.error(response.erro || "Erro ao processar");
    }
  };

  const getStatusText = () => {
    switch (produto.status) {
      case "ok": return "Normal";
      case "baixo": return "Atenção necessária";
      case "critico": return "Crítico";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{produto.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="font-bold text-lg">{getStatusText()}</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Localização</p>
              <p className="font-bold text-lg">{produto.localizacao.zona}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Nível atual</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    produto.status === "ok"
                      ? "bg-success"
                      : produto.status === "baixo"
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                  style={{ width: `${produto.percentual}%` }}
                />
              </div>
              <span className="text-lg font-bold min-w-[50px] text-right">
                {produto.percentual}%
              </span>
            </div>
          </div>

          {(produto.status === "baixo" || produto.status === "critico") && (
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Comentário
              </label>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ex: Já está completo, Sem stock no depósito..."
                rows={3}
                className="resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => handleSubmit("ok")}
              disabled={isLoading}
              className="flex-1 font-semibold"
              size="lg"
            >
              <Check className="w-5 h-5 mr-2" />
              OK
            </Button>
            <Button
              onClick={() => handleSubmit("nao")}
              disabled={isLoading}
              variant="outline"
              className="flex-1 font-semibold"
              size="lg"
            >
              <X className="w-5 h-5 mr-2" />
              Não se Faz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
