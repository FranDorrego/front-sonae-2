import { useState, useEffect } from "react";
import { Estatistica } from "@/types";
import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { ArrowUpDown } from "lucide-react";
import { get_data_estatisticas } from "@/services/mockStatisticsData";

type OrdenacaoCampo = "percentualVendas" | "percentualEspaco" | "eficiencia";

export default function Estatisticas() {
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [ordenacao, setOrdenacao] = useState<{
    campo: OrdenacaoCampo;
    desc: boolean;
  }>({ campo: "percentualVendas", desc: true });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
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
    <Layout>
      <div className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Estatísticas
        </h1>

        {erro && <ErrorMessage message={erro} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-3 font-semibold">Produto</th>
                  <th className="text-left p-3 font-semibold">Categoria</th>
                  <th className="text-right p-3">
                    <button
                      onClick={() => ordenar("percentualVendas")}
                      className="flex items-center gap-2 ml-auto hover:text-secondary"
                    >
                      Vendas %
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right p-3">
                    <button
                      onClick={() => ordenar("percentualEspaco")}
                      className="flex items-center gap-2 ml-auto hover:text-secondary"
                    >
                      Espaço %
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right p-3">
                    <button
                      onClick={() => ordenar("eficiencia")}
                      className="flex items-center gap-2 ml-auto hover:text-secondary"
                    >
                      Eficiência
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {estatisticas.map((stat) => (
                  <tr key={stat.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3 font-medium">{stat.nomeProduto}</td>
                    <td className="p-3 text-muted-foreground">{stat.categoria}</td>
                    <td className="p-3 text-right">{stat.percentualVendas.toFixed(1)}%</td>
                    <td className="p-3 text-right">{stat.percentualEspaco.toFixed(1)}%</td>
                    <td className="p-3 text-right">
                      <span
                        className={
                          stat.eficiencia >= 1.2
                            ? "text-success font-semibold"
                            : stat.eficiencia < 0.8
                            ? "text-danger font-semibold"
                            : ""
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
        )}
      </div>
    </Layout>
  );
}
