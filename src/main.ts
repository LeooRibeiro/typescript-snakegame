import "./style.css";
import { Game } from "./game/Game";
import { Hud } from "./components/Hud";
import { GameOverlay } from "./components/GameOverlay";
import { PauseScreen } from "./components/PauseScreen";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;

const hud = new Hud();
const overlay = new GameOverlay(() => game.start());
const pause = new PauseScreen();
const game = new Game(canvas);

game.setCallbacks({
  onScore: (score) => hud.setScore(score),
  onBest: (best) => hud.setBest(best),
  onLevel: (level) => hud.setLevel(level),
  onStatus: (status) => {
    pause.showOrHide(status === "paused");

    if (status === "idle" || status === "over") {
      overlay.render(status, hud.scoreText, hud.bestText);
    } else {
      overlay.hide();
    }
  },
});

window.addEventListener("keydown", (event) => {
  if (event.code !== "Space") return;
  event.preventDefault();

  const status = game.getStatus();
  if (status === "running" || status === "paused") {
    game.togglePause();
  } else {
    game.start();
  }
});

game.start();