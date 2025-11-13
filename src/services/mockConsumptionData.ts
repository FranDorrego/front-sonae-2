export interface DadoConsumo {
  fecha: string;
  cantidad: number;
}

export interface HistoricoConsumo {
  producto: string;
  datos: DadoConsumo[];
}

const generateHistorico = (producto: string, baseValue: number): HistoricoConsumo => {
  const datos: DadoConsumo[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic variations
    const variation = (Math.random() - 0.5) * 0.3 * baseValue;
    const cantidad = Math.max(0, Math.round(baseValue + variation));
    
    datos.push({
      fecha: date.toISOString().split('T')[0],
      cantidad
    });
  }
  
  return {
    producto,
    datos
  };
};

export const getHistoricoConsumo = (): Promise<HistoricoConsumo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        generateHistorico("Tomates", 120),
        generateHistorico("Alfaces", 85),
        generateHistorico("Maçãs", 150),
        generateHistorico("Bananas", 200),
        generateHistorico("Cenouras", 95),
        generateHistorico("Pimentos", 70),
      ]);
    }, 500);
  });
};
