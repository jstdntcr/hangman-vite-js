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

  return `<div id="placeholders" class="placeholders-wrapper pt-3">${placeholdersHTML}</div>`;
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
  if (document.getElementById("topic-name") != null) document.getElementById("topic-name").remove();
  winCount = 0;
  triesLeft = 10;
  logoH1.classList.add("logo-sm");

  const randomTopic = Math.floor(Math.random() * WORDS.length);
  const randomWord = Math.floor(Math.random() * WORDS[randomTopic].words.length);
  const wordToGuess = WORDS[randomTopic].words[randomWord];
  sessionStorage.setItem("word", wordToGuess);

  document.getElementById("logo").insertAdjacentHTML("afterend", `
      <h3 id="topic-name" class="font-medium pt-5">TOPIC: ${WORDS[randomTopic].name.toUpperCase()}</h3>
    `)

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
  let currentStreak = parseInt(sessionStorage.getItem("currentStreak"));
  let winstreak = parseInt(localStorage.getItem("winstreak"));
  const winstreakImage = document.getElementById("streak-image");

  if (status === "win") {
    document.getElementById("hangman-img").src = "images/hg-win.png";
    document.getElementById("game").innerHTML += `<h2 class="result-header win">You won!</h2>`;
    
    // update streak
    currentStreak += 1;
    sessionStorage.setItem("currentStreak", currentStreak);
    if (currentStreak > winstreak) {
      document.getElementById("winstreak-counter").innerText = currentStreak;
      localStorage.setItem("winstreak", currentStreak);
    }
  } else if (status === "lose"){

    document.getElementById("game").innerHTML += `<h2 class="result-header lose">You lost :(</h2>`;
    currentStreak = 0;
    sessionStorage.setItem("currentStreak", currentStreak);
  }
  else if (status === "quit"){
    currentStreak = 0;
    sessionStorage.setItem("currentStreak", currentStreak);
    logoH1.classList.remove("logo-sm");
    document.getElementById("hangman-img").remove();
  }

  if (winstreak > currentStreak) winstreakImage.classList.add("unactive-winstreak");
  else if (winstreakImage.classList.contains("unactive-winstreak")) winstreakImage.classList.remove("unactive-winstreak");

  document.getElementById("game").innerHTML += `<p>The word was: <span class="result-word">${word}</span></p>
  <button id="play-again" class="button-primary px-5 py-2 mt-5">Play again</button>`

  document.getElementById("play-again").onclick = startGame;
};