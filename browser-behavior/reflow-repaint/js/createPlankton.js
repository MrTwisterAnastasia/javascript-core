// we use createDocumentFragment so we dont append elements one by one each time causing the reflows
export function createPlankton(count = 1000) {
  const ocean = document.querySelector(".ocean");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "plankton";
    dot.style.left = Math.random() * 100 + "%";
    dot.style.top = Math.random() * 100 + "%";
    fragment.appendChild(dot);
  }
  ocean.appendChild(fragment);
}
