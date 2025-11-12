import { Produto, Zona } from "@/types";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface StoreMapPremiumProps {
  produtos: Produto[];
  zonas: Zona[];
  onProductClick: (produto: Produto) => void;
}

export default function StoreMapPremium({
  produtos,
  zonas,
  onProductClick,
}: StoreMapPremiumProps) {
  // Agrupar productos por zona
  const productosPorZona = zonas.reduce((acc, zona) => {
    acc[zona.zona] = produtos.filter(p => p.localizacao.zona === zona.zona);
    return acc;
  }, {} as Record<string, Produto[]>);

  const getStatusColor = (status: Produto["status"]) => {
    switch (status) {
      case "ok":
        return "bg-muted/40 border-muted-foreground/10";
      case "baixo":
        return "bg-warning/70 border-warning shadow-lg ring-1 ring-warning/40";
      case "critico":
        return "bg-danger/80 border-danger shadow-xl ring-2 ring-danger/50 animate-pulse";
    }
  };

  // Tamaño basado en criticidad: OK pequeño, Warning mediano, Critical grande
  const getProductSize = (status: Produto["status"]) => {
    switch (status) {
      case "ok":
        return "w-8 h-8"; // Muy pequeño y discreto
      case "baixo":
        return "w-16 h-16"; // Mediano, llama atención
      case "critico":
        return "w-24 h-24"; // Grande, muy visible
    }
  };

  // Renderizar un producto individual
  const renderProducto = (produto: Produto) => {
    const size = getProductSize(produto.status);
    const isOk = produto.status === "ok";

    return (
      <button
        key={produto.id}
        onClick={() => onProductClick(produto)}
        className={cn(
          "relative rounded border-2 transition-all hover:scale-110 hover:z-20 flex items-center justify-center",
          size,
          getStatusColor(produto.status),
          "flex-shrink-0"
        )}
        title={`${produto.nome} - ${produto.percentual}%`}
      >
        {isOk ? (
          <span className="text-[6px] font-medium text-muted-foreground text-center px-0.5 line-clamp-2">
            {produto.nome}
          </span>
        ) : (
          <div className="flex flex-col items-center justify-center p-1 w-full">
            <span className="text-[8px] font-bold text-foreground text-center line-clamp-2 mb-0.5">
              {produto.nome}
            </span>
            <span className="text-[10px] font-extrabold text-foreground">
              {produto.percentual}%
            </span>
            {produto.status === "critico" && (
              <AlertCircle className="w-3 h-3 text-danger-foreground mt-0.5" />
            )}
          </div>
        )}
      </button>
    );
  };

  // Renderizar una zona como estantería
  const renderZona = (zona: Zona, orientation: "horizontal" | "vertical") => {
    const productosZona = productosPorZona[zona.zona] || [];
    
    return (
      <div className={cn(
        "bg-muted/10 rounded-lg p-3 border-2 border-border/30 relative",
        orientation === "vertical" ? "min-h-[400px]" : "min-h-[120px]"
      )}>
        {/* Etiqueta de zona */}
        <div className="absolute -top-3 left-3 bg-background px-2 py-0.5 rounded border border-border shadow-sm z-10">
          <span className="text-xs font-bold text-foreground">{zona.zona}</span>
        </div>
        
        {/* Productos en la zona */}
        <div className={cn(
          "flex gap-2 flex-wrap p-2",
          orientation === "vertical" ? "flex-col items-start" : "flex-row items-center justify-start"
        )}>
          {productosZona.map((produto) => renderProducto(produto))}
          {productosZona.length === 0 && (
            <span className="text-xs text-muted-foreground">Sin productos</span>
          )}
        </div>
      </div>
    );
  };

  // Distribuir zonas según el layout del dibujo
  const getZonaPosition = (index: number): "left-top" | "left-bottom" | "center" | "right-top" | "right-bottom" => {
    const total = zonas.length;
    
    if (total <= 3) {
      if (index === 0) return "left-top";
      if (index === 1) return "center";
      return "right-top";
    }
    
    // Para 4-5 zonas: distribuir left-top, left-bottom, center, right-top, right-bottom
    if (index === 0) return "left-top";
    if (index === 1) return "left-bottom";
    if (index === Math.floor(total / 2)) return "center";
    if (index === total - 2) return "right-top";
    return "right-bottom";
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex items-center justify-center p-2">
      <div className="w-full h-full max-w-[1600px] bg-gradient-to-br from-background via-muted/10 to-background rounded-xl shadow-2xl border border-border/50 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="text-center py-3 border-b border-border/30 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Mapa de Loja - Vista Superior
          </h2>
          <p className="text-xs text-muted-foreground">
            Tamaño según criticidad • Click para detalles
          </p>
        </div>

        {/* Mapa Principal */}
        <div className="flex-1 relative bg-background/50 overflow-auto">
          <div className="h-full p-4">
            
            {/* ENTRADA */}
            <div className="text-center mb-4">
              <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-lg px-6 py-2">
                <span className="text-sm font-bold text-primary">↓ ENTRADA ↓</span>
              </div>
            </div>

            {/* Layout del supermercado */}
            <div className="grid grid-cols-12 gap-4 h-[calc(100%-100px)]">
              
              {/* COLUMNA IZQUIERDA (Zonas verticales) */}
              <div className="col-span-2 flex flex-col gap-4">
                {zonas.map((zona, index) => {
                  const pos = getZonaPosition(index);
                  if (pos === "left-top" || pos === "left-bottom") {
                    return <div key={zona.camara_id}>{renderZona(zona, "vertical")}</div>;
                  }
                  return null;
                })}
              </div>

              {/* COLUMNA CENTRAL (Zonas horizontales) */}
              <div className="col-span-8 flex flex-col justify-center gap-6 px-4">
                {zonas.map((zona, index) => {
                  const pos = getZonaPosition(index);
                  if (pos === "center") {
                    return <div key={zona.camara_id}>{renderZona(zona, "horizontal")}</div>;
                  }
                  return null;
                })}
              </div>

              {/* COLUMNA DERECHA (Zonas verticales) */}
              <div className="col-span-2 flex flex-col gap-4">
                {zonas.map((zona, index) => {
                  const pos = getZonaPosition(index);
                  if (pos === "right-top" || pos === "right-bottom") {
                    return <div key={zona.camara_id}>{renderZona(zona, "vertical")}</div>;
                  }
                  return null;
                })}
              </div>
            </div>

            {/* CAIXAS */}
            <div className="text-center mt-4">
              <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-lg px-6 py-2">
                <span className="text-sm font-bold text-primary">→ CAIXAS →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="py-3 px-4 border-t border-border/30 bg-muted/5">
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border-2 border-muted-foreground/10 bg-muted/40" />
              <div className="text-xs">
                <div className="font-bold text-foreground">OK (&gt;60%)</div>
                <div className="text-muted-foreground">Pequeño/Gris</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 rounded border-2 border-warning bg-warning/70 shadow-lg" />
              <div className="text-xs">
                <div className="font-bold text-foreground">Atención (20-60%)</div>
                <div className="text-muted-foreground">Mediano/Amarillo</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-24 h-24 rounded border-2 border-danger bg-danger/80 shadow-xl" />
              <div className="text-xs">
                <div className="font-bold text-foreground">Crítico (&lt;20%)</div>
                <div className="text-muted-foreground">Grande/Rojo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}