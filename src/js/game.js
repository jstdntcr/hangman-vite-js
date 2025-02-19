import { WORDS, KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");

const createPlaceHolderHTML = () => {
  const word = sessionStorage.getItem("word");

  const wordArray = Array.from(word);
  const placeholdersHTML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
    ""
  );

  return `<div id="placeholder" class="placeholders-wrapper">${placeholdersHTML}</div>`;
};

const createKeyboard = () => {
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  keyboard.id = "keyboard";

  const keyboardHTML = KEYBOARD_LETTERS.reduce(
    (acc, curr) =>
      acc +
      `<button id="${curr}" class="button-primary keyboard-button">${curr.toUpperCase()}</button>`,
    ""
  );
  keyboard.innerHTML = keyboardHTML;

  return keyboard;
};

const createHangmanImg = () => {
  const image = document.createElement("img");
  image.alt = "hangman image";
  image.src = "images/hg-10.png";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

export const startGame = () => {
  const logoH1 = document.getElementById("logo");
  logoH1.classList.add("logo-sm");

  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);

  gameDiv.innerHTML = createPlaceHolderHTML();

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (event) => {
    console.log(event.target.id);
  });

  gameDiv.innerHTML += `<p id="tries" class="font-medium mt-2">TRIES LEFT: <span id="tries_left" class="font-medium text-red-600">10</span></p>`;

  gameDiv.appendChild(keyboardDiv);

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);
};
