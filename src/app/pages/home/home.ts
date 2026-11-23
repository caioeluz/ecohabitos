import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HabitoService } from '../../habito.service';
import { HabitoItem } from '../../habito-item/habito-item';
import { CATEGORIAS, Categoria } from '../../habito.model';

// Tela principal: formulário para adicionar + lista de hábitos.
@Component({
  selector: 'app-home',
  imports: [FormsModule, HabitoItem],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Pegamos o service (que guarda a lista) por injeção de dependência.
  servico = inject(HabitoService);

  categorias = CATEGORIAS;

  // Campos do formulário, ligados com [(ngModel)] no HTML.
  nome = '';
  categoria: Categoria = 'Transporte';

  adicionar(): void {
    if (!this.nome.trim()) return; // não deixa criar hábito sem nome
    this.servico.adicionar(this.nome, this.categoria);
    this.nome = ''; // limpa o campo depois de adicionar
  }
}
