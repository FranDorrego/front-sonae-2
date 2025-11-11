import { Produto } from "@/types";
import { cn } from "@/lib/utils";

interface ProductZoneProps {
  produto: Produto;
  onClick: () => void;
}

export default function ProductZone({ produto, onClick }: ProductZoneProps) {
  const getStatusColor = () => {
    switch (produto.status) {
      case "ok":
        return "bg-muted hover:bg-muted/80";
      case "baixo":
        return "bg-warning/20 hover:bg-warning/30 border-warning";
      case "critico":
        return "bg-danger/20 hover:bg-danger/30 border-danger";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border-2 transition-all text-left min-h-[80px] flex flex-col justify-between",
        getStatusColor()
      )}
    >
      <div className="text-xs font-medium text-foreground mb-1">
        {produto.localizacao.zona}
      </div>
      <div className="text-sm font-semibold text-foreground line-clamp-2">
        {produto.nome}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {produto.percentual}%
      </div>
    </button>
  );
}
