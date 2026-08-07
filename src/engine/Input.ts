import type { Direction } from "../core/config";
import { keyToDirection } from "../core/utils";

/**
 * Camada de entrada: captura teclas de direção e mantém um buffer de
 * comandos pendentes para viradas rápidas (input buffer).
 */
export class Input {
  /** Tamanho máximo do buffer — evita aplicação atrasada em excesso. */
  private static readonly MAX_BUFFER = 3;

  private readonly pending: Direction[] = [];

  constructor() {
    window.addEventListener("keydown", (event) => this.onKeyDown(event));
  }

  /** Retorna o próximo comando do buffer e o remove. */
  shift(): Direction | undefined {
    return this.pending.shift();
  }

  get isEmpty(): boolean {
    return this.pending.length === 0;
  }

  private onKeyDown(event: KeyboardEvent): void {
    const direction = keyToDirection(event.key);
    if (!direction) return;
    event.preventDefault();

    const last = this.pending[this.pending.length - 1];
    if (last === direction) return;
    if (this.pending.length >= Input.MAX_BUFFER) this.pending.shift();

    this.pending.push(direction);
  }
}