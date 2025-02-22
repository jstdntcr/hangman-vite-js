export const darkModeHandle = () => {
  const darkModeSwitcher = document.getElementById("toggleDarkMode");
  const htmlElement = document.documentElement;

  if (localStorage.getItem("mode") == "dark") {
    htmlElement.classList.add("dark");
    darkModeSwitcher.checked = true;
  }

  darkModeSwitcher.addEventListener("input", () => {
    htmlElement.classList.toggle("dark");

    if (htmlElement.classList.contains("dark"))
      localStorage.setItem("mode", "dark");
    else localStorage.setItem("mode", "light");
  });
};

export const winstreakHandle = () =>{
  const currentStreak = sessionStorage.getItem("currentStreak");
  let winstreak = localStorage.getItem("winstreak");
  const winstreakHTML = document.getElementById("winstreak-counter");
  const winstreakImage = document.getElementById("streak-image");

  if (winstreak === null || winstreak === "0"){
    winstreakImage.classList.add("unactive-winstreak");
    localStorage.setItem("winstreak", 0);
    winstreak = "0";
  } else {
    if (winstreak > currentStreak) winstreakImage.classList.add("unactive-winstreak");
    else if (winstreakImage.classList.contains("unactive-winstreak")) winstreakImage.classList.remove("unactive-winstreak");
  }

  if (currentStreak === null || currentStreak === "0") sessionStorage.setItem("currentStreak", 0);
  else sessionStorage.setItem("currentStreak", currentStreak);

  winstreakHTML.innerText = winstreak;
}
