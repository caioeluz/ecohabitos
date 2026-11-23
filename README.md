# EcoHábitos

Aplicação web em Angular para registrar hábitos sustentáveis do dia a dia e acompanhar
quanto CO₂ eles ajudam a evitar (ODS 12 e 13).

## Como executar

```bash
npm install
ng serve
```

Abra http://localhost:4200. Para gerar a versão final: `ng build`.

## Requisitos atendidos

- Lista com `@for`: `src/app/pages/home/home.html`
- Adicionar, concluir e remover: formulário com `[(ngModel)]` + eventos
- Componente próprio com `input()` e `output()`: `src/app/habito-item/`
- Service com a lista e a persistência: `src/app/habito.service.ts`
- Persistência com `localStorage`
- Segunda tela com `provideRouter` e `routerLink`: `/impacto`
- Diferencial criativo: cálculo de CO₂ evitado, meta semanal e dica do dia
