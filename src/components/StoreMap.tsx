import { Produto } from "@/types";
import { cn } from "@/lib/utils";

interface StoreMapProps {
  produtos: Produto[];
  onProductClick: (produto: Produto) => void;
}

export default function StoreMap({ produtos, onProductClick }: StoreMapProps) {
  const getStatusColor = (status: Produto["status"]) => {
    switch (status) {
      case "ok":
        return "bg-muted/60 border-muted";
      case "baixo":
        return "bg-warning/30 border-warning shadow-[0_0_12px_rgba(251,191,36,0.4)]";
      case "critico":
        return "bg-danger/40 border-danger shadow-[0_0_16px_rgba(239,68,68,0.6)] animate-pulse";
    }
  };

  const getZoneProdutos = (zona: string) => {
    return produtos.filter((p) => p.localizacao.zona === zona);
  };

  const renderIlha = (zona: string, label: string) => {
    const zoneProdutos = getZoneProdutos(zona);
    
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold text-primary px-2">{label}</div>
        <div className="grid grid-cols-4 gap-2">
          {zoneProdutos.map((produto) => (
            <button
              key={produto.id}
              onClick={() => onProductClick(produto)}
              className={cn(
                "relative aspect-square rounded-lg border-2 transition-all p-2 flex flex-col justify-between hover:scale-105",
                getStatusColor(produto.status)
              )}
            >
              <div className="text-[10px] font-bold text-foreground/80">
                {produto.localizacao.zona}
              </div>
              <div className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                {produto.nome}
              </div>
              <div className="text-[10px] font-bold text-foreground/70">
                {produto.percentual}%
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background rounded-lg p-6 space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground">
          Seção Frutas & Verduras
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Vista de cima - Click para detalhes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {renderIlha("A1", "Ilha A1")}
          {renderIlha("A2", "Ilha A2")}
        </div>
        
        <div className="space-y-6">
          {renderIlha("A3", "Ilha A3")}
          {renderIlha("B1", "Ilha B1")}
        </div>
      </div>

      <div className="flex justify-center gap-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-muted" />
          <span className="text-xs text-muted-foreground">OK ({'>'}60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/30 border-2 border-warning" />
          <span className="text-xs text-muted-foreground">Baixo (20-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-danger/40 border-2 border-danger" />
          <span className="text-xs text-muted-foreground">Crítico ({'<'}20%)</span>
        </div>
      </div>
    </div>
  );
}
