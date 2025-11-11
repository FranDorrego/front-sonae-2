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
        return "bg-gradient-to-br from-muted/90 to-muted/70 border-muted-foreground/40";
      case "baixo":
        return "bg-gradient-to-br from-warning/50 to-warning/30 border-warning shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-2 ring-warning/30";
      case "critico":
        return "bg-gradient-to-br from-danger/60 to-danger/40 border-danger shadow-[0_0_25px_rgba(239,68,68,0.6)] ring-2 ring-danger/50 animate-pulse";
    }
  };

  const getStatusIcon = (status: Produto["status"]) => {
    if (status === "critico") {
      return <AlertCircle className="w-3 h-3 text-danger-foreground" />;
    }
    return null;
  };

  const getProdutoByPos = (x: number, y: number) => {
    return produtos.find(
      (p) => p.localizacao.posicao.x === x && p.localizacao.posicao.y === y
    );
  };

  const renderProductBox = (x: number, y: number, size: "small" | "medium" = "medium") => {
    const produto = getProdutoByPos(x, y);
    if (!produto) return <div className="w-full h-full bg-muted/20 rounded border border-dashed border-border/30" />;

    const boxSize = size === "small" ? "h-20" : "h-24";

    return (
      <button
        onClick={() => onProductClick(produto)}
        className={cn(
          "w-full relative rounded-lg border-2 transition-all hover:scale-105 hover:z-10 p-2 flex flex-col justify-between shadow-lg",
          boxSize,
          getStatusColor(produto.status)
        )}
      >
        <div className="flex items-start justify-between gap-1">
          <div className="text-[9px] font-bold text-foreground/90 bg-background/80 px-1.5 py-0.5 rounded">
            {produto.localizacao.zona}
          </div>
          {getStatusIcon(produto.status)}
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[11px] font-bold text-foreground leading-tight text-center line-clamp-2">
            {produto.nome}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-extrabold text-foreground/90 bg-background/80 px-1.5 py-0.5 rounded">
            {produto.percentual}%
          </div>
          <div className={cn(
            "w-2 h-2 rounded-full",
            produto.status === "ok" ? "bg-success" : produto.status === "baixo" ? "bg-warning" : "bg-danger"
          )} />
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-background via-muted/20 to-background rounded-3xl p-8 shadow-2xl border-2 border-border/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Planta da Loja - Frutas & Verduras
          </h2>
          <p className="text-sm text-muted-foreground">
            Vista superior em tempo real • Click para detalhes
          </p>
        </div>

        {/* Grid principal do supermercado */}
        <div className="relative bg-gradient-to-br from-muted/10 to-background/50 rounded-2xl p-6 border border-border/30">
          
          {/* ENTRADA - Parte superior */}
          <div className="mb-4 text-center">
            <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-lg px-6 py-2">
              <span className="text-xs font-bold text-primary">↓ ENTRADA ↓</span>
            </div>
          </div>

          {/* Corredor Superior - Frutas Cítricas */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
                Cítricos
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-border to-transparent" />
            </div>
            <div className="grid grid-cols-8 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                <div key={`a1-${x}`}>{renderProductBox(x, 1)}</div>
              ))}
            </div>
          </div>

          {/* Área Central - Ilhas e Corredores */}
          <div className="grid grid-cols-8 gap-3 mb-6">
            {/* Coluna 1 - Corredor Esquerdo (Tropicais) */}
            <div className="col-span-1 space-y-3">
              <div className="text-[10px] font-bold text-primary text-center mb-2 bg-primary/10 rounded px-2 py-1">
                Tropicais
              </div>
              {[2, 3, 4, 5, 6, 7].map((y) => (
                <div key={`b1-${y}`}>{renderProductBox(1, y, "small")}</div>
              ))}
            </div>

            {/* Colunas 2-7 - Ilhas Centrais */}
            <div className="col-span-6 space-y-3">
              {/* Ilha Central Superior - Frutas de Caroço */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/40">
                <div className="text-xs font-bold text-center text-secondary mb-3">Ilha Central - Frutas de Caroço & Uvas</div>
                <div className="grid grid-cols-6 gap-3">
                  {[2, 3, 4, 5, 6, 7].map((x) => (
                    <div key={`c1-${x}-3`}>{renderProductBox(x, 3)}</div>
                  ))}
                  {[2, 3].map((x) => (
                    <div key={`c1-${x}-4`}>{renderProductBox(x, 4)}</div>
                  ))}
                </div>
              </div>

              {/* Ilha Central Inferior - Melões & Kiwi */}
              <div className="bg-muted/20 rounded-xl p-4 border border-border/40">
                <div className="text-xs font-bold text-center text-secondary mb-3">Melões & Frutas Exóticas</div>
                <div className="grid grid-cols-6 gap-3">
                  {[4, 5, 6, 7].map((x) => (
                    <div key={`c2-${x}-4`}>{renderProductBox(x, 4)}</div>
                  ))}
                  {[2, 3, 4, 5].map((x) => (
                    <div key={`c2-${x}-5`}>{renderProductBox(x, 5)}</div>
                  ))}
                </div>
              </div>

              {/* Área de Verduras - Lado Esquerdo */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 bg-muted/20 rounded-xl p-3 border border-border/40">
                  <div className="text-xs font-bold text-center text-secondary mb-2">Verduras Diversas</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[2, 3].map((x) => (
                      <>
                        <div key={`e2-${x}-6`}>{renderProductBox(x, 6, "small")}</div>
                        <div key={`e2-${x}-7`}>{renderProductBox(x, 7, "small")}</div>
                      </>
                    ))}
                    {[4, 5].map((x) => (
                      <div key={`e2-${x}-6`}>{renderProductBox(x, 6, "small")}</div>
                    ))}
                  </div>
                </div>

                {/* Área de Raízes - Lado Direito */}
                <div className="bg-muted/20 rounded-xl p-3 border border-border/40">
                  <div className="text-xs font-bold text-center text-secondary mb-2">Raízes</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[6, 7].map((x) => (
                      <>
                        <div key={`e1-${x}-5`}>{renderProductBox(x, 5, "small")}</div>
                        <div key={`e1-${x}-6`}>{renderProductBox(x, 6, "small")}</div>
                        <div key={`e1-${x}-7`}>{renderProductBox(x, 7, "small")}</div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna 8 - Corredor Direito (Frutas Vermelhas) */}
            <div className="col-span-1 space-y-3">
              <div className="text-[10px] font-bold text-primary text-center mb-2 bg-primary/10 rounded px-2 py-1">
                Vermelhas
              </div>
              {[2, 3, 4, 5, 6, 7].map((y) => (
                <div key={`b2-${y}`}>{renderProductBox(8, y, "small")}</div>
              ))}
            </div>
          </div>

          {/* Corredor Inferior - Verduras Folhosas */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
              <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
                Folhosas
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-border via-border to-transparent" />
            </div>
            <div className="grid grid-cols-8 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((x) => (
                <div key={`d1-${x}`}>{renderProductBox(x, 8)}</div>
              ))}
            </div>
          </div>

          {/* CAIXAS - Parte inferior */}
          <div className="mt-4 text-center">
            <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-lg px-6 py-2">
              <span className="text-xs font-bold text-primary">CAIXAS →</span>
            </div>
          </div>
        </div>

        {/* Legenda Premium */}
        <div className="mt-8 bg-gradient-to-r from-muted/30 via-background/50 to-muted/30 rounded-xl p-6 border border-border/40">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-muted/90 to-muted/70 border-2 border-muted-foreground/40 shadow-md" />
              <div className="text-left">
                <div className="text-xs font-bold text-foreground">Normal</div>
                <div className="text-[10px] text-muted-foreground">{'>'} 60%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-warning/50 to-warning/30 border-2 border-warning shadow-md ring-2 ring-warning/30" />
              <div className="text-left">
                <div className="text-xs font-bold text-foreground">Atenção</div>
                <div className="text-[10px] text-muted-foreground">20-60%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-danger/60 to-danger/40 border-2 border-danger shadow-md ring-2 ring-danger/50" />
              <div className="text-left">
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
