import "../css/style.css";
import { darkModeHandle, winstreakHandle } from "./utils";
import { startGame } from "./game";

winstreakHandle();
darkModeHandle();

const startGameButton = document.getElementById("startGame");
startGameButton.addEventListener("click", startGame);
