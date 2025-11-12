import { useState, useEffect } from "react";
import { Produto, Zona } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import StoreMapPremium from "@/components/StoreMapPremium";
import ProductModal from "@/components/ProductModal";
import { getLojas, getStatus, Loja } from "@/services/backendService";
import { get_data_stock } from "@/services/mockStockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Status() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojaSeleccionada, setLojaSeleccionada] = useState<number | null>(null);
  const [zonasActivas, setZonasActivas] = useState<Zona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [usandoMock, setUsandoMock] = useState(false);

  useEffect(() => {
    carregarLojas();
  }, []);

  useEffect(() => {
    if (lojaSeleccionada !== null) {
      carregarDatos();
    }
  }, [lojaSeleccionada]);

  const carregarLojas = async () => {
    const response = await getLojas();
    
    if (response.sucesso && response.dados) {
      setLojas(response.dados.lojas);
      if (response.dados.lojas.length > 0) {
        setLojaSeleccionada(response.dados.lojas[0].id);
        setZonasActivas(response.dados.lojas[0].zonas);
      }
      setUsandoMock(false);
    } else {
      // Fallback a datos mock
      setUsandoMock(true);
      carregarDadosMock();
    }
  };

  const carregarDatos = async () => {
    if (lojaSeleccionada === null) return;
    
    setIsLoading(true);
    const response = await getStatus(lojaSeleccionada);
    
    if (response.sucesso && response.dados) {
      // Convertir datos del backend a formato Produto
      const produtosConvertidos: Produto[] = response.dados.productos.map((p) => {
        const percentual = (p.cantidad_actual / p.espacio_total) * 100;
        const status = percentual < 20 ? "critico" : percentual < 60 ? "baixo" : "ok";
        
        // Encontrar la zona correspondiente
        const zona = zonasActivas.find(z => z.camara_id === p.id_camara);
        
        return {
          id: `${p.id_producto}`,
          nome: `Producto ${p.id_producto}`,
          categoria: zona?.zona || "General",
          quantidadeAtual: p.cantidad_actual,
          quantidadeMaxima: p.espacio_total,
          percentual,
          status,
          localizacao: {
            zona: zona?.zona || "Zona",
            posicao: { 
              x: Math.round(p.coordenadas.x * 4) + 1, 
              y: Math.round(p.coordenadas.y * 5) + 1 
            },
          },
        };
      });
      
      setProdutos(produtosConvertidos);
      setErro(null);
      setUsandoMock(false);
    } else {
      // Fallback a datos mock
      setUsandoMock(true);
      carregarDadosMock();
    }
    
    setIsLoading(false);
  };

  const carregarDadosMock = async () => {
    setIsLoading(true);
    const response = await get_data_stock();
    
    if (response.sucesso && response.dados) {
      setProdutos(response.dados);
      setErro(null);
    } else {
      setErro(response.erro || "Erro ao carregar dados");
    }
    
    setIsLoading(false);
  };

  const handleLojaChange = (value: string) => {
    const lojaId = parseInt(value);
    setLojaSeleccionada(lojaId);
    const loja = lojas.find(l => l.id === lojaId);
    if (loja) {
      setZonasActivas(loja.zonas);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 animate-fade-in">
        {/* Selector de Loja */}
        <div className="mb-4 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">Loja:</label>
            <Select value={lojaSeleccionada?.toString()} onValueChange={handleLojaChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar loja" />
              </SelectTrigger>
              <SelectContent>
                {lojas.map((loja) => (
                  <SelectItem key={loja.id} value={loja.id.toString()}>
                    {loja.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {usandoMock && (
            <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/30">
              Mock Data
            </Badge>
          )}
        </div>

        {erro && <ErrorMessage message={erro} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <StoreMapPremium
            produtos={produtos}
            zonas={zonasActivas}
            onProductClick={setSelectedProduct}
          />
        )}

        {selectedProduct && (
          <ProductModal
            produto={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </Layout>
  );
}
