import { Application } from "pixi.js";
import { Logger } from "./monitoring/Logger";
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
const logger = new Logger("App");

function randomResult(): SpinResult {
  return Array.from(
    { length: REELS_COUNT },
    () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id,
  );
}

async function bootstrap() {
  logger.info("Initialization started");
  const app = new Application();
  await app.init({
    background: "#101014",
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  logger.info("PIXI application initialized", {
    width: app.screen.width,
    height: app.screen.height,
  });

  const root = document.getElementById("app");
  if (!root) throw new Error("Missing #app root element");
  root.appendChild(app.canvas);
  logger.info("Canvas attached to DOM");

  const popup = new Popup(app);
  app.stage.addChild(popup.view);
  logger.info("Popup created and attached to stage");

  const slotMachine = new SlotMachine(
    app,
    {
      reelsCount: REELS_COUNT,
      symbols: SYMBOLS,
      resultProvider: randomResult,
    },
    {
      onResult: (result) => logger.info("Result observed by app", { result }),
      onStateChange: (state) => logger.info("State observed by app", { state }),
    },
  );
  logger.info("SlotMachine instance created", {
    reelsCount: REELS_COUNT,
    symbolIds: SYMBOLS.map((symbol) => symbol.id),
  });

  popup.addContent(slotMachine.view);
  popup.show();
  logger.info("Popup content mounted and shown");
  logger.info("Initialization completed");

  window.addEventListener("beforeunload", () => {
    logger.info("Destroy lifecycle started");
    slotMachine.destroy();
    logger.info("SlotMachine destroyed");
    popup.destroy();
    logger.info("Popup destroyed");
    app.destroy(true, { children: true });
    logger.info("PIXI application destroyed");
    logger.info("Destroy lifecycle completed");
  });
}

void bootstrap();
