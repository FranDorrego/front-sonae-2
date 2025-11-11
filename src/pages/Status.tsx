import { useState, useEffect } from "react";
import { Produto } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ProductZone from "@/components/ProductZone";
import ProductModal from "@/components/ProductModal";
import { get_data_stock } from "@/services/mockStockData";

export default function Status() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
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

  return (
    <Layout>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Status do Supermercado
        </h1>

        {erro && <ErrorMessage message={erro} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {produtos.map((produto) => (
              <ProductZone
                key={produto.id}
                produto={produto}
                onClick={() => setSelectedProduct(produto)}
              />
            ))}
          </div>
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
