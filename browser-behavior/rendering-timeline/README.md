# Aquarium

A small demo of rendering heavy JS loops — the anti-patterns and the right way.

The fish are only here so you can see the difference. When a scheduler blocks the main thread, the fish freeze. When it doesn't, they keep swimming.

Honestly, one example would have been enough. But I watched a YouTube video about the event loop and the different ways to animate things, and I wanted to actually see each approach in action — so there are three swimming fishes)

The queueTask one (blue fish) runs so fast that it is not pleasent to watch, so it has its own Start and Stop buttons.

## Explain behavior

We have three buttons that start feeding the fish — feeding fish with knowledge means we add a new line of text to our page. All three buttons end up doing the same thing, but they show three different styles of how to add those lines.

**Feed (anti-pattern microtasks)** — this one adds each line as a microtask. We simulate huge amount of promises and every promise gives us just one line . The behavior shows that when the event loop is stuck with microtasks, the browser cannot go and render. So we do not see anything happening, and we cannot interact with the UI. All the fish are stuck, frozen and we cannot even interact with the Stop feeding button, because the browser does not reply. We have to wait until all the microtasks in the queue are done, and we cannot interrupt it even if you want to.

**Feed (anti-pattern while loop)** — this one represents another anti-pattern: a heavy JS loop. The main problem here is that when the JS call stack is doing one big task — like this big loop — the event loop cannot fit a browser render in between. Same issue as the first button: the stack is working only on this one big task, and everything else is frozen and cannot be interactive.

**Feed** — the third option is how I wanted to display the right way to handle big loops where we need to add lines of text. As we can see from the demo, the lines get added one by one. This is the option where we can actually watch the lines appear, and we can stop the feeding at any moment. All the buttons stay interactable, all the fishes keep swimming — no UI freeze here.
