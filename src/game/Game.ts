import {
  BEST_SCORE_KEY,
  CELLS,
  MIN_TICK,
  POINTS_PER_FOOD,
  STARTING_TICK,
  TICK_STEP,
} from "../core/config";
import type { Direction, Status } from "../core/config";
import { Food } from "../core/Food";
import { Snake } from "../core/Snake";
import { OPPOSITE, VECTORS } from "../core/utils";
import { Renderer } from "../engine/Renderer";
import { Input } from "../engine/Input";
import { AudioPlayer } from "../engine/Audio";

export interface GameCallbacks {
  onScore(score: number): void;
  onBest(best: number): void;
  onLevel(level: number): void;
  onStatus(status: Status): void;
}

/**
 * Orquestrador do jogo: combina o domínio (`Snake`, `Food`) com a
 * engine (`Renderer`, `Input`) e conduz o loop de simulação.
 */
export class Game {
  private readonly renderer: Renderer;
  private readonly input = new Input();
  private readonly audio = new AudioPlayer();
  private readonly callbacks: Partial<GameCallbacks> = {};

  private snake = Snake.create(CELLS);
  private food: Food;
  private status: Status = "idle";
  private direction: Direction = "right";

  private score = 0;
  private level = 1;
  private best: number;

  private tick = STARTING_TICK;
  private accumulated = 0;
  private lastTime = 0;
  private rafId = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.best = this.loadBest();
    this.food = new Food(() => this.snake.body);
    this.render();
  }

  setCallbacks(callbacks: Partial<GameCallbacks>): void {
    Object.assign(this.callbacks, callbacks);
    this.callbacks.onBest?.(this.best);
  }

  start(): void {
    if (this.status === "running") return;

    this.resetWorld();
    this.setStatus("running");
    this.audio.unlock();
    this.callbacks.onScore?.(0);
    this.callbacks.onLevel?.(this.level);
    this.renderer.applyBlur(false);

    if (!this.rafId) this.loop(performance.now());
  }

  togglePause(): void {
    if (this.status === "running") {
      this.setStatus("paused");
    } else if (this.status === "paused") {
      this.setStatus("running");
      if (!this.rafId) this.loop(performance.now());
    }
  }

  getStatus(): Status {
    return this.status;
  }

  get bestScore(): number {
    return this.best;
  }

  private resetWorld(): void {
    this.snake = Snake.create(CELLS);
    this.score = 0;
    this.level = 1;
    this.tick = STARTING_TICK;
    this.accumulated = 0;
    this.lastTime = 0;
    if (this.rafId) this.stopLoop();
    this.food = new Food(() => this.snake.body);
  }

  private setStatus(status: Status): void {
    this.status = status;
    this.callbacks.onStatus?.(status);
  }

  // ---------- simulação ----------

  private step(): void {
    const direction = this.resolveDirection();
    const head = this.snake.head;
    const vector = VECTORS[direction];
    const next: { x: number; y: number } = {
      x: head.x + vector.x,
      y: head.y + vector.y,
    };

    // colisão com parede
    if (next.x < 0 || next.x >= CELLS || next.y < 0 || next.y >= CELLS) {
      this.gameOver();
      return;
    }

    const eats = this.food.isAt(next.x, next.y);

    if (eats) {
      this.snake.step(next.x, next.y, true);
      this.audio.playEat();
      this.score += POINTS_PER_FOOD;
      this.level += 1;
      this.tick = Math.max(this.tick - TICK_STEP, MIN_TICK);
      this.food.respawn();

      if (this.score > this.best) {
        this.best = this.score;
        this.saveBest();
      }

      this.callbacks.onScore?.(this.score);
      this.callbacks.onBest?.(this.best);
      this.callbacks.onLevel?.(this.level);
    } else {
      const moved = this.snake.step(next.x, next.y, false);
      if (!moved) {
        this.gameOver();
        return;
      }
    }

    this.render();
  }

  private resolveDirection(): Direction {
    const candidate = this.input.shift();
    if (candidate && candidate !== OPPOSITE[this.direction]) {
      this.direction = candidate;
    }
    return this.direction;
  }

  private gameOver(): void {
    this.stopLoop();
    this.setStatus("over");
    this.renderer.applyBlur(true);
  }

  private render(): void {
    this.renderer.clear();
    this.renderer.drawGrid();
    this.renderer.drawFood({ x: this.food.x, y: this.food.y, color: this.food.color });
    this.renderer.drawSnake(this.snake.body);
  }

  private loop = (time: number): void => {
    if (this.status !== "running") {
      this.rafId = 0;
      return;
    }

    const delta = Math.min(time - this.lastTime, this.tick * 2);
    this.lastTime = time;
    this.accumulated += delta;

    while (this.accumulated >= this.tick) {
      this.step();
      this.accumulated -= this.tick;
      if (this.status !== "running") {
        this.rafId = 0;
        return;
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  private stopLoop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.accumulated = 0;
  }

  // ---------- persistência ----------

  private loadBest(): number {
    const raw = Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? "0", 10);
    return Number.isFinite(raw) ? raw : 0;
  }

  private saveBest(): void {
    localStorage.setItem(BEST_SCORE_KEY, String(this.best));
  }
}