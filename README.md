# 🐍 SnakeGame · Remasterizado

## instalação do projeto:

```bash
npm install
npm run dev
```

## 📃 Relatório do projeto:

Remasterização completa do clássico **Jogo da Cobrinha** com **TypeScript**, **Vite** (bundler e dev server com HMR). O projeto evoluiu de
um único arquivo `script.js` vanilla para uma **arquitetura em camadas**, modular
e tipada em modo estrito.

### Versão original (v1.0.0)

O jogo original era 100% vanilla JavaScript, em um único arquivo:

- `index.html` + `css/style.css` + `script/script.js`.
- Loop por `setTimeout(300)` fixo.
- Estado, renderização, input e lógica tudo no mesmo arquivo.
- Variáveis globais e funções soltas, sem tipos.
- Sem áudio, sem pausa, sem níveis, sem recorde.

### Novidades / Features da v2.0.0

1. **Migração para TypeScript estrito** — tipagem completa (`Direction`,
   `Point`, `Status`), checagem de tipos no build.
2. **Vite** — bundler com HMR e `base: './'` (funciona em subdiretórios).
3. **Loop por `requestAnimationFrame` com delta-time** — no lugar do
   `setTimeout` fixo; velocidade consistente entre máquinas.
4. **Fila de comandos (input buffer)** — viradas rápidas com proteção contra
   reversão de 180° (bug corrigido: buffer limitado e uma entrada por passo).
5. **Níveis / velocidade progressiva** — a cada alimento a velocidade aumenta.
6. **Recorde persistente** — salvo em `localStorage` (`snake-best-score`).
7. **Pausa** — tecla `Espaço`.
8. **Controles estendidos** — **Setas** ou **WASD**.
9. **Overlays** — tela inicial, game over e pausa.
10. **Visual remasterizado** — gradiente na cobra, olhos, brilho na comida com
    cores aleatórias, grid e filtro de blur nos overlays.
11. **Efeito sonoro ao comer** — módulo de áudio com `assets/assets_audio.mp3`
    e destrave para contornar a política de autoplay.
12. **HUD completa** — Score, Recorde e Nível/Velocidade.

### Correções relevantes

- **Bug de input (reversão de 180°)** — sequências como `W→D→S` faziam a cobra
  colidir com o próprio corpo; resolvido consumindo uma tecla por tick e
  limitando o buffer (`MAX_BUFFER = 3`).
- **Assets unificados** — mantida apenas a pasta-fonte `assets/` na raiz;
  `dist/assets/` é a saída gerada automaticamente pelo build.

## 🏛️ Estrutura

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
│   ├── Input.ts         # captura de teclado + buffer de direções
│   └── Audio.ts         # efeitos sonoros (play ao comer)
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
