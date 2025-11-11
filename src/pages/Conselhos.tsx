import { useState, useEffect } from "react";
import { Conselho } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ConselhoCard from "@/components/ConselhoCard";
import { get_data_conselhos, post_resposta_conselho } from "@/services/mockAdviceData";
import { toast } from "sonner";

export default function Conselhos() {
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    const response = await get_data_conselhos();
    
    if (response.sucesso && response.dados) {
      setConselhos(response.dados);
      setErro(null);
    } else {
      setErro(response.erro || "Erro ao carregar dados");
    }
    
    setIsLoading(false);
  };

  const handleResposta = async (conselhoId: string, aceito: boolean) => {
    setLoadingId(conselhoId);
    const response = await post_resposta_conselho(conselhoId, aceito);
    
    if (response.sucesso) {
      toast.success(aceito ? "Conselho aceite" : "Conselho rejeitado");
      setConselhos(conselhos.filter((c) => c.id !== conselhoId));
    } else {
      toast.error(response.erro || "Erro ao processar");
    }
    
    setLoadingId(null);
  };

  return (
    <Layout>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Conselhos IA
        </h1>

        {erro && <ErrorMessage message={erro} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : conselhos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Sem conselhos no momento
          </p>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {conselhos.map((conselho) => (
              <ConselhoCard
                key={conselho.id}
                conselho={conselho}
                onAceitar={() => handleResposta(conselho.id, true)}
                onRejeitar={() => handleResposta(conselho.id, false)}
                isLoading={loadingId === conselho.id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
