import eatSoundUrl from "../../assets/assets_audio.mp3";

/**
 * Camada de áudio: encapsula a reprodução de efeitos sonoros.
 * Usa os arquivos servidos pelo Vite (import como URL).
 */
export class AudioPlayer {
  private readonly eat = new Audio(eatSoundUrl);

  /** Destrava a reprodução no primeiro gesto de usuário (política de autoplay). */
  unlock(): void {
    this.eat.volume = 0;
    void this.eat.play().catch(() => {});
    this.eat.volume = 1;
  }

  /** Reproduz o efeito ao comer comida. */
  playEat(): void {
    this.eat.currentTime = 0;
    void this.eat.play();
  }
}