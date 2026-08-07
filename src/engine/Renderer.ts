import { CANVAS_SIZE, GRID_SIZE, SNAKE_COLORS } from "../core/config";
import type { Point } from "../core/config";

export interface FoodView {
  x: number;
  y: number;
  color: string;
}

/**
 * Camada de renderização: isola todo o desenho no canvas dos
 * objetos do domínio e do restante da aplicação.
 */
export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  drawGrid(): void {
    const ctx = this.ctx;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#1f1f24";

    for (let i = GRID_SIZE; i < CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }
  }

  drawFood(food: FoodView): void {
    const ctx = this.ctx;
    const px = food.x * GRID_SIZE;
    const py = food.y * GRID_SIZE;

    ctx.shadowColor = food.color;
    ctx.shadowBlur = 14;
    ctx.fillStyle = food.color;
    ctx.fillRect(px + 2, py + 2, GRID_SIZE - 4, GRID_SIZE - 4);
    ctx.shadowBlur = 0;
  }

  drawSnake(snake: readonly Point[]): void {
    const ctx = this.ctx;
    const cells = snake.length;

    snake.forEach((segment, index) => {
      const px = segment.x * GRID_SIZE;
      const py = segment.y * GRID_SIZE;
      const isHead = index === cells - 1;
      const t = index / Math.max(cells - 1, 1);

      ctx.fillStyle = isHead
        ? SNAKE_COLORS.head
        : SNAKE_COLORS.gradient(t);
      ctx.fillRect(px + 1, py + 1, GRID_SIZE - 2, GRID_SIZE - 2);

      if (isHead) {
        // olhos
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(px + 7, py + 7, 5, 5);
        ctx.fillRect(px + GRID_SIZE - 12, py + 7, 5, 5);
      }
    });
  }

  applyBlur(blur: boolean): void {
    this.canvas.style.filter = blur ? "blur(3px)" : "none";
  }
}