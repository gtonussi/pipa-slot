import { Application, Graphics, RenderTexture, Texture } from "pixi.js";
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
    const graphic = new Graphics().rect(0, 0, size, size).fill(symbol.color);
    const renderTexture = RenderTexture.create({ width: size, height: size });
    app.renderer.render({ container: graphic, target: renderTexture });
    graphic.destroy();
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
