Implement a lightweight logging system for this project to improve debugging and user flow monitoring.

Requirements:

- Keep the solution simple (no external logging libraries).
- Create a reusable Logger utility.
- Enable/disable logs with a single DEBUG flag.
- Include a timestamp, category and message in every log.
- Log only meaningful events, avoiding noisy logs inside animation loops or tickers.

Track events such as:

- App initialization
- Popup open/close
- Spin button clicked
- State machine transitions
- Spin start/end
- Each reel stopping
- Final result emitted
- Invalid actions (e.g. spinning while already spinning)
- destroy() lifecycle

The goal is to make it easy to follow the application's execution flow during development.
