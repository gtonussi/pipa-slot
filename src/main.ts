import { Application } from "pixi.js";
import { Popup } from "./popup/Popup";
import { SlotMachine } from "./slot/SlotMachine";
import type { SpinResult, SymbolDefinition } from "./types/slot.types";

const SYMBOLS: SymbolDefinition[] = [
  { id: "cherry", color: 0xff4d4d, label: "Cherry" },
  { id: "lemon", color: 0xffe14d, label: "Lemon" },
  { id: "bell", color: 0x4dff88, label: "Bell" },
  { id: "star", color: 0x4d9fff, label: "Star" },
  { id: "seven", color: 0xd44dff, label: "Seven" },
];

const REELS_COUNT = 3;

function randomResult(): SpinResult {
  return Array.from(
    { length: REELS_COUNT },
    () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id,
  );
}

async function bootstrap() {
  const app = new Application();
  await app.init({
    background: "#101014",
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  const root = document.getElementById("app");
  if (!root) throw new Error("Missing #app root element");
  root.appendChild(app.canvas);

  const popup = new Popup(app);
  app.stage.addChild(popup.view);

  const slotMachine = new SlotMachine(
    app,
    {
      reelsCount: REELS_COUNT,
      symbols: SYMBOLS,
      resultProvider: randomResult,
    },
    {
      onResult: (result) => console.log("Spin result:", result),
      onStateChange: (state) => console.log("State:", state),
    },
  );

  popup.addContent(slotMachine.view);
  popup.show();

  window.addEventListener("beforeunload", () => {
    slotMachine.destroy();
    popup.destroy();
    app.destroy(true, { children: true });
  });
}

void bootstrap();
