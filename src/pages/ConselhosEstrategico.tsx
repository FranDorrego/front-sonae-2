import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLojas, Loja } from "@/services/backendService";
import {
  Users, 
  Wrench, 
  TrendingDown, 
  Package, 
  Clock, 
  Award,
  Building2
} from "lucide-react";

interface ConselhoEstrategico {
  id: string;
  tipo: "recursos-humanos" | "manutencao" | "vendas" | "inventario" | "operacional" | "reconhecimento";
  titulo: string;
  descricao: string;
  prioridade: "alta" | "media" | "baixa";
  loja: string;
}

const iconMap = {
  "recursos-humanos": Users,
  "manutencao": Wrench,
  "vendas": TrendingDown,
  "inventario": Package,
  "operacional": Clock,
  "reconhecimento": Award,
};

const prioridadeColor = {
  alta: "bg-red-500/10 text-red-500 border-red-500/20",
  media: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  baixa: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const conselhosEstrategicos: ConselhoEstrategico[] = [
  {
    id: "ce1",
    tipo: "recursos-humanos",
    titulo: "Avaliar contratação de colaboradores",
    descricao: "Há 12 tarefas pendentes acumuladas nas últimas 2 semanas. Recomenda-se avaliar a carga de trabalho com o gerente e considerar reforço na equipe.",
    prioridade: "alta",
    loja: "Loja Centro",
  },
  {
    id: "ce2",
    tipo: "manutencao",
    titulo: "Atenção aos equipamentos",
    descricao: "Foram reportados 4 problemas de equipamentos no último mês. Agende uma conversa com a equipe de manutenção para investigar as causas.",
    prioridade: "media",
    loja: "Loja Sul",
  },
  {
    id: "ce3",
    tipo: "vendas",
    titulo: "Queda nas vendas sem justificativa",
    descricao: "As vendas caíram 15% em relação ao mês anterior sem fatores externos conhecidos. Consulte o gerente para identificar possíveis causas.",
    prioridade: "alta",
    loja: "Loja Norte",
  },
  {
    id: "ce4",
    tipo: "inventario",
    titulo: "Rupturas frequentes de estoque",
    descricao: "Maçãs têm ficado sem estoque 5x nas últimas 3 semanas. Analise os envios e capacidade de armazenamento para esta loja.",
    prioridade: "media",
    loja: "Loja Centro",
  },
  {
    id: "ce5",
    tipo: "operacional",
    titulo: "Otimização de turnos",
    descricao: "Análise mostra baixo movimento entre 14h-16h e alto movimento às 18h-20h. Considere reorganizar os horários dos colaboradores para melhor cobertura.",
    prioridade: "baixa",
    loja: "Loja Sul",
  },
  {
    id: "ce6",
    tipo: "reconhecimento",
    titulo: "Métricas excepcionais",
    descricao: "Esta loja mantém 95% de eficiência nas últimas 4 semanas. Considere dar reconhecimento à equipe para manter a motivação.",
    prioridade: "baixa",
    loja: "Loja Centro",
  },
];

export default function ConselhosEstrategico() {
  const [searchParams] = useSearchParams();
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojaSelecionada, setLojaSelecionada] = useState("loja1");
  const [isLoading, setIsLoading] = useState(true);
  const [conselhosFiltrados, setConselhosFiltrados] = useState<ConselhoEstrategico[]>([]);
  const view = searchParams.get("view") || "estrategico";

  useEffect(() => {
    carregarLojas();
  }, []);

  useEffect(() => {
    const lojaAtual = lojas.find(l => l.id.toString() === lojaSelecionada);
    if (lojaAtual) {
      const filtrados = conselhosEstrategicos.filter(
        c => c.loja === lojaAtual.nombre
      );
      setConselhosFiltrados(filtrados);
    }
  }, [lojaSelecionada, lojas]);

  const carregarLojas = async () => {
    try {
      setIsLoading(true);
      const response = await getLojas();
      if (response.sucesso && response.dados) {
        setLojas(response.dados.lojas);
        if (response.dados.lojas.length > 0) {
          setLojaSelecionada(response.dados.lojas[0].id.toString());
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLojaChange = (lojaId: string) => {
    setLojaSelecionada(lojaId);
  };

  return (
    <Layout
      stores={lojas.map(l => ({ value: l.id.toString(), label: l.nombre }))}
      selectedStore={lojaSelecionada}
      onStoreChange={handleLojaChange}
      showMockBadge={true}
      currentView={view}
    >
      <div className="container mx-auto p-4 md:p-6 max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Conselhos Estratégicos</h1>
          </div>
          <p className="text-muted-foreground">
            Análises e recomendações para gestão estratégica da loja
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : conselhosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Tudo em ordem!</p>
              <p className="text-muted-foreground">
                Esta loja não possui conselhos estratégicos no momento
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conselhosFiltrados.map((conselho) => {
              const Icon = iconMap[conselho.tipo];
              
              return (
                <Card key={conselho.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{conselho.titulo}</CardTitle>
                          <Badge className={prioridadeColor[conselho.prioridade]}>
                            {conselho.prioridade === "alta" && "Alta Prioridade"}
                            {conselho.prioridade === "media" && "Prioridade Média"}
                            {conselho.prioridade === "baixa" && "Prioridade Baixa"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {conselho.descricao}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
