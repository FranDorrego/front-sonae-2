import { useState, useEffect } from "react";
import { Produto } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import StoreMap from "@/components/StoreMap";
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
      <div className="p-4 md:p-8">
        {erro && <ErrorMessage message={erro} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <StoreMap
            produtos={produtos}
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
