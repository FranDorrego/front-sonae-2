import { useState, useEffect } from "react";
import { Produto, Zona } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import StoreMapPremium from "@/components/StoreMapPremium";
import ProductModal from "@/components/ProductModal";
import ProductIdentificationModal from "@/components/ProductIdentificationModal";
import { getLojas, getStatus, Loja } from "@/services/backendService";
import { get_data_stock } from "@/services/mockStockData";
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
    carregarDadosMock();
    const response = await getLojas();
    
    if (response.sucesso && response.dados) {
      setLojas(response.dados.lojas);
      if (response.dados.lojas.length > 0) {
        setLojaSeleccionada(response.dados.lojas[0].id);
        setZonasActivas(response.dados.lojas[0].zonas);
      }
      setUsandoMock(false);
    } else {
      // Fallback a datos mock con lojas y zonas predefinidas
      const lojasMock: Loja[] = [
        {
          id: 1,
          nombre: "Loja Demo",
          zonas: [
            { zona: "Zona Cítricos", camara_id: 101 },
            { zona: "Zona Tropicales", camara_id: 102 },
            { zona: "Zona Central", camara_id: 103 },
            { zona: "Zona Verduras", camara_id: 104 },
          ],
        },
      ];
      setLojas(lojasMock);
      setLojaSeleccionada(1);
      setZonasActivas(lojasMock[0].zonas);
      setUsandoMock(true);
      carregarDadosMock();
    }
  };

  const carregarDatos = async () => {
    if (lojaSeleccionada === null) return;
    
    setIsLoading(true);
    carregarDadosMock();
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
      // Asignar zonas a los productos mock si no las tienen correctamente
      const produtosComZonas = response.dados.map((p, index) => {
        const zonaIndex = index % zonasActivas.length;
        return {
          ...p,
          localizacao: {
            ...p.localizacao,
            zona: zonasActivas[zonaIndex]?.zona || p.localizacao.zona,
          },
        };
      });
      setProdutos(produtosComZonas);
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
    <Layout
      stores={lojas}
      selectedStore={lojaSeleccionada?.toString()}
      onStoreChange={handleLojaChange}
      showMockBadge={usandoMock}
    >
      <div className="h-full animate-fade-in">
        {erro && (
          <div className="p-4">
            <ErrorMessage message={erro} />
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <StoreMapPremium
            produtos={produtos}
            zonas={zonasActivas}
            onProductClick={setSelectedProduct}
          />
        )}

        {selectedProduct && selectedProduct.status === "desconhecido" ? (
          <ProductIdentificationModal
            produto={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        ) : selectedProduct ? (
          <ProductModal
            produto={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        ) : null}
      </div>
    </Layout>
  );
}
