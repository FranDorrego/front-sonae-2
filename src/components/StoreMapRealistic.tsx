import { Produto } from "@/types";
import { cn } from "@/lib/utils";

interface StoreMapRealisticProps {
  produtos: Produto[];
  onProductClick: (produto: Produto) => void;
}

export default function StoreMapRealistic({
  produtos,
  onProductClick,
}: StoreMapRealisticProps) {
  const getStatusColor = (status: Produto["status"]) => {
    switch (status) {
      case "ok":
        return "bg-muted/80 border-muted-foreground/30";
      case "baixo":
        return "bg-warning/40 border-warning shadow-[0_0_15px_rgba(251,191,36,0.5)]";
      case "critico":
        return "bg-danger/50 border-danger shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse";
    }
  };

  const getProdutoByZonaAndPos = (zona: string, x: number, y: number) => {
    return produtos.find(
      (p) =>
        p.localizacao.zona === zona &&
        p.localizacao.posicao.x === x &&
        p.localizacao.posicao.y === y
    );
  };

  const renderProductBox = (zona: string, x: number, y: number) => {
    const produto = getProdutoByZonaAndPos(zona, x, y);
    if (!produto) return null;

    return (
      <button
        onClick={() => onProductClick(produto)}
        className={cn(
          "w-full h-full rounded border-2 transition-all hover:scale-110 p-2 flex flex-col justify-between",
          getStatusColor(produto.status)
        )}
      >
        <div className="text-[9px] font-bold text-foreground/70">
          {produto.localizacao.zona}
        </div>
        <div className="text-[10px] font-bold text-foreground leading-tight line-clamp-2 text-center">
          {produto.nome}
        </div>
        <div className="text-[9px] font-bold text-foreground/80">
          {produto.percentual}%
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 shadow-2xl border border-border/50">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Mapa do Supermercado
          </h2>
          <p className="text-sm text-muted-foreground">
            Seção Frutas & Verduras - Vista Superior
          </p>
        </div>

        {/* Mapa realista baseado no esboço */}
        <div className="relative bg-background/50 rounded-xl p-6 min-h-[600px]">
          {/* Ilha Superior (Data A3) */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="text-xs font-semibold text-primary mb-2 absolute -top-6 left-0">
              Data A3
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-12 h-12">
                  {i <= 4 && renderProductBox("A1", i, 1)}
                </div>
              ))}
            </div>
          </div>

          {/* Corredores laterais */}
          <div className="absolute top-32 left-8 space-y-2">
            <div className="text-xs font-semibold text-primary mb-1">
              Data A2
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12">
                {renderProductBox("A2", i, 2)}
              </div>
            ))}
          </div>

          <div className="absolute top-32 right-8 space-y-2">
            <div className="text-xs font-semibold text-primary mb-1">
              Data B1
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12">
                {renderProductBox("B1", i, 4)}
              </div>
            ))}
          </div>

          {/* Ilha Central - Suportes A2 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-xs font-semibold text-primary mb-2 text-center">
              Ilha Central
            </div>
            <div className="grid grid-cols-4 gap-3 bg-muted/30 p-4 rounded-lg">
              {[1, 2, 3, 4].map((row) => (
                <div key={row} className="w-16 h-16 flex items-center justify-center">
                  <div className="w-14 h-14 bg-muted/50 rounded border border-border/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Ilha Inferior (Seção Padrão) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="text-xs font-semibold text-primary mb-2 absolute -top-6 left-0">
              Seção Padrão
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-12 h-12">
                  {i <= 4 && renderProductBox("A3", i, 3)}
                </div>
              ))}
            </div>
          </div>

          {/* Área da esquina */}
          <div className="absolute top-8 left-8">
            <div className="text-xs font-semibold text-primary mb-1">Misc</div>
            <div className="w-12 h-12 bg-muted/30 rounded border border-dashed border-border" />
          </div>
        </div>

        {/* Legenda */}
        <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-muted/80 border-2 border-muted-foreground/30" />
            <span className="text-xs font-medium text-muted-foreground">
              OK ({">"}60%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-warning/40 border-2 border-warning" />
            <span className="text-xs font-medium text-muted-foreground">
              Baixo (20-60%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-danger/50 border-2 border-danger" />
            <span className="text-xs font-medium text-muted-foreground">
              Crítico ({"<"}20%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
