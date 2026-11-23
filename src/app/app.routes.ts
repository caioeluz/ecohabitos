import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Impacto } from './pages/impacto/impacto';

// Mapa de rotas: cada endereço da URL abre uma tela.
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'impacto', component: Impacto },
  { path: '**', redirectTo: '' }, // qualquer endereço desconhecido volta para a tela principal
];
