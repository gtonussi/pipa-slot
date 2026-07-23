# Rules

## Architecture

- Prefer composition.
- Keep components focused.
- Rendering must not decide business logic.

## Slot Machine

- Animation never decides the result.
- Result is always provided externally.
- State transitions happen only through the state machine.

## Pixi

- Reuse sprites.
- Use masking for reels.
- No object creation during animation.
- Implement destroy().

## GSAP

- All animations use timelines.
- Cleanup every timeline.

## TypeScript

- Strict mode.
- Avoid any.
