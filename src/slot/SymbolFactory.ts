import {
  Application,
  Container,
  Graphics,
  RenderTexture,
  Text,
  Texture,
} from "pixi.js";
import type { SymbolDefinition } from "../types/slot.types";

/**
 * Generates one reusable placeholder texture per symbol (colored rectangle).
 * Textures are created once and shared by every sprite/reel, and released via destroy().
 */
export class SymbolFactory {
  private readonly textures = new Map<string, Texture>();

  constructor(app: Application, symbols: SymbolDefinition[], size: number) {
    symbols.forEach((symbol) => {
      this.textures.set(symbol.id, this.createTexture(app, symbol, size));
    });
  }

  private createTexture(
    app: Application,
    symbol: SymbolDefinition,
    size: number,
  ): Texture {
    const container = new Container();
    const cell = new Graphics()
      .rect(0, 0, size, size)
      .fill(0xf7f4eb)
      .stroke({ color: 0xdfd7c3, width: 1 });
    container.addChild(cell);

    const symbolText = new Text({
      text: iconForSymbol(symbol),
      style: {
        fill: symbol.color,
        fontSize: Math.round(size * 0.5),
        fontWeight: "900",
      },
    });
    symbolText.anchor.set(0.5);
    symbolText.position.set(size / 2, size / 2);
    container.addChild(symbolText);

    const renderTexture = RenderTexture.create({ width: size, height: size });
    app.renderer.render({ container, target: renderTexture });
    container.destroy({ children: true });
    return renderTexture;
  }

  get(id: string): Texture | undefined {
    return this.textures.get(id);
  }

  getAll(): Map<string, Texture> {
    return this.textures;
  }

  destroy(): void {
    this.textures.forEach((texture) => texture.destroy(true));
    this.textures.clear();
  }
}

function iconForSymbol(symbol: SymbolDefinition): string {
  if (symbol.id === "seven") return "7";
  if (symbol.id === "star") return "*";
  if (symbol.id === "bell") return "U";
  if (symbol.id === "cherry") return "OO";
  if (symbol.id === "lemon") return "D";
  return (
    symbol.label?.slice(0, 3).toUpperCase() ??
    symbol.id.slice(0, 3).toUpperCase()
  );
}
