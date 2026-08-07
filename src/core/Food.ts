import { CELLS, foodColors } from "./config";
import { randomColor, randomInt } from "./utils";

/**
 * Comida do jogo, localizada em células do grid. Não contém lógica de
 * renderização — apenas posição, cor e respawn em célula livre.
 */
export class Food {
  constructor(
    private readonly occupied: () => readonly { x: number; y: number }[],
    public x = 0,
    public y = 0,
    public color = randomColor(foodColors),
  ) {
    this.respawn();
  }

  isAt(x: number, y: number): boolean {
    return this.x === x && this.y === y;
  }

  /** Reposiciona em uma célula livre aleatória, evitando o corpo da cobra. */
  respawn(): void {
    const occupied = this.occupied();
    const free: { x: number; y: number }[] = [];

    for (let y = 0; y < CELLS; y += 1) {
      for (let x = 0; x < CELLS; x += 1) {
        const taken = occupied.some(
          (segment) => segment.x === x && segment.y === y,
        );
        if (!taken) free.push({ x, y });
      }
    }

    if (free.length === 0) return; // tabuleiro cheio — sem espaço livre

    const pick = free[randomInt(0, free.length - 1)]!;
    this.x = pick.x;
    this.y = pick.y;
    this.color = randomColor(foodColors);
  }
}