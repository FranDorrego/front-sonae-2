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
          <DialogTitle>{produto.nome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">{getStatusText()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Localização</p>
              <p className="font-semibold">{produto.localizacao.zona}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Nível atual</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 bg-muted rounded-full h-3">
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
              <span className="text-sm font-semibold">{produto.percentual}%</span>
            </div>
          </div>

          {(produto.status === "baixo" || produto.status === "critico") && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Comentário
              </label>
              <Textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Ex: Já está completo, Sem stock no depósito..."
                rows={3}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => handleSubmit("ok")}
              disabled={isLoading}
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-2" />
              OK
            </Button>
            <Button
              onClick={() => handleSubmit("nao")}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Não se Faz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
