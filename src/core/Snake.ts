import type { Point } from "./config";

/**
 * Cobra como entidade do domínio: mantém a lista de segmentos e as regras
 * de movimento/colisão. A cabeça é sempre o último segmento.
 */
export class Snake {
  private readonly segments: Point[];

  private constructor(initial: Point[]) {
    this.segments = initial;
  }

  /** Cria uma cobra de 2 segmentos centrada e apontando para a direita. */
  static create(cellCount: number): Snake {
    const mid = Math.floor(cellCount / 2);
    return new Snake([
      { x: mid - 1, y: mid },
      { x: mid, y: mid },
    ]);
  }

  get head(): Point {
    return this.segments[this.segments.length - 1]!;
  }

get body(): readonly Point[] {
    return this.segments;
  }

  /**
   * Move a cabeça para a coordenada informada.
   *
   * Se `growing` for true, o corpo cresce (não remove a cauda) e a cauda
   * continua ocupada; caso contrário (cobra viva) a cauda se move junto e a
   * posição atual da cauda deixa de ser colisão.
   *
   * @returns `false` se a nova cabeça colidir com o próprio corpo.
   */
  step(x: number, y: number, growing: boolean): boolean {
    const start = growing ? 0 : 1; // quando não cresce, remove a cauda do cheque
    const body = this.segments.slice(start, this.segments.length - 1);
    const selfHit = body.some((segment) => segment.x === x && segment.y === y);
    if (selfHit) return false;

    this.segments.push({ x, y });
    if (!growing) this.segments.shift();
    return true;
  }
}