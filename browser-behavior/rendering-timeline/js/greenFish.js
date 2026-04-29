// we dont use .offsetLeft as startPoint because it makes the animation too fast
function moveWithSetTimeout(fishHTMLElement, startPoint) {
  let fishXPosition = startPoint + 1;
  if (fishXPosition > window.innerWidth) {
    fishXPosition = 0;
  }
  fishHTMLElement.style.left = fishXPosition + "px";

  setTimeout(() => moveWithSetTimeout(fishHTMLElement, fishXPosition), 0);
}

export function startGreenFish() {
  const greenFish = document.getElementById("green-fish");
  moveWithSetTimeout(greenFish, 0);
}
