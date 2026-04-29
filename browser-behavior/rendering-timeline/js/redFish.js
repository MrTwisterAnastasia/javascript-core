// we dont use .offsetLeft as startPoint because it makes the animation too fast
function moveWithRequestAnimationFrame(fishHTMLElement, startPoint) {
  let fishXPosition = startPoint + 1;
  if (fishXPosition > window.innerWidth) {
    fishXPosition = 0;
  }
  fishHTMLElement.style.left = fishXPosition + "px";
  requestAnimationFrame(() =>
    moveWithRequestAnimationFrame(fishHTMLElement, fishXPosition),
  );
}

export function startRedFish() {
  const redFish = document.getElementById("red-fish");
  requestAnimationFrame(() => moveWithRequestAnimationFrame(redFish, 0));
}
