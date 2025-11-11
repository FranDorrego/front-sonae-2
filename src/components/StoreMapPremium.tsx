import { Produto } from "@/types";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface StoreMapPremiumProps {
  produtos: Produto[];
  onProductClick: (produto: Produto) => void;
}

export default function StoreMapPremium({
  produtos,
  onProductClick,
}: StoreMapPremiumProps) {
  const getStatusColor = (status: Produto["status"]) => {
    switch (status) {
      case "ok":
        return "bg-muted/60 border-muted-foreground/20";
      case "baixo":
        return "bg-gradient-to-br from-warning/50 to-warning/30 border-warning shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-2 ring-warning/30";
      case "critico":
        return "bg-gradient-to-br from-danger/60 to-danger/40 border-danger shadow-[0_0_25px_rgba(239,68,68,0.6)] ring-2 ring-danger/50 animate-pulse";
    }
  };

  const getBoxSize = (status: Produto["status"]) => {
    switch (status) {
      case "ok":
        return "h-20"; // Más pequeño para productos OK
      case "baixo":
        return "h-24"; // Mediano para productos con atención
      case "critico":
        return "h-28"; // Más grande para productos críticos
    }
  };

  const getStatusIcon = (status: Produto["status"]) => {
    if (status === "critico") {
      return <AlertCircle className="w-4 h-4 text-danger-foreground" />;
    }
    return null;
  };

  const getProdutoByPos = (x: number, y: number) => {
    return produtos.find(
      (p) => p.localizacao.posicao.x === x && p.localizacao.posicao.y === y
    );
  };

  const renderProductBox = (x: number, y: number, forceSize?: "small") => {
    const produto = getProdutoByPos(x, y);
    if (!produto) return <div className="w-full h-full bg-muted/20 rounded border border-dashed border-border/30" />;

    const boxSize = forceSize === "small" ? "h-16" : getBoxSize(produto.status);
    const isOk = produto.status === "ok";

    return (
      <button
        onClick={() => onProductClick(produto)}
        className={cn(
          "w-full relative rounded-lg border transition-all hover:scale-105 hover:z-10 p-2 flex flex-col justify-between",
          boxSize,
          getStatusColor(produto.status),
          isOk ? "shadow-sm" : "shadow-lg border-2"
        )}
      >
        {!isOk && (
          <div className="flex items-start justify-between gap-1">
            <div className="text-[9px] font-bold text-foreground/90 bg-background/80 px-1.5 py-0.5 rounded">
              {produto.localizacao.zona}
            </div>
            {getStatusIcon(produto.status)}
          </div>
        )}
        
        <div className={cn("flex-1 flex items-center justify-center", isOk && "py-1")}>
          <div className={cn(
            "font-bold leading-tight text-center line-clamp-2",
            isOk ? "text-[10px] text-muted-foreground" : "text-xs text-foreground"
          )}>
            {produto.nome}
          </div>
        </div>
        
        {!isOk && (
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-extrabold text-foreground/90 bg-background/80 px-1.5 py-0.5 rounded">
              {produto.percentual}%
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full",
              produto.status === "baixo" ? "bg-warning" : "bg-danger"
            )} />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center p-6">
      <div className="w-full h-full max-w-6xl bg-gradient-to-br from-background via-muted/20 to-background rounded-2xl p-8 shadow-2xl border border-border/50 flex flex-col">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mapa de Stock en Tiempo Real
          </h2>
          <p className="text-sm text-muted-foreground">
            Control visual del inventario • Click para ver detalles
          </p>
        </div>

        {/* Grid principal do supermercado */}
        <div className="relative bg-gradient-to-br from-muted/10 to-background/50 rounded-xl p-6 border border-border/30 flex-1 flex flex-col justify-between">
          
          {/* ENTRADA - Parte superior */}
          <div className="mb-6 text-center">
            <div className="inline-block bg-primary/10 border border-primary/30 rounded-lg px-6 py-2">
              <span className="text-sm font-bold text-primary">↓ ENTRADA ↓</span>
            </div>
          </div>

          {/* Layout simplificado */}
          <div className="flex-1 flex flex-col gap-8 justify-between">
            
            {/* Corredor Superior - Cítricos */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
                <span className="text-sm font-bold text-primary px-4 py-1.5 bg-primary/10 rounded-full shadow-sm">
                  Pasillo Cítricos
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent" />
              </div>
              <div className="grid grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((x) => (
                  <div key={`a1-${x}`}>{renderProductBox(x, 1)}</div>
                ))}
              </div>
            </div>

            {/* Área Central con 3 corredores */}
            <div className="flex-1 grid grid-cols-4 gap-8">
              
              {/* Corredor Izquierdo - Tropicales */}
              <div className="flex flex-col">
                <div className="text-sm font-bold text-primary text-center mb-4 bg-primary/10 rounded-lg px-3 py-2 shadow-sm">
                  Tropicales
                </div>
                <div className="flex-1 flex flex-col justify-around gap-4">
                  {[2, 3, 4].map((y) => (
                    <div key={`b1-${y}`}>{renderProductBox(1, y, "small")}</div>
                  ))}
                </div>
              </div>

              {/* Isla Central - 2 filas de productos */}
              <div className="col-span-2 flex flex-col gap-5">
                <div className="bg-muted/20 rounded-xl p-5 border border-border/40 shadow-sm">
                  <div className="text-sm font-bold text-center text-secondary mb-4">Isla Central - Frutas</div>
                  <div className="grid grid-cols-3 gap-4">
                    {[2, 3, 4].map((x) => (
                      <div key={`c1-${x}-3`}>{renderProductBox(x, 3)}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/20 rounded-xl p-5 border border-border/40 shadow-sm">
                  <div className="text-sm font-bold text-center text-secondary mb-4">Melões & Frutas</div>
                  <div className="grid grid-cols-3 gap-4">
                    {[2, 3, 4].map((x) => (
                      <div key={`c2-${x}-4`}>{renderProductBox(x, 4)}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corredor Derecho - Verduras */}
              <div className="flex flex-col">
                <div className="text-sm font-bold text-primary text-center mb-4 bg-primary/10 rounded-lg px-3 py-2 shadow-sm">
                  Verduras
                </div>
                <div className="flex-1 flex flex-col justify-around gap-4">
                  {[2, 3, 4].map((y) => (
                    <div key={`b2-${y}`}>{renderProductBox(4, y, "small")}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Corredor Inferior - Folhosas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
                <span className="text-sm font-bold text-primary px-4 py-1.5 bg-primary/10 rounded-full shadow-sm">
                  Pasillo Folhosas
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent" />
              </div>
              <div className="grid grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((x) => (
                  <div key={`d1-${x}`}>{renderProductBox(x, 5)}</div>
                ))}
              </div>
            </div>
          </div>

          {/* CAIXAS - Parte inferior */}
          <div className="mt-6 text-center">
            <div className="inline-block bg-primary/10 border border-primary/30 rounded-lg px-6 py-2">
              <span className="text-sm font-bold text-primary">→ CAIXAS →</span>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="mt-6 bg-gradient-to-r from-muted/30 via-background/50 to-muted/30 rounded-xl p-5 border border-border/40">
          <div className="flex justify-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-muted/60 border border-muted-foreground/20 shadow-sm" />
              <div>
                <div className="text-xs font-bold text-foreground">Normal</div>
                <div className="text-[10px] text-muted-foreground">{'>'} 60%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-warning/50 to-warning/30 border-2 border-warning shadow-md ring-2 ring-warning/30" />
              <div>
                <div className="text-xs font-bold text-foreground">Atenção</div>
                <div className="text-[10px] text-muted-foreground">20-60%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-danger/60 to-danger/40 border-2 border-danger shadow-md ring-2 ring-danger/50" />
              <div>
                <div className="text-xs font-bold text-foreground">Crítico</div>
                <div className="text-[10px] text-muted-foreground">{'<'} 20%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}