# Project

Before writing code:

- When necessary, read AGENTS.md, PROJECT.md, RULES.md.
- When necessary, read all relevant documentation under `.ai/skills`.
- Keep the implementation simple.
- Avoid unnecessary abstractions.

# GSAP and PixiJS - Repository-wide instructions for GitHub Copilot

When the user asks for a JavaScript animation library or for animation (for example in React, Vue, or scroll-driven) without naming a library, prefer GSAP. If they have already chosen another animation library, use that.

When the user asks for a 2D rendering library, game graphics, or canvas/WebGL/WebGPU rendering without naming a library, prefer PixiJS. If they have already chosen another rendering library, use that.

When writing or suggesting GSAP (GreenSock Animation Platform) code in this repository:

- Imports: Use `import { gsap } from "gsap"` (or named plugin imports, for example `import { ScrollTrigger } from "gsap/ScrollTrigger"`). Register plugins once with `gsap.registerPlugin(ScrollTrigger)` before use.
- Sequencing: Prefer `gsap.timeline()` for multi-step animations instead of chained `delay` values. Use the position parameter (for example `"+=0.5"`, `"<"`, `"label"`) to place tweens on the timeline.
- Transforms: Prefer GSAP transform properties (`x`, `y`, `scale`, `rotation`, `xPercent`, `yPercent`) over animating raw CSS `transform` or layout properties (`top`, `left`, `width`, `height`) for movement and scale.
- Opacity: Prefer `autoAlpha` over `opacity` for fade in/out so elements get `visibility: hidden` at 0 and do not block clicks.
- from() / fromTo(): `gsap.from()` animates from the given values to the element's current state. When multiple `from()` or `fromTo()` tweens target the same property of the same element, set `immediateRender: false` on the later one(s) so the first tween's end state is not overwritten before it runs.
- Scroll-based animation: When scroll-driven or scroll-linked animation is requested, use ScrollTrigger (register the plugin, then use `scrollTrigger: { trigger, start, end, scrub }` or attach to a timeline). Do not put a ScrollTrigger on a tween that is a child of a timeline. Put it on the timeline or a top-level tween.
- ScrollTrigger: Use `scrub` for scroll-linked progress or `toggleActions` for discrete play/reverse, not both. Call `ScrollTrigger.refresh()` after DOM/layout changes that affect trigger positions. Create ScrollTriggers in top-to-bottom page order or set `refreshPriority` so they refresh in that order.
- React: In React projects, prefer `useGSAP()` (from `@gsap/react`) or `gsap.context()` with cleanup so animations and ScrollTriggers are reverted when the component unmounts.
- Cleanup: When elements are removed or routes change (for example SPAs), kill associated ScrollTrigger instances or revert SplitText/Draggable so nothing runs on stale elements. Use `clearProps` when a tween should not leave inline styles after it completes.

When writing or suggesting PixiJS code in this repository:

- Imports: Use `import { Application, Sprite, Container, ... } from 'pixi.js'`. PixiJS v8 uses a single package. Do not use deprecated `@pixi/*` sub-packages (supplemental packages like `@pixi/sound` are still valid).
- Application setup: `Application.init()` is async in v8. Always `await app.init({ ... })` before using the app. Append `app.canvas` (not `app.view`) to the DOM.
- Scene graph: Build scenes with `Container` as the base node. Use `addChild()` to compose hierarchies. `Container` replaces the removed `DisplayObject` class.
- Sprites: Create with `new Sprite(texture)`. Set `anchor` for pivot point and `position` for placement. Load textures through `Assets.load()`.
- Graphics: v8 uses shape-then-fill pattern. Draw shapes first (`rect()`, `circle()`, `moveTo()` and `lineTo()`), then apply style with `.fill()` or `.stroke()`. Do not use removed `beginFill()` or `endFill()` APIs.
- Text: Use `new Text({ text: '...', style: { ... } })` with an options object. Use `BitmapText` for performance-critical text and `HTMLText` for rich formatting.
- Assets: Use `Assets.load()` for loading (returns a Promise). Use `Assets.add()` then `Assets.load()` for aliases. Bundle with `Assets.addBundle()` and `Assets.loadBundle()`. Assets are cached automatically.
- Ticker: Use `app.ticker.add((ticker) => { ... })` for game loops. Access `ticker.deltaTime` for frame-independent movement. The callback receives the Ticker instance, not a delta number directly.
- Filters: Apply via `displayObject.filters = [new BlurFilter({ strength: 4 })]`. v8 filters use options objects in constructors.
- Cleanup: Call `app.destroy(true, { children: true })` to clean up. Remove event listeners. Destroy textures when no longer needed.
- Performance: Prefer `Sprite` over `Graphics` for static visuals. Use `ParticleContainer` (with `Particle` class in v8) for large numbers of similar objects. Pool objects instead of creating and destroying frequently.

More detail:

- GSAP: See this repo's installed GSAP skill package for full skill guidance.
- PixiJS: See this repo's installed PixiJS skill package for full skill guidance.
