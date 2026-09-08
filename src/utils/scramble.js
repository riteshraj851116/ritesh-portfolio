import { playScrambleTick } from "./audio";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01XYZ";

export const scrambleText = (element, finalWord, duration = 600) => {
  if (!element) return;
  let iteration = 0;
  const original = finalWord || element.innerText;
  const totalLength = original.length;
  const intervalTime = 25;
  const maxIterations = duration / intervalTime;

  clearInterval(element._scrambleTimer);

  element._scrambleTimer = setInterval(() => {
    element.innerText = original
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < (iteration / maxIterations) * totalLength) {
          return original[index];
        }
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join("");

    // Play cyber typewriter sound tick every 2 iterations
    if (iteration % 2 === 0) {
      playScrambleTick();
    }

    if (iteration >= maxIterations) {
      element.innerText = original;
      clearInterval(element._scrambleTimer);
    }
    iteration += 1;
  }, intervalTime);
};
