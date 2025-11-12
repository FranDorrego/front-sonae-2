import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Conselho } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ConselhoCard from "@/components/ConselhoCard";
import AjudaConselhoChat from "@/components/AjudaConselhoChat";
import { get_data_conselhos, post_resposta_conselho } from "@/services/mockAdviceData";
import { getLojas } from "@/services/backendService";
import { toast } from "sonner";

export default function Conselhos() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "gerente";
  const [conselhos, setConselhos] = useState<Conselho[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [lojas, setLojas] = useState<any[]>([]);
  const [lojaSeleccionada, setLojaSeleccionada] = useState<string>("");

  useEffect(() => {
    carregarLojas();
    carregarDados();
  }, []);

  const carregarLojas = async () => {
    const response = await getLojas();
    if (response.sucesso && response.dados) {
      setLojas(response.dados.lojas);
      if (response.dados.lojas.length > 0) {
        setLojaSeleccionada(response.dados.lojas[0].id.toString());
      }
    }
  };

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

  const handleResposta = async (conselhoId: string, aceito: boolean, motivo?: string) => {
    setLoadingId(conselhoId);
    const response = await post_resposta_conselho(conselhoId, aceito, motivo);
    
    if (response.sucesso) {
      toast.success(aceito ? "Conselho aceite" : "Conselho rejeitado");
      if (!aceito && motivo) {
        console.log(`Motivo de rejeição (${conselhoId}):`, motivo);
      }
      setConselhos(conselhos.filter((c) => c.id !== conselhoId));
    } else {
      toast.error(response.erro || "Erro ao processar");
    }
    
    setLoadingId(null);
  };

  return (
    <Layout
      stores={lojas.map(l => ({ value: l.id.toString(), label: l.nombre }))}
      selectedStore={lojaSeleccionada}
      onStoreChange={setLojaSeleccionada}
      showMockBadge={true}
      currentView={view}
    >
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-foreground">
            Conselhos IA
          </h1>
          <AjudaConselhoChat />
        </div>
        <p className="text-muted-foreground mb-6">
          Sugestões inteligentes baseadas em dados históricos
        </p>

        {erro && <ErrorMessage message={erro} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : conselhos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Sem conselhos no momento
          </p>
        ) : (
          <div className="space-y-4">
            {conselhos.map((conselho) => (
              <ConselhoCard
                key={conselho.id}
                conselho={conselho}
                onAceitar={() => handleResposta(conselho.id, true)}
                onRejeitar={(motivo) => handleResposta(conselho.id, false, motivo)}
                isLoading={loadingId === conselho.id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
