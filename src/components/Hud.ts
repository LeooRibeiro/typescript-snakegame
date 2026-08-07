import { formatScore } from "../core/utils";
import { $ } from "../core/dom";

/**
 * Componente de UI do placar (score, recorde e nível/velocidade).
 */
export class Hud {
  private readonly scoreEl = $<HTMLSpanElement>(".score--value");
  private readonly bestEl = $<HTMLSpanElement>(".best__value");
  private readonly levelEl = $<HTMLSpanElement>(".speed__value");

  setScore(value: number): void {
    this.scoreEl.textContent = formatScore(value);
  }

  setBest(value: number): void {
    this.bestEl.textContent = formatScore(value);
  }

  setLevel(value: number): void {
    this.levelEl.textContent = formatScore(value);
  }

  get scoreText(): string {
    return this.scoreEl.textContent ?? "00";
  }

  get bestText(): string {
    return this.bestEl.textContent ?? "00";
  }
}