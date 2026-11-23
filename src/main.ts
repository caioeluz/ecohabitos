import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Ponto de entrada: inicia o componente raiz com as configurações (rotas) do appConfig.
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
