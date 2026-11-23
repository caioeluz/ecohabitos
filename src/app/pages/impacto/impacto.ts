import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HabitoService } from '../../habito.service';
import { CATEGORIAS } from '../../habito.model';

// Dicas para a "dica do dia". Uma é escolhida de acordo com o dia do ano,
// então a dica muda todo dia, mas fica igual durante o mesmo dia.
const DICAS = [
  'Desligue aparelhos da tomada quando não estiver usando.',
  'Banhos de 5 minutos economizam muitos litros de água por semana.',
  'Leve sua própria garrafa e evite copos descartáveis.',
  'Separe o lixo reciclável do orgânico antes de descartar.',
  'Prefira ir a pé, de bicicleta ou de carona em trajetos curtos.',
  'Planeje as refeições para não desperdiçar comida.',
  'Doe ou troque roupas e objetos que você não usa mais.',
];

// Segunda tela (rota /impacto): mostra a meta semanal, o impacto por categoria e a dica do dia.
@Component({
  selector: 'app-impacto',
  imports: [FormsModule],
  templateUrl: './impacto.html',
  styleUrl: './impacto.css',
})
export class Impacto {
  servico = inject(HabitoService);

  // Dica do dia: usa o número do dia atual para escolher uma posição da lista.
  dicaDoDia = DICAS[Math.floor(Date.now() / 86_400_000) % DICAS.length];

  // Soma de CO₂ de cada categoria (só dos concluídos). Recalcula quando a lista muda.
  porCategoria = computed(() =>
    CATEGORIAS.map(cat => ({
      nome: cat,
      co2: this.servico
        .habitos()
        .filter(h => h.concluido && h.categoria === cat)
        .reduce((soma, h) => soma + h.co2, 0),
    }))
  );

  // Maior valor entre as categorias, usado para calcular a largura das barras.
  maximo = computed(() => Math.max(1, ...this.porCategoria().map(c => c.co2)));

  // Chamado quando o usuário altera o campo da meta.
  alterarMeta(valor: number): void {
    if (valor > 0) this.servico.definirMeta(valor);
  }
}
