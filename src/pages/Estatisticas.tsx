import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Estatistica } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { ArrowUpDown, TrendingUp } from "lucide-react";
import { get_data_estatisticas } from "@/services/mockStatisticsData";
import { getLojas, getEstadisticas, Loja } from "@/services/backendService";
import { getHistoricoConsumo, HistoricoConsumo } from "@/services/mockConsumptionData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrdenacaoCampo = "percentualVendas" | "percentualEspaco" | "eficiencia";

export default function Estatisticas() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "estrategico";
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [lojaSeleccionada, setLojaSeleccionada] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [usandoMock, setUsandoMock] = useState(false);
  const [ordenacao, setOrdenacao] = useState<{
    campo: OrdenacaoCampo;
    desc: boolean;
  }>({ campo: "percentualVendas", desc: true });
  const [historicoConsumo, setHistoricoConsumo] = useState<HistoricoConsumo[]>([]);

  useEffect(() => {
    carregarLojas();
    carregarHistorico();
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
    setUsandoMock(true);
    carregarDadosMock();
    setIsLoading(false);
    const response = await getEstadisticas(lojaSeleccionada);

    if (response.sucesso && response.dados) {
      // Convertir datos del backend a formato Estatistica
      const estatisticasConvertidas: Estatistica[] = response.dados.estadisticas.map((e) => ({
        id: `${e.id_producto}`,
        nomeProduto: e.nombre,
        categoria: "General",
        percentualVendas: e["rotacion_%"],
        percentualEspaco: e["uso_espacio_%"],
        eficiencia: e["eficacia_%"] / 100, // Convertir a decimal
      }));

      setEstatisticas(estatisticasConvertidas);
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
    const response = await get_data_estatisticas();

    if (response.sucesso && response.dados) {
      setEstatisticas(response.dados);
      setErro(null);
    } else {
      setErro(response.erro || "Erro ao carregar dados");
    }

    setIsLoading(false);
  };

  const carregarHistorico = async () => {
    try {
      const dados = await getHistoricoConsumo();
      setHistoricoConsumo(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  const handleLojaChange = (value: string) => {
    setLojaSeleccionada(parseInt(value));
  };

  const ordenar = (campo: OrdenacaoCampo) => {
    const desc = ordenacao.campo === campo ? !ordenacao.desc : true;
    setOrdenacao({ campo, desc });

    const ordenados = [...estatisticas].sort((a, b) => {
      const valorA = a[campo];
      const valorB = b[campo];
      return desc ? valorB - valorA : valorA - valorB;
    });

    setEstatisticas(ordenados);
  };

  return (
    <Layout
      stores={lojas.map(l => ({ value: l.id.toString(), label: l.nombre }))}
      selectedStore={lojaSeleccionada?.toString()}
      onStoreChange={handleLojaChange}
      showMockBadge={usandoMock}
      currentView={view}
    >
      <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 max-w-6xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
          Estatísticas
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
          Análise de vendas, ocupação de espaço e consumo em tempo real
        </p>

        {erro && <ErrorMessage message={erro} />}

        <Tabs defaultValue="eficiencia" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
            <TabsTrigger value="eficiencia" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Eficiência de Espaço</span>
              <span className="sm:hidden">Eficiência</span>
            </TabsTrigger>
            <TabsTrigger value="consumo" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">Histórico de Consumo</span>
              <span className="sm:hidden">Consumo</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="eficiencia">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-semibold text-foreground">Produto</th>
                        <th className="text-right p-4">
                          <button
                            onClick={() => ordenar("percentualVendas")}
                            className="flex items-center gap-2 ml-auto hover:text-secondary transition-colors font-semibold"
                          >
                            Vendas %
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="text-right p-4">
                          <button
                            onClick={() => ordenar("percentualEspaco")}
                            className="flex items-center gap-2 ml-auto hover:text-secondary transition-colors font-semibold"
                          >
                            Espaço %
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                        <th className="text-right p-4">
                          <button
                            onClick={() => ordenar("eficiencia")}
                            className="flex items-center gap-2 ml-auto hover:text-secondary transition-colors font-semibold"
                          >
                            Eficiência
                            <ArrowUpDown className="w-4 h-4" />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {estatisticas.map((stat) => (
                        <tr key={stat.id} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium text-foreground">{stat.nomeProduto}</td>
                          <td className="p-4 text-right font-medium">{stat.percentualVendas.toFixed(1)}%</td>
                          <td className="p-4 text-right font-medium">{stat.percentualEspaco.toFixed(1)}%</td>
                          <td className="p-4 text-right">
                            <span
                              className={
                                stat.eficiencia >= 1.2
                                  ? "text-success font-bold"
                                  : stat.eficiencia < 0.8
                                    ? "text-danger font-bold"
                                    : "font-medium"
                              }
                            >
                              {stat.eficiencia.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="consumo">
            <div className="grid gap-4">
              {historicoConsumo.map((item) => {
                const maxCantidad = Math.max(...item.datos.map(d => d.cantidad));
                const minCantidad = Math.min(...item.datos.map(d => d.cantidad));
                const promedio = Math.round(
                  item.datos.reduce((sum, d) => sum + d.cantidad, 0) / item.datos.length
                );
                const ultimoValor = item.datos[item.datos.length - 1].cantidad;
                const tendencia = ultimoValor > promedio ? "up" : "down";

                return (
                  <Card key={item.producto}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{item.producto}</CardTitle>
                        <div className="flex items-center gap-2">
                          <TrendingUp 
                            className={`h-4 w-4 ${
                              tendencia === "up" ? "text-green-500" : "text-red-500 rotate-180"
                            }`} 
                          />
                          <span className="text-sm font-medium">
                            Média: {promedio} unidades/dia
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Últimos 30 dias</span>
                          <span>Máx: {maxCantidad} | Mín: {minCantidad}</span>
                        </div>
                        <div className="flex items-end gap-1 h-32">
                          {item.datos.map((dato, idx) => {
                            const height = (dato.cantidad / maxCantidad) * 100;
                            const isRecent = idx >= item.datos.length - 7;
                            
                            return (
                              <div
                                key={idx}
                                className="flex-1 group relative"
                              >
                                <div
                                  className={`w-full rounded-t transition-all ${
                                    isRecent 
                                      ? "bg-primary hover:bg-primary/80" 
                                      : "bg-primary/40 hover:bg-primary/60"
                                  }`}
                                  style={{ height: `${height}%` }}
                                />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg border z-10">
                                  {new Date(dato.fecha).toLocaleDateString("pt-BR", { 
                                    day: "2-digit", 
                                    month: "2-digit" 
                                  })}
                                  <br />
                                  {dato.cantidad} unidades
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
