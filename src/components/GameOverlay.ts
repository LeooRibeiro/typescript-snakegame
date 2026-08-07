import type { Status } from "../core/config";
import { $ } from "../core/dom";

/**
 * Overlay principal: menu de início e tela de game over,
 * consumido a partir dos callbacks de estado do jogo.
 */
export class GameOverlay {
  private readonly element = $<HTMLDivElement>("#menu");
  private readonly title = $<HTMLSpanElement>("#menuTitle");
  private readonly finalScore = $<HTMLSpanElement>("#final-score");
  private readonly finalBest = $<HTMLSpanElement>("#final-best");
  private readonly playBtn = $<HTMLButtonElement>("#btn-play");

  constructor(onPlay: () => void) {
    this.playBtn.addEventListener("click", onPlay);
  }

  render(status: Status, scoreText: string, bestText: string): void {
    this.element.classList.remove("hide");

    if (status === "over") {
      this.title.textContent = "game over";
      this.finalScore.textContent = scoreText;
      this.finalBest.textContent = bestText;
    } else {
      // idle
      this.title.textContent = "snake game";
      this.finalScore.textContent = "00";
      this.finalBest.textContent = bestText;
    }
  }

  hide(): void {
    this.element.classList.add("hide");
  }
}