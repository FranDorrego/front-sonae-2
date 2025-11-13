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
    titulo: "Avaliar reforço de equipe na Carniceria",
    descricao: "Há 15 tarefas pendentes acumuladas nas últimas 2 semanas na zona de carniceria. O tempo médio de conclusão aumentou 40%. Recomenda-se avaliar a carga de trabalho com o gerente e considerar contratação de mais 1-2 colaboradores para esta zona.",
    prioridade: "alta",
    loja: "Loja Centro",
  },
  {
    id: "ce2",
    tipo: "manutencao",
    titulo: "Verificação urgente de equipamentos de refrigeração",
    descricao: "Foram reportados 6 problemas de temperatura em equipamentos de refrigeração no último mês, com 3 incidentes críticos. Agende uma inspeção completa com a equipe de manutenção e considere um plano de manutenção preventiva trimestral.",
    prioridade: "alta",
    loja: "Loja Sul",
  },
  {
    id: "ce3",
    tipo: "vendas",
    titulo: "Declínio significativo nas vendas - Investigação necessária",
    descricao: "As vendas caíram 18% em relação ao mesmo período do mês anterior, sem fatores externos conhecidos (clima, feriados, promoções). Reúna-se urgentemente com o gerente para investigar possíveis causas: atendimento, qualidade dos produtos, concorrência local ou problemas operacionais.",
    prioridade: "alta",
    loja: "Loja Norte",
  },
  {
    id: "ce4",
    tipo: "inventario",
    titulo: "Ruptura recorrente - Maçãs Gala",
    descricao: "Maçãs Gala ficaram sem estoque 7 vezes nas últimas 3 semanas, resultando em perda estimada de €850 em vendas. Analise os dados de fornecimento: a) Aumentar pedidos semanais de 120kg para 180kg, b) Verificar capacidade de armazenamento na câmara fria, c) Considerar fornecedor alternativo.",
    prioridade: "alta",
    loja: "Loja Centro",
  },
  {
    id: "ce5",
    tipo: "inventario",
    titulo: "Excesso de desperdício - Verduras de folha",
    descricao: "Taxa de desperdício de verduras de folha está em 22% (meta: 12%). Nas últimas 4 semanas foram descartados 45kg de alfaces e 38kg de espinafres. Recomenda-se: ajustar quantidade de pedidos, melhorar rotação de produtos e revisar processo de recebimento com o gerente.",
    prioridade: "media",
    loja: "Loja Norte",
  },
  {
    id: "ce6",
    tipo: "operacional",
    titulo: "Otimização de turnos para horários de pico",
    descricao: "Análise de movimento mostra: baixo fluxo entre 14h-16h (apenas 12% do movimento diário) e alto fluxo às 18h-20h (38% do movimento). Considere reorganizar turnos: reduzir 1 colaborador no período da tarde e reforçar com 2 no horário de pico. Economia estimada: €420/mês com melhor cobertura.",
    prioridade: "media",
    loja: "Loja Sul",
  },
  {
    id: "ce7",
    tipo: "operacional",
    titulo: "Atraso sistemático na preparação matinal",
    descricao: "A abertura da loja tem ocorrido com 15-25 minutos de atraso nas últimas 2 semanas. Identifique com o gerente se há problemas de: transporte dos colaboradores, processos de preparação muito longos, ou necessidade de ajuste no horário de entrada da equipe de abertura.",
    prioridade: "media",
    loja: "Loja Centro",
  },
  {
    id: "ce8",
    tipo: "manutencao",
    titulo: "Plano de renovação de equipamentos",
    descricao: "3 balanças digitais e 2 câmaras frias estão em uso há mais de 8 anos (vida útil recomendada: 6-7 anos). Os custos de manutenção aumentaram 65% este ano. Prepare um orçamento para substituição gradual nos próximos 6 meses antes de ocorrerem falhas críticas.",
    prioridade: "media",
    loja: "Loja Sul",
  },
  {
    id: "ce9",
    tipo: "vendas",
    titulo: "Oportunidade: Produtos sazonais de verão",
    descricao: "Aproximação do verão detectada. Histórico mostra aumento de 35% nas vendas de melancia, melão e frutas tropicais entre junho-agosto. Recomenda-se: negociar contratos com fornecedores com antecedência, aumentar espaço de exposição em 20%, e preparar campanha promocional.",
    prioridade: "baixa",
    loja: "Loja Norte",
  },
  {
    id: "ce10",
    tipo: "recursos-humanos",
    titulo: "Necessidade de treinamento - Novos colaboradores",
    descricao: "4 novos colaboradores contratados nas últimas 6 semanas. Taxa de erros operacionais aumentou 28% (etiquetagem incorreta, produtos mal armazenados). Organize sessão de treinamento intensivo de 2 dias focado em: procedimentos de qualidade, sistema de refrigeração e atendimento ao cliente.",
    prioridade: "media",
    loja: "Loja Centro",
  },
  {
    id: "ce11",
    tipo: "reconhecimento",
    titulo: "Excelente desempenho - Parabenize a equipe!",
    descricao: "Esta loja alcançou 96% de eficiência operacional nas últimas 5 semanas consecutivas, com zero rupturas críticas e satisfação do cliente em 4.7/5. Resultados excepcionais! Considere: reconhecimento público da equipe, incentivo financeiro ou bônus, e compartilhar as melhores práticas com outras lojas.",
    prioridade: "baixa",
    loja: "Loja Sul",
  },
  {
    id: "ce12",
    tipo: "reconhecimento",
    titulo: "Redução impressionante de desperdício",
    descricao: "A taxa de desperdício desta loja caiu de 19% para 11% em 2 meses (-42% de redução), economizando aproximadamente €1.250. A equipe está implementando excelentes práticas de gestão. Recomenda-se reconhecimento formal e documentar o processo para replicar em outras unidades.",
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
      <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-6xl">
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Conselhos Estratégicos</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
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
          <div className="space-y-3 md:space-y-4">
            {conselhosFiltrados.map((conselho) => {
              const Icon = iconMap[conselho.tipo];
              
              return (
                <Card key={conselho.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3 md:pb-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="p-2 md:p-3 rounded-lg bg-primary/10 flex-shrink-0">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-2">
                          <CardTitle className="text-base md:text-lg flex-1">{conselho.titulo}</CardTitle>
                          <Badge className={`${prioridadeColor[conselho.prioridade]} shrink-0 text-xs`}>
                            {conselho.prioridade === "alta" && "Alta"}
                            {conselho.prioridade === "media" && "Média"}
                            {conselho.prioridade === "baixa" && "Baixa"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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
