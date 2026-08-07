export type Direction = "up" | "down" | "left" | "right";
export type Status = "idle" | "running" | "paused" | "over";

export interface Point {
  x: number;
  y: number;
}

export const GRID_SIZE = 30;
export const CANVAS_SIZE = 600;
export const CELLS = CANVAS_SIZE / GRID_SIZE; // 20 colunas e linhas

export const STARTING_TICK = 300; // ms por passo no início
export const MIN_TICK = 90; // menor intervalo (velocidade máxima)
export const TICK_STEP = 8; // redução de ms por alimento

export const POINTS_PER_FOOD = 10;
export const BEST_SCORE_KEY = "snake-best-score";

export const SNAKE_COLORS = {
  head: "#7cff6b",
  gradient: (t: number) =>
    `rgb(${Math.round(150 + t * 80)}, ${Math.round(210 - t * 60)}, 140)`,
} as const;

export const foodColors = [
  "#ff5252",
  "#ffd740",
  "#69f0ae",
  "#40c4ff",
  "#ff4081",
  "#b388ff",
] as const;