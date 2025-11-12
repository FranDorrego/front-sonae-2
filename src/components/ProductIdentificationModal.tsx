import { useState } from "react";
import { Produto } from "@/types";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProductIdentificationModalProps {
  produto: Produto;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductIdentificationModal({ produto, isOpen, onClose }: ProductIdentificationModalProps) {
  const [nomeProduto, setNomeProduto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (fotos.length + newFiles.length > 3) {
        toast.error("Máximo de 3 fotos permitidas");
        return;
      }
      setFotos([...fotos, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!nomeProduto.trim()) {
      toast.error("Por favor, insira o nome do produto");
      return;
    }
    
    if (fotos.length === 0) {
      toast.error("Por favor, adicione pelo menos 1 foto");
      return;
    }

    setIsLoading(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Produto identificado com sucesso! Status atualizado.");
    setNomeProduto("");
    setDescricao("");
    setFotos([]);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Produto Desconhecido</DialogTitle>
          <DialogDescription className="text-base">
            O sistema precisa de ajuda para identificar este produto. Envie 1 a 3 fotos com nome e descrição.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-unknown/20 border-2 border-unknown rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-1">Localização: {produto.localizacao.zona}</p>
            <p className="text-xs text-muted-foreground">Este produto precisa ser identificado pelo sistema</p>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Nome do Produto *
            </label>
            <Input
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
              placeholder="Ex: Maçã Verde, Banana Prata..."
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Descrição
            </label>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Adicione detalhes sobre o produto (opcional)"
              rows={3}
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">
              Fotos do Produto * (1 a 3 fotos)
            </label>
            
            {fotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {fotos.map((foto, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {fotos.length < 3 && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Clique para adicionar</span> ou arraste
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fotos.length}/3 fotos
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || fotos.length === 0 || !nomeProduto.trim()}
            className="w-full font-semibold"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            {isLoading ? "Enviando..." : "Identificar Produto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
