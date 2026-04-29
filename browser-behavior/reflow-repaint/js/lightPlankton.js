const GLOW_COLORS = ["#7df9ff", "#39ff14", "#80ffea", "#a0f0ff", "#5be7a9"];
let logEl;
let oceanEl;

function logResult(label, durationMs) {
  logEl.style.display = "block";
  const p = document.createElement("p");
  p.innerHTML = `<strong>${label}:</strong> ${durationMs.toFixed(2)} ms`;
  logEl.appendChild(p);
}

function measure(label, operation) {
  const start = performance.now();
  operation();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      logResult(label, performance.now() - start);
    });
  });
}

function resetPlankton() {
  oceanEl.classList.remove("lit");
  document.querySelectorAll(".plankton").forEach((p) => {
    p.style.background = "";
    p.style.boxShadow = "";
  });
}

function lightUpDirect() {
  resetPlankton();
  measure("Direct loop (1000 inline writes)", () => {
    const plankton = document.querySelectorAll(".plankton");
    for (let i = 0; i < plankton.length; i++) {
      const color = GLOW_COLORS[i % GLOW_COLORS.length];
      plankton[i].style.background = color;
      plankton[i].style.boxShadow = `0 0 6px 2px ${color}`;
    }
  });
}

function lightUpBatched() {
  resetPlankton();
  measure("Batched (single class swap)", () => {
    oceanEl.classList.add("lit");
  });
}

function clearLog() {
  resetPlankton();
  logEl.innerHTML = "";
  logEl.style.display = "none";
}

export function setupLightingControls() {
  oceanEl = document.querySelector(".ocean");
  logEl = document.querySelector(".performance-log");
  document
    .querySelector(".light-direct-btn")
    .addEventListener("click", lightUpDirect);
  document
    .querySelector(".light-batched-btn")
    .addEventListener("click", lightUpBatched);
  document.querySelector(".reset-btn").addEventListener("click", clearLog);
}
