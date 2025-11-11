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
        return "h-16 sm:h-20 lg:h-24"; // Responsive para productos OK
      case "baixo":
        return "h-20 sm:h-24 lg:h-28"; // Responsive para productos con atención
      case "critico":
        return "h-24 sm:h-28 lg:h-32"; // Responsive para productos críticos
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

    const boxSize = forceSize === "small" ? "h-12 sm:h-16 lg:h-20" : getBoxSize(produto.status);
    const isOk = produto.status === "ok";

    return (
      <button
        onClick={() => onProductClick(produto)}
        className={cn(
          "w-full relative rounded-md lg:rounded-lg border transition-all hover:scale-105 hover:z-10 p-1 sm:p-1.5 lg:p-2 flex flex-col justify-between",
          boxSize,
          getStatusColor(produto.status),
          isOk ? "shadow-sm" : "shadow-md lg:shadow-lg border-2"
        )}
      >
        {!isOk && (
          <div className="flex items-start justify-between gap-0.5 sm:gap-1">
            <div className="text-[7px] sm:text-[8px] lg:text-[9px] font-bold text-foreground/90 bg-background/80 px-1 sm:px-1.5 py-0.5 rounded">
              {produto.localizacao.zona}
            </div>
            {getStatusIcon(produto.status)}
          </div>
        )}
        
        <div className={cn("flex-1 flex items-center justify-center", isOk && "py-0.5 sm:py-1")}>
          <div className={cn(
            "font-bold leading-tight text-center line-clamp-2",
            isOk ? "text-[8px] sm:text-[9px] lg:text-[10px] text-muted-foreground" : "text-[9px] sm:text-[10px] lg:text-xs text-foreground"
          )}>
            {produto.nome}
          </div>
        </div>
        
        {!isOk && (
          <div className="flex items-center justify-between">
            <div className="text-[8px] sm:text-[9px] lg:text-[10px] font-extrabold text-foreground/90 bg-background/80 px-1 sm:px-1.5 py-0.5 rounded">
              {produto.percentual}%
            </div>
            <div className={cn(
              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
              produto.status === "baixo" ? "bg-warning" : "bg-danger"
            )} />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="w-full max-w-7xl bg-gradient-to-br from-background via-muted/20 to-background rounded-xl lg:rounded-2xl p-3 sm:p-5 lg:p-8 shadow-xl lg:shadow-2xl border border-border/50 flex flex-col">
        <div className="text-center mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1 sm:mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mapa de Stock en Tiempo Real
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Control visual del inventario • Click para ver detalles
          </p>
        </div>

        {/* Grid principal do supermercado */}
        <div className="relative bg-gradient-to-br from-muted/10 to-background/50 rounded-lg lg:rounded-xl p-3 sm:p-5 lg:p-8 border border-border/30">
          
          {/* ENTRADA - Parte superior */}
          <div className="mb-3 sm:mb-4 lg:mb-6 text-center">
            <div className="inline-block bg-primary/10 border border-primary/30 rounded-md lg:rounded-lg px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 lg:py-2">
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary">↓ ENTRADA ↓</span>
            </div>
          </div>

          {/* Layout simplificado */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-10">
            
            {/* Corredor Superior - Cítricos */}
            <div>
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
                <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary px-2 sm:px-3 lg:px-4 py-1 sm:py-1 lg:py-1.5 bg-primary/10 rounded-full shadow-sm whitespace-nowrap">
                  Pasillo Cítricos
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent" />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
                {[1, 2, 3, 4].map((x) => (
                  <div key={`a1-${x}`}>{renderProductBox(x, 1)}</div>
                ))}
              </div>
            </div>

            {/* Área Central con 3 corredores */}
            <div className="grid grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
              
              {/* Corredor Izquierdo - Tropicales */}
              <div className="flex flex-col">
                <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary text-center mb-2 sm:mb-3 lg:mb-4 bg-primary/10 rounded-md lg:rounded-lg px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 lg:py-2 shadow-sm">
                  Tropicales
                </div>
                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                  {[2, 3, 4].map((y) => (
                    <div key={`b1-${y}`}>{renderProductBox(1, y, "small")}</div>
                  ))}
                </div>
              </div>

              {/* Isla Central - 2 filas de productos */}
              <div className="col-span-2 flex flex-col gap-2 sm:gap-3 lg:gap-5">
                <div className="bg-muted/20 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-5 border border-border/40 shadow-sm">
                  <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-center text-secondary mb-2 sm:mb-3 lg:mb-4">Isla Central - Frutas</div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    {[2, 3, 4].map((x) => (
                      <div key={`c1-${x}-3`}>{renderProductBox(x, 3)}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-5 border border-border/40 shadow-sm">
                  <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-center text-secondary mb-2 sm:mb-3 lg:mb-4">Melões & Frutas</div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                    {[2, 3, 4].map((x) => (
                      <div key={`c2-${x}-4`}>{renderProductBox(x, 4)}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corredor Derecho - Verduras */}
              <div className="flex flex-col">
                <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary text-center mb-2 sm:mb-3 lg:mb-4 bg-primary/10 rounded-md lg:rounded-lg px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 lg:py-2 shadow-sm">
                  Verduras
                </div>
                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
                  {[2, 3, 4].map((y) => (
                    <div key={`b2-${y}`}>{renderProductBox(4, y, "small")}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Corredor Inferior - Folhosas */}
            <div>
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
                <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary px-2 sm:px-3 lg:px-4 py-1 sm:py-1 lg:py-1.5 bg-primary/10 rounded-full shadow-sm whitespace-nowrap">
                  Pasillo Folhosas
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent" />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-5">
                {[1, 2, 3, 4].map((x) => (
                  <div key={`d1-${x}`}>{renderProductBox(x, 5)}</div>
                ))}
              </div>
            </div>
          </div>

          {/* CAIXAS - Parte inferior */}
          <div className="mt-3 sm:mt-4 lg:mt-6 text-center">
            <div className="inline-block bg-primary/10 border border-primary/30 rounded-md lg:rounded-lg px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 lg:py-2">
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary">→ CAIXAS →</span>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="mt-3 sm:mt-4 lg:mt-6 bg-gradient-to-r from-muted/30 via-background/50 to-muted/30 rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 border border-border/40">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-muted/60 border border-muted-foreground/20 shadow-sm flex-shrink-0" />
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-foreground">Normal</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground">{'>'} 60%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-warning/50 to-warning/30 border-2 border-warning shadow-md ring-2 ring-warning/30 flex-shrink-0" />
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-foreground">Atenção</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground">20-60%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-danger/60 to-danger/40 border-2 border-danger shadow-md ring-2 ring-danger/50 flex-shrink-0" />
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-foreground">Crítico</div>
                <div className="text-[8px] sm:text-[10px] text-muted-foreground">{'<'} 20%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}