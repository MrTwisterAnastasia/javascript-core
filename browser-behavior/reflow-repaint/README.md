# Plankton

1000 plankton drift in the dark. Click *Light up* and they glow.

Two ways to make them glow:
- Direct loop — JavaScript writes inline background and box-shadow on each of the 1000 plankton, one by one;
- Batched class — JavaScript adds one lit class to the ocean. CSS does the rest;

Both produce the same visual. The timer above the ocean tells you which path was cheaper.

## Observations

When I first load the page and click *Light up* once for each path, batched class is cheaper every time. That matches what the reflow/repaint anti-pattern guides say: batching the writes means one reflow instead of a thousand, so on a clean run the difference is real and easy to see.

Once I clicked both buttons a few times and I pressed *Reset* in between — the numbers stop being consistent. Sometimes direct loop reads as faster, sometimes batched class does. I think there's something deeper going on inside the browser once these code paths have already been hit once. So I'm trusting the first click on a fresh page over anything after it.
