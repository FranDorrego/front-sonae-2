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
      case "desconhecido":
        return "bg-unknown/70 border-unknown shadow-lg ring-2 ring-unknown/50";
      case "sem-estoque":
        return "bg-muted/60 border-muted-foreground/30";
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

  // Calcular flex-grow basado en la urgencia
  const getFlexGrow = (status: Produto["status"]) => {
    switch (status) {
      case "critico":
        return 4; // Ocupa más espacio
      case "sem-estoque":
        return 3.5; // Espacio grande pero sin alerta roja
      case "desconhecido":
        return 3; // Espacio alto para llamar atención
      case "baixo":
        return 2; // Espacio mediano
      case "ok":
        return 1; // Espacio mínimo
    }
  };

  // Renderizar un producto individual con flex-grow dinámico
  const renderProducto = (produto: Produto) => {
    const isOk = produto.status === "ok";
    const flexGrow = getFlexGrow(produto.status);

    return (
      <button
        key={produto.id}
        onClick={() => onProductClick(produto)}
        style={{ flexGrow }}
        className={cn(
          "relative rounded border sm:border-2 transition-all hover:scale-105 hover:z-20 flex items-center justify-center min-h-[40px] sm:min-h-[60px]",
          getStatusColor(produto.status),
          "flex-shrink-0"
        )}
        title={`${produto.nome} - ${produto.percentual}%`}
      >
        {isOk ? (
          <span className="text-[7px] sm:text-[8px] font-medium text-muted-foreground text-center px-0.5 sm:px-1 line-clamp-2">
            {produto.nome}
          </span>
        ) : produto.status === "desconhecido" ? (
          <div className="flex flex-col items-center justify-center p-1 sm:p-2 w-full">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-foreground mb-1" />
            <span className="text-[8px] sm:text-[10px] font-bold text-foreground text-center line-clamp-2">
              Produto<br />Desconhecido
            </span>
          </div>
        ) : produto.status === "sem-estoque" ? (
          <div className="flex flex-col items-center justify-center p-1 sm:p-2 w-full">
            <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7 text-muted-foreground mb-0.5 sm:mb-1" />
            <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground text-center line-clamp-2 mb-0.5 sm:mb-1">
              {produto.nome}
            </span>
            <span className="text-[10px] sm:text-sm font-bold text-muted-foreground">
              {produto.percentual}%
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-1 sm:p-2 w-full">
            <span className={cn(
              "font-bold text-foreground text-center line-clamp-2 mb-0.5 sm:mb-1",
              produto.status === "critico" ? "text-[10px] sm:text-[12px]" : "text-[8px] sm:text-[10px]"
            )}>
              {produto.nome}
            </span>
            <span className={cn(
              "font-extrabold text-foreground",
              produto.status === "critico" ? "text-[12px] sm:text-[14px]" : "text-[10px] sm:text-[12px]"
            )}>
              {produto.percentual}%
            </span>
            {produto.status === "critico" && (
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-danger-foreground mt-0.5 sm:mt-1" />
            )}
          </div>
        )}
      </button>
    );
  };

  // Renderizar una zona como estantería con productos que ocupan 100% del espacio
  const renderZona = (zona: Zona, orientation: "horizontal" | "vertical") => {
    const productosZona = productosPorZona[zona.zona] || [];
    
    return (
      <div className={cn(
        "bg-muted/10 rounded-md sm:rounded-lg p-1.5 sm:p-3 border sm:border-2 border-border/30 relative h-full flex flex-col",
        orientation === "vertical" ? "min-h-[200px] sm:min-h-[400px]" : "min-h-[80px] sm:min-h-[120px]"
      )}>
        {/* Etiqueta de zona */}
        <div className="absolute -top-2 sm:-top-3 left-2 sm:left-3 bg-background px-1.5 sm:px-2 py-0.5 rounded border border-border shadow-sm z-10">
          <span className="text-[7px] sm:text-xs font-bold text-foreground">{zona.zona}</span>
        </div>
        
        {/* Productos en la zona - ocupan 100% del espacio disponible */}
        <div className={cn(
          "flex gap-1 sm:gap-2 p-1 sm:p-2 flex-1",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}>
          {productosZona.length > 0 ? (
            productosZona.map((produto) => renderProducto(produto))
          ) : (
            <span className="text-[10px] sm:text-xs text-muted-foreground m-auto">Sin productos</span>
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
    <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
      <div className="w-full h-full max-w-[1600px] bg-gradient-to-br from-background via-muted/10 to-background rounded-lg sm:rounded-xl shadow-2xl border border-border/50 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="text-center py-2 sm:py-3 border-b border-border/30 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <h2 className="text-base sm:text-xl font-bold text-foreground mb-0.5 sm:mb-1">
            Mapa de Loja
          </h2>
        </div>

        {/* Mapa Principal */}
        <div className="flex-1 relative bg-background/50 overflow-auto">
          <div className="h-full p-2 sm:p-4">
            
            {/* ENTRADA */}
            <div className="text-center mb-1 sm:mb-1">
              <div className="inline-block bg-primary/10 border border-primary/30 sm:border-2 rounded px-3 py-1 sm:px-6 sm:py-2">
                <span className="text-[10px] sm:text-sm font-bold text-primary">↓ ENTRADA ↓</span>
              </div>
            </div>

            {/* Layout del supermercado */}
            <div className="grid grid-cols-12 gap-2 sm:gap-4 h-[calc(100%-80px)] sm:h-[calc(100%-100px)]  items-center gap-4">
              
              {/* COLUMNA IZQUIERDA (Zonas verticales) */}
              <div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-4">
                {zonas.map((zona, index) => {
                  const pos = getZonaPosition(index);
                  if (pos === "left-top" || pos === "left-bottom") {
                    return <div key={zona.camara_id}>{renderZona(zona, "vertical")}</div>;
                  }
                  return null;
                })}
              </div>

              {/* COLUMNA CENTRAL (Zonas horizontales) */}
              <div className="col-span-8 sm:col-span-8 flex flex-col justify-center gap-3 sm:gap-6 px-1 sm:px-4">
                {zonas.map((zona, index) => {
                  const pos = getZonaPosition(index);
                  if (pos === "center") {
                    return <div key={zona.camara_id}>{renderZona(zona, "horizontal")}</div>;
                  }
                  return null;
                })}
              </div>

              {/* COLUMNA DERECHA (Zonas verticales) */}
              <div className="col-span-2 sm:col-span-2 flex flex-col gap-2 sm:gap-4">
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
            <div className="text-center mt-1 sm:mt-1">
              <div className="inline-block bg-primary/10 border border-primary/30 sm:border-2 rounded px-3 py-1 sm:px-6 sm:py-2">
                <span className="text-[10px] sm:text-sm font-bold text-primary">→ CAIXAS →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="py-2 sm:py-3 px-2 sm:px-4 border-t border-border/30 bg-muted/5">
          <div className="flex justify-center gap-2 sm:gap-8 flex-wrap">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-3 sm:h-3 rounded border border-muted-foreground/10 sm:border-2 bg-muted/40 flex-shrink-0" />
              <div className="text-[10px] sm:text-xs">
                <div className="font-bold text-foreground whitespace-nowrap">OK (&gt;60%)</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-3 sm:h-3 rounded border border-warning sm:border-2 bg-warning/70 shadow-lg flex-shrink-0" />
              <div className="text-[10px] sm:text-xs">
                <div className="font-bold text-foreground whitespace-nowrap">Atención (20-60%)</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-3 sm:h-3 rounded border border-danger sm:border-2 bg-danger/80 shadow-xl flex-shrink-0" />
              <div className="text-[10px] sm:text-xs">
                <div className="font-bold text-foreground whitespace-nowrap">Crítico (&lt;20%)</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-3 sm:h-3 rounded border border-unknown sm:border-2 bg-unknown/70 shadow-lg flex-shrink-0" />
              <div className="text-[10px] sm:text-xs">
                <div className="font-bold text-foreground whitespace-nowrap">Desconhecido</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-3 sm:h-3 rounded border border-muted-foreground/30 sm:border-2 bg-muted/60 flex-shrink-0" />
              <div className="text-[10px] sm:text-xs">
                <div className="font-bold text-foreground whitespace-nowrap">Sem Stock no Depósito</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}