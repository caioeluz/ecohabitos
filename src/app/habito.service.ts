import { Injectable, computed, signal } from '@angular/core';
import { CO2_POR_CATEGORIA, Categoria, Habito } from './habito.model';

// Chaves usadas no localStorage do navegador.
const CHAVE_HABITOS = 'ecohabitos.lista';
const CHAVE_META = 'ecohabitos.meta';

@Injectable({ providedIn: 'root' })
export class HabitoService {
  // A lista fica guardada aqui, no service, para que todas as telas usem os mesmos dados.
  // Quando o service é criado, já começa com o que estava salvo no navegador.
  readonly habitos = signal<Habito[]>(this.carregar());

  // Meta semanal de CO₂ evitado (kg). Também é persistida.
  readonly metaSemanal = signal<number>(this.carregarMeta());

  // ---- Valores calculados (recalculam sozinhos quando a lista muda) ----

  // Total de CO₂ evitado em toda a história (só hábitos concluídos).
  readonly co2Total = computed(() =>
    this.habitos().filter(h => h.concluido).reduce((soma, h) => soma + h.co2, 0)
  );

  // CO₂ evitado nos últimos 7 dias: base do diferencial criativo (meta semanal).
  readonly co2Semana = computed(() => {
    const limite = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return this.habitos()
      .filter(h => h.concluido && h.dataConclusao && new Date(h.dataConclusao).getTime() >= limite)
      .reduce((soma, h) => soma + h.co2, 0);
  });

  // Percentual da meta já atingido (limitado a 100 para a barra de progresso).
  readonly progressoMeta = computed(() => {
    const meta = this.metaSemanal();
    if (meta <= 0) return 0;
    return Math.min(100, Math.round((this.co2Semana() / meta) * 100));
  });

  // ---- Ações da lista ----

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
    this.salvar(); // cada mudança na lista é gravada na hora
  }

  alternarConcluido(id: number): void {
    this.habitos.update(lista =>
      lista.map(h =>
        h.id === id
          ? {
              ...h,
              concluido: !h.concluido,
              // ao concluir guardamos a data; ao desmarcar, limpamos
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

  // ---- Persistência ----

  // SALVAR: pega a lista atual, transforma em texto JSON (localStorage só guarda texto)
  // e grava no navegador usando a chave CHAVE_HABITOS.
  private salvar(): void {
    localStorage.setItem(CHAVE_HABITOS, JSON.stringify(this.habitos()));
  }

  // CARREGAR: roda quando o service é criado (ao abrir a página). Lê o texto salvo,
  // converte de volta para objetos com JSON.parse e devolve a lista.
  // Se não tem nada salvo (primeiro acesso) ou o texto está quebrado, começa com lista vazia.
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
    return texto && !isNaN(numero) && numero > 0 ? numero : 10; // padrão: 10 kg por semana
  }
}
