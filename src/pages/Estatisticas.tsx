import { useState, useEffect } from "react";
import { Estatistica } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { ArrowUpDown } from "lucide-react";
import { get_data_estatisticas } from "@/services/mockStatisticsData";
import { getLojas, getEstadisticas, Loja } from "@/services/backendService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type OrdenacaoCampo = "percentualVendas" | "percentualEspaco" | "eficiencia";

export default function Estatisticas() {
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
      stores={lojas}
      selectedStore={lojaSeleccionada?.toString()}
      onStoreChange={handleLojaChange}
      showMockBadge={usandoMock}
    >
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Estatísticas
        </h1>
        <p className="text-muted-foreground mb-4">
          Análise de vendas e ocupação de espaço
        </p>


        {erro && <ErrorMessage message={erro} />}

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
      </div>
    </Layout>
  );
}
