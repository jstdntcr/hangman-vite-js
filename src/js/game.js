import { WORDS, KEYBOARD_LETTERS } from "./consts";

const gameDiv = document.getElementById("game");
const logoH1 = document.getElementById("logo");

let triesLeft = null;
let winCount = null;

const createPlaceHolderHTML = () => {
  const word = sessionStorage.getItem("word");

  const wordArray = Array.from(word);
  const placeholdersHTML = wordArray.reduce(
    (acc, curr, i) => acc + `<h1 id="letter_${i}" class="letter">_</h1>`,
    ""
  );

  return `<div id="placeholders" class="placeholders-wrapper">${placeholdersHTML}</div>`;
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
  image.src = "images/hg-0.png";
  image.classList.add("hangman-img");
  image.id = "hangman-img";

  return image;
};

const checkLetter = (letter) => {
  const word = sessionStorage.getItem("word");
  const inputLetter = letter.toLowerCase();

  if (!word.includes(inputLetter)) {
    const triesCounter = document.getElementById("tries_left");
    triesLeft -= 1;
    if (triesLeft === 0) stopGame("lose");
    triesCounter.innerText = triesLeft;

    const hangmanImg = document.getElementById("hangman-img");
    hangmanImg.src = `images/hg-${10 - triesLeft}.png`;
  } else {
    let wordArray = Array.from(word);

    wordArray.forEach((currentLetter, index) => {
      if (currentLetter === inputLetter) {
        const placeholder = document.getElementById(`letter_${index}`);
        placeholder.innerText = inputLetter.toUpperCase();
        winCount += 1;
        if (winCount == word.length) stopGame("win");
      }
    });
  }
};

export const startGame = () => {
  winCount = 0;
  triesLeft = 10;
  logoH1.classList.add("logo-sm");

  const randomIndex = Math.floor(Math.random() * WORDS.length);
  const wordToGuess = WORDS[randomIndex];
  sessionStorage.setItem("word", wordToGuess);

  gameDiv.innerHTML = createPlaceHolderHTML();

  const keyboardDiv = createKeyboard();
  keyboardDiv.addEventListener("click", (event) => {
    if (event.target.tagName.toLowerCase() === "button") {
      event.target.disabled = true;
      checkLetter(event.target.id);
    }
  });

  gameDiv.innerHTML += `<p id="tries" class="font-medium mt-2">TRIES LEFT: <span id="tries_left" class="font-medium text-red-600">10</span></p>`;

  gameDiv.appendChild(keyboardDiv);

  const hangmanImg = createHangmanImg();
  gameDiv.prepend(hangmanImg);

  gameDiv.insertAdjacentHTML("beforeend", `<button id="quit" class="button-secondary px-2 py-1 mt-4">Quit</button>`);
  document.getElementById("quit").onclick = () => {
    if (confirm("Are you sure you want to quit and lost progress?")) stopGame("quit");
  }
};

const stopGame = (status) => {
  document.getElementById("placeholders").remove();
  document.getElementById("tries").remove();
  document.getElementById("keyboard").remove();
  document.getElementById("quit").remove();

  const word = sessionStorage.getItem("word");

  if (status === "win") {
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById("game").innerHTML += `<h2 class="result-header win">You won!</h2>`;
  } else if (status === "lose")
    document.getElementById("game").innerHTML += `<h2 class="result-header lose">You lost :(</h2>`;
  else if (status === "quit"){
    logoH1.classList.remove("logo-sm");
    document.getElementById("hangman-img").remove();
  }

  document.getElementById("game").innerHTML += `<p>The word was: <span class="result-word">${word}</span></p>
  <button id="play-again" class="button-primary px-5 py-2 mt-5">Play again</button>`

  document.getElementById("play-again").onclick = startGame;
};