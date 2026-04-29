const channel = new MessageChannel();
const queueTask = (fn) => {
  channel.port1.onmessage = fn;
  channel.port2.postMessage(null);
};

let isBlueFishMoving = false;

// we dont use .offsetLeft as startPoint because it makes the animation too fast
function moveWithQueueTask(fishHTMLElement, startPoint) {
  if (!isBlueFishMoving) {
    return;
  }

  let fishXPosition = startPoint + 1;
  if (fishXPosition > window.innerWidth) {
    fishXPosition = 0;
  }

  fishHTMLElement.style.left = fishXPosition + "px";
  queueTask(() => moveWithQueueTask(fishHTMLElement, fishXPosition));
}

function startBlueFish() {
  if (isBlueFishMoving) {
    return;
  }
  isBlueFishMoving = true;
  const blueFish = document.getElementById("blue-fish");
  queueTask(() => moveWithQueueTask(blueFish, 0));
}

function stopBlueFish() {
  isBlueFishMoving = false;
}

export function setupBlueFishControls() {
  document
    .querySelector(".start-blue-fish-btn")
    .addEventListener("click", startBlueFish);
  document
    .querySelector(".stop-blue-fish-btn")
    .addEventListener("click", stopBlueFish);
}
