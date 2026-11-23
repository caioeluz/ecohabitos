// Modelo de dados: descreve o formato de cada hábito sustentável registrado.
export interface Habito {
  id: number;
  nome: string;
  categoria: Categoria;
  co2: number;                 // estimativa de CO₂ evitado (em kg) quando o hábito é feito
  concluido: boolean;
  dataConclusao: string | null; // data em texto (ISO) de quando foi concluído; null se pendente
}

export type Categoria = 'Transporte' | 'Água' | 'Energia' | 'Lixo' | 'Alimentação';

// Valores aproximados de CO₂ evitado por categoria (kg).
// São estimativas simples, só para dar uma noção de impacto — não são medições exatas.
export const CO2_POR_CATEGORIA: Record<Categoria, number> = {
  'Transporte': 2.0,
  'Água': 0.3,
  'Energia': 0.8,
  'Lixo': 0.5,
  'Alimentação': 1.2,
};

export const CATEGORIAS = Object.keys(CO2_POR_CATEGORIA) as Categoria[];
