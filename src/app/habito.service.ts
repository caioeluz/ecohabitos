import { Injectable, computed, signal } from '@angular/core';
import { CO2_POR_CATEGORIA, Categoria, Habito } from './habito.model';

// NOs nomes usados para identificar os dados gaurdados no navegador
const CHAVE_HABITOS = 'ecohabitos.lista';
const CHAVE_META = 'ecohabitos.meta';

@Injectable({ providedIn: 'root' })
export class HabitoService {
  // Aqui guarda os hábitoss pra que todas as telas usem a mesma lista
  // AQuando inicia o serviço, recupera os dados que ja foram salvos no navegador
  readonly habitos = signal<Habito[]>(this.carregar());

   // Define a meta semanal de CO₂ que deseja evitar em quilogramas
  readonly metaSemanal = signal<number>(this.carregarMeta());

  // Calcula os valores automaticamente sempre que os dados usados mudam
  // Soma a quantidade de CO₂ evitada pelos habitos que já foram concluido
  readonly co2Total = computed(() =>
    this.habitos().filter(h => h.concluido).reduce((soma, h) => soma + h.co2, 0)
  );

  // Calcula o CO₂ evitdeixado de lado pelos hábitos concluidos nos últimos s7 dias
  readonly co2Semana = computed(() => {
    const limite = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return this.habitos()
      .filter(h => h.concluido && h.dataConclusao && new Date(h.dataConclusao).getTime() >= limite)
      .reduce((soma, h) => soma + h.co2, 0);
  });

  // Calcula quanto da meta semanal já foi alcançada, com limite de 100%
  readonly progressoMeta = computed(() => {
    const meta = this.metaSemanal();
    if (meta <= 0) return 0;
    return Math.min(100, Math.round((this.co2Semana() / meta) * 100));
  });

   // Métodos com função de adicionar, concluir e excluir hábitos

  adicionar(nome: string, categoria: Categoria): void {
    const novo: Habito = {
      id: Date.now(),
      nome: nome.trim(),
      categoria,
      co2: CO2_POR_CATEGORIA[categoria],
      concluido: false,
      dataConclusao: null,
    };
    this.habitos.update(lista => [...lista, novo]);
    this.salvar(); // Salvar a lista atualizada depois de adicionar um novo hábito
  }

  alternarConcluido(id: number): void {
    this.habitos.update(lista =>
      lista.map(h =>
        h.id === id
          ? {
              ...h,
              concluido: !h.concluido,
               // Registra a data da conclusão ou a remove caso o habito seja desmarcado
              dataConclusao: !h.concluido ? new Date().toISOString() : null,
            }
          : h
      )
    );
    this.salvar();
  }

  remover(id: number): void {
    this.habitos.update(lista => lista.filter(h => h.id !== id));
    this.salvar();
  }

  definirMeta(valor: number): void {
    this.metaSemanal.set(valor);
    localStorage.setItem(CHAVE_META, String(valor));
  }

  // Métodos ussados para salvar e recuperar os dados do navegador

  // Transforma.  a lista de hábitos para JSON e guarda o resultado no localStorage
  // A chave CHAVE_HABITOS permite localizar esses dados mais tarde
  private salvar(): void {
    localStorage.setItem(CHAVE_HABITOS, JSON.stringify(this.habitos()));
  }

  // Recuperar a lista salva e converter o JSON de  novo em objetos
  // Se não tiver dados guardados ou ocorrer um erro na leitura
  // retorna uma lista  vazia para permitir que o serviço continue funcionandoo-
  private carregar(): Habito[] {
    try {
      const texto = localStorage.getItem(CHAVE_HABITOS);
      return texto ? (JSON.parse(texto) as Habito[]) : [];
    } catch {
      return [];
    }
  }

  private carregarMeta(): number {
    const texto = localStorage.getItem(CHAVE_META);
    const numero = Number(texto);
    return texto && !isNaN(numero) && numero > 0 ? numero : 10; // Utiliza 10 kg como a meta semanal inicial
  }
}