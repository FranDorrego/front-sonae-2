import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AjudaEstrategicaChat from "@/components/AjudaEstrategicaChat";
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
    titulo: "Muitas tarefas pendentes acumuladas",
    descricao: "Se você tem muitas tarefas pendentes, avalie contratar mais colaboradores e/ou conversar com o gerente para entender se há sobrecarga na equipe. A eficiência operacional pode estar comprometida.",
    prioridade: "alta",
    loja: "Loja Centro",
  },
  {
    id: "ce2",
    tipo: "manutencao",
    titulo: "Equipamentos com problemas recorrentes",
    descricao: "Você tem muitos equipamentos quebrados ou desgastados com notificações de problemas frequentes. Analise conversar com a equipe de manutenção para ver o que está acontecendo nesta loja e se é necessário um plano de substituição.",
    prioridade: "alta",
    loja: "Loja Sul",
  },
  {
    id: "ce3",
    tipo: "vendas",
    titulo: "Declínio nas vendas sem precedente",
    descricao: "As vendas estão caindo sem uma lógica aparente. Converse com o gerente para entender o que está acontecendo e por que as vendas estão em queda. Pode haver problemas operacionais, de atendimento ou com a concorrência local.",
    prioridade: "alta",
    loja: "Loja Norte",
  },
  {
    id: "ce4",
    tipo: "inventario",
    titulo: "Falta frequente de frutas e verduras",
    descricao: "Acontece muito de faltar frutas e/ou verduras porque não há stock suficiente de reserva. Analise os envios de maçã para esta loja que está ficando sem durante vários dias consecutivos. Pode ser necessário ajustar a frequência de pedidos.",
    prioridade: "alta",
    loja: "Loja Centro",
  },
  {
    id: "ce5",
    tipo: "inventario",
    titulo: "Excesso de desperdício detectado",
    descricao: "Esta loja está com alto índice de desperdício de produtos perecíveis. Revise os processos de rotação de estoque e a quantidade de pedidos. Converse com o gerente sobre as práticas de armazenamento e validade.",
    prioridade: "media",
    loja: "Loja Norte",
  },
  {
    id: "ce6",
    tipo: "operacional",
    titulo: "Horários de pico mal distribuídos",
    descricao: "Durante o horário das 14h às 16h você tem menor movimento do que das 18h às 20h. Pode analisar dar um reforço nas horas de pico ou modificar o horário dos colaboradores para que os descansos sejam melhor organizados.",
    prioridade: "media",
    loja: "Loja Sul",
  },
  {
    id: "ce7",
    tipo: "operacional",
    titulo: "Abertura da loja com atrasos",
    descricao: "A loja está abrindo com atraso nos últimos dias. Verifique com o gerente se há problemas de transporte dos colaboradores ou se o horário de entrada precisa ser ajustado para garantir a abertura no horário correto.",
    prioridade: "media",
    loja: "Loja Centro",
  },
  {
    id: "ce8",
    tipo: "manutencao",
    titulo: "Equipamentos próximos ao fim da vida útil",
    descricao: "Alguns equipamentos essenciais estão próximos ou já ultrapassaram a vida útil recomendada. Antes que ocorram falhas críticas, prepare um orçamento para substituição gradual nos próximos meses.",
    prioridade: "media",
    loja: "Loja Sul",
  },
  {
    id: "ce9",
    tipo: "vendas",
    titulo: "Oportunidade: Produtos sazonais",
    descricao: "A temporada de verão se aproxima. Histórico mostra aumento significativo nas vendas de frutas tropicais e melancia. Negocie com fornecedores antecipadamente e prepare o espaço de exposição para aproveitar a sazonalidade.",
    prioridade: "baixa",
    loja: "Loja Norte",
  },
  {
    id: "ce10",
    tipo: "recursos-humanos",
    titulo: "Novos colaboradores precisam de treinamento",
    descricao: "Você contratou novos colaboradores recentemente e a taxa de erros operacionais aumentou. Organize uma sessão de treinamento intensivo sobre procedimentos, qualidade e atendimento ao cliente para padronizar as operações.",
    prioridade: "media",
    loja: "Loja Centro",
  },
  {
    id: "ce11",
    tipo: "reconhecimento",
    titulo: "Métricas excelentes - Parabenize a equipe!",
    descricao: "Esta loja está com métricas muito boas durante as últimas semanas. Você pode dar um reconhecimento para animar os colaboradores pela organização e eficiência. Considere compartilhar as boas práticas com outras lojas.",
    prioridade: "baixa",
    loja: "Loja Sul",
  },
  {
    id: "ce12",
    tipo: "reconhecimento",
    titulo: "Redução impressionante de desperdício",
    descricao: "A equipe desta loja conseguiu reduzir significativamente o desperdício nos últimos meses. Parabenize a equipe e documente as práticas que estão funcionando para replicar em outras unidades.",
    prioridade: "baixa",
    loja: "Loja Centro",
  },
  {
    id: "ce13",
    tipo: "recursos-humanos",
    titulo: "Alta rotatividade de colaboradores",
    descricao: "Esta loja tem apresentado alta rotatividade de funcionários. Converse com o gerente para entender se há problemas de ambiente de trabalho, salários ou gestão que precisam ser endereçados.",
    prioridade: "alta",
    loja: "Loja Norte",
  },
  {
    id: "ce14",
    tipo: "vendas",
    titulo: "Produtos com baixo giro precisam de ação",
    descricao: "Alguns produtos ocupam espaço valioso mas têm baixíssimo giro de vendas. Avalie com o gerente se vale manter esses itens ou substituir por produtos de maior demanda para otimizar o espaço e aumentar o faturamento.",
    prioridade: "media",
    loja: "Loja Sul",
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Conselhos Estratégicos</h1>
            </div>
            <AjudaEstrategicaChat />
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
