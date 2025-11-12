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

  // Función para determinar la posición de cada zona en el layout
  const getZonaLayout = (index: number, total: number) => {
    // Distribución: arriba, izquierda, centro, derecha, abajo
    if (index === 0) return { position: 'top', label: '↓' };
    if (index === total - 1) return { position: 'bottom', label: '↑' };
    if (index === 1) return { position: 'left', label: '→' };
    if (index === total - 2 && total > 3) return { position: 'right', label: '←' };
    return { position: 'center', label: '' };
  };
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

  const renderZonaEstante = (zona: Zona, index: number, layout: { position: string; label: string }) => {
    const productosZona = productosPorZona[zona.zona] || [];
    const isVertical = layout.position === 'left' || layout.position === 'right';
    
    return (
      <div className={cn(
        "bg-muted/20 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 border border-border/40 shadow-sm",
        layout.position === 'center' && "col-span-2"
      )}>
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          {layout.label && (
            <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary">{layout.label}</span>
          )}
          <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-secondary">
            {zona.zona}
          </span>
        </div>
        <div 
          className={cn(
            "grid gap-2 sm:gap-3 lg:gap-4",
            isVertical ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {productosZona.map((producto) => (
            <div key={producto.id}>{renderSingleProduct(producto)}</div>
          ))}
          {productosZona.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground text-xs py-4">
              Sin productos
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSingleProduct = (produto: Produto) => {
    const boxSize = getBoxSize(produto.status);
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

          {/* Layout de supermercado con zonas posicionadas */}
          <div className="flex flex-col gap-3 sm:gap-5 lg:gap-8">
            
            {/* Zona Superior (si existe) */}
            {zonas.length > 0 && getZonaLayout(0, zonas.length).position === 'top' && (
              <div>
                {renderZonaEstante(zonas[0], 0, getZonaLayout(0, zonas.length))}
              </div>
            )}

            {/* Área central con estantes laterales y centrales */}
            <div className="grid grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
              
              {/* Estante Izquierdo */}
              {zonas.length > 1 && getZonaLayout(1, zonas.length).position === 'left' && (
                <div>
                  {renderZonaEstante(zonas[1], 1, getZonaLayout(1, zonas.length))}
                </div>
              )}

              {/* Estantes Centrales */}
              <div className="col-span-2 flex flex-col gap-3 sm:gap-5">
                {zonas.map((zona, index) => {
                  const layout = getZonaLayout(index, zonas.length);
                  if (layout.position === 'center') {
                    return (
                      <div key={zona.camara_id}>
                        {renderZonaEstante(zona, index, layout)}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Estante Derecho */}
              {zonas.length > 3 && getZonaLayout(zonas.length - 2, zonas.length).position === 'right' && (
                <div>
                  {renderZonaEstante(zonas[zonas.length - 2], zonas.length - 2, getZonaLayout(zonas.length - 2, zonas.length))}
                </div>
              )}
            </div>

            {/* Zona Inferior (si existe) */}
            {zonas.length > 2 && getZonaLayout(zonas.length - 1, zonas.length).position === 'bottom' && (
              <div>
                {renderZonaEstante(zonas[zonas.length - 1], zonas.length - 1, getZonaLayout(zonas.length - 1, zonas.length))}
              </div>
            )}
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