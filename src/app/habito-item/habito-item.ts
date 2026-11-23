import { Component, input, output } from '@angular/core';
import { Habito } from '../habito.model';

// Componente próprio: mostra UM hábito na lista.
// Ele não mexe nos dados: recebe o hábito de fora (input) e avisa o pai (output) quando
// o usuário clica em concluir ou remover. Quem realmente altera a lista é o pai/service.
@Component({
  selector: 'app-habito-item',
  template: `
    <li [class.feito]="habito().concluido">
      <button class="check" (click)="concluir.emit(habito().id)"
              [attr.aria-label]="habito().concluido ? 'Desmarcar hábito' : 'Concluir hábito'">
        {{ habito().concluido ? '✔' : '○' }}
      </button>
      <div class="info">
        <strong>{{ habito().nome }}</strong>
        <small>{{ habito().categoria }} · {{ habito().co2 }} kg CO₂</small>
      </div>
      <button class="remover" (click)="remover.emit(habito().id)" aria-label="Remover hábito">✕</button>
    </li>
  `,
  styles: `
    li { display: flex; align-items: center; gap: 12px; background: #fff;
         border: 1px solid var(--borda); border-radius: 10px; padding: 10px 12px; list-style: none; }
    .info { flex: 1; display: flex; flex-direction: column; }
    small { color: var(--cinza); }
    .check { background: var(--verde-claro); color: var(--verde); font-size: 1.1rem; }
    .remover { background: transparent; color: #b23b3b; }
    .feito .info strong { text-decoration: line-through; color: var(--cinza); }
    .feito .check { background: var(--verde); color: #fff; }
  `,
})
export class HabitoItem {
  // Dado que chega do componente pai.
  habito = input.required<Habito>();

  // Eventos que o componente manda de volta para o pai (levam o id do hábito).
  concluir = output<number>();
  remover = output<number>();
}
