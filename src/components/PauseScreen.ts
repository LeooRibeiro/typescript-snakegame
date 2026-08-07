import { $ } from "../core/dom";

/** Overlay de pausa. */
export class PauseScreen {
  private readonly element = $<HTMLDivElement>("#pause");

  show(): void {
    this.element.classList.remove("hide");
  }

  hide(): void {
    this.element.classList.add("hide");
  }

  showOrHide(visible: boolean): void {
    this.element.classList.toggle("hide", !visible);
  }
}