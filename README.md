# SnakeGame · Remasterizado

Jogo da cobrinha reescrito do zero em **TypeScript** com **Vite**.

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

Checagem de tipos:

```bash
npm run typecheck
```

## Melhorias em relação à versão original (JavaScript)

- **TypeScript estrito** com tipagem completa e checagem no build.
- **Vite** como bundler e dev server com HMR.
- Loop baseado em **requestAnimationFrame** com avanço por tempo (delta),
  em vez de `setTimeout` fixo — velocidade consistente entre máquinas.
- **Fila de comandos** para viradas rápidas (input buffer) e proteção
  contra inversão de 180°.
- **Níveis / velocidade progressiva**: a cada alimento a velocidade aumenta.
- **Recorde** salvo no `localStorage`.
- **Pausa** com a barra de espaço.
- **Overlays** de game over, pausa e tela inicial.
- **Renderização** com gradiente na cobra, olhos, brilho na comida e grid.
- Código modular: `Game`, `Food`, `Renderer`, `Input`, `config`, `utils`.

## Controles

- **Setas** ou **WASD** para mover
- **Espaço** para pausar / continuar
- **Clique no botão** para começar / reiniciar

## Estrutura

A arquitetura está organizada em camadas com responsabilidades bem definidas:

```
src/
├── main.ts              # bootstrap + ligação entre jogo e UI (composição)
├── style.css            # estilos remasterizados
│
├── core/                # domínio puro (sem DOM ou canvas)
│   ├── config.ts        # constantes e tipos do domínio
│   ├── utils.ts         # funções puras (aleatórias, direções, formatação)
│   ├── dom.ts           # helper $ de seleção do DOM
│   ├── Snake.ts         # entidade Cobra (segmentos, passo, colisão)
│   └── Food.ts          # entidade Comida (posição e respawn em célula livre)
│
├── engine/              # infraestrutura técnica reutilizável
│   ├── Renderer.ts      # desenho no canvas (grid, cobra, comida, blur)
│   └── Input.ts         # captura de teclado + buffer de direções
│
├── game/                # orquestração
│   └── Game.ts          # estado, loop rAF, colisões, pontuação e recorde
│
└── components/          # UI desacoplada do jogo
    ├── Hud.ts           # placar (score, recorde, nível)
    ├── GameOverlay.ts   # menu inicial e tela de game over
    └── PauseScreen.ts   # overlay de pausa
```

### Fluxo

1. `main.ts` instancia os componentes de UI e o `Game` (inversão de dependência).
2. O `Game` coordena o domínio (`Snake`, `Food`) com a engine (`Renderer`, `Input`).
3. Alterações de estado emitem callbacks que atualizam apenas os componentes de UI.
