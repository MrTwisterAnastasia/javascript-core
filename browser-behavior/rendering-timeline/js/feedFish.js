import { knowledgeSentences } from "./knowledgeSentences.js";

let knowledgeIndex = 0;
let isFeeding = false;
let feedTextEl;

function appendNextSentence() {
  // iterations are still going and knowledgeSentences is ended, we just start once more from the beginning
  if (knowledgeIndex >= knowledgeSentences.length) {
    knowledgeIndex = 0;
  }

  const p = document.createElement("p");
  p.textContent = knowledgeSentences[knowledgeIndex];
  feedTextEl.appendChild(p);
  knowledgeIndex++;
}

function startFeed() {
  if (isFeeding) {
    return false;
  }
  isFeeding = true;
  knowledgeIndex = 0;
  feedTextEl.innerHTML = "";
  feedTextEl.style.display = "block";
  return true;
}

function runFeedLoop(scheduler) {
  if (!startFeed()) {
    return;
  }
  const totalIterations = 1500 * knowledgeSentences.length;
  let iteration = 0;

  function step() {
    if (!isFeeding || iteration >= totalIterations) {
      isFeeding = false;
      return;
    }

    appendNextSentence();

    iteration++;
    scheduler(step);
  }

  scheduler(step);
}

const feedFish = () => runFeedLoop(requestAnimationFrame);
const feedFishWithMicrotasks = () => runFeedLoop(queueMicrotask);

function feedFishWithLoop() {
  if (!startFeed()) {
    return;
  }
  const totalIterations = 1500 * knowledgeSentences.length;

  for (let i = 0; i < totalIterations && isFeeding; i++) {
    appendNextSentence();
  }
  isFeeding = false;
}

function stopFeeding() {
  isFeeding = false;
  feedTextEl.innerHTML = "";
  feedTextEl.style.display = "none";
}

export function setupFeedingControls() {
  feedTextEl = document.querySelector(".feed-text");
  document
    .querySelector(".feed-fish-btn")
    .addEventListener("click", () => requestAnimationFrame(feedFish));
  document
    .querySelector(".feed-fish-loop-btn")
    .addEventListener("click", feedFishWithLoop);
  document
    .querySelector(".feed-fish-microtask-btn")
    .addEventListener("click", feedFishWithMicrotasks);
  document
    .querySelector(".stop-feed-btn")
    .addEventListener("click", stopFeeding);
}
