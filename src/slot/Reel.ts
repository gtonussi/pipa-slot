import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { buildReelStrip, REEL_FILLER_COUNT } from "./reelMapping";

export interface ReelOptions {
  /** Ordered pool of symbol ids; order defines which symbols are "adjacent" on the strip. */
  symbolIds: string[];
  textures: Map<string, Texture>;
  symbolSize: number;
  visibleSymbols: number;
}

export interface ReelSpinOptions {
  targetSymbolId: string;
  duration: number;
  delayBeforeStart?: number;
}

/**
 * A single reel: a masked, fixed-size pool of sprites that is reused across every spin
 * (textures are reassigned, sprites are never recreated). Scrolling is driven by GSAP
 * tweening a proxy value through accel -> constant -> decel phases.
 */
export class Reel {
  readonly view: Container;
  private readonly track: Container;
  private readonly mask: Graphics;
  private readonly sprites: Sprite[] = [];
  private readonly symbolSize: number;
  private readonly visibleSymbols: number;
  private readonly symbolIds: string[];
  private readonly textures: Map<string, Texture>;
  private readonly stripLength: number;
  private timeline: gsap.core.Timeline | null = null;

  constructor(options: ReelOptions) {
    this.symbolSize = options.symbolSize;
    this.visibleSymbols = options.visibleSymbols;
    this.symbolIds = options.symbolIds;
    this.textures = options.textures;
    this.stripLength = REEL_FILLER_COUNT + this.visibleSymbols;

    this.view = new Container();
    this.track = new Container();

    for (let i = 0; i < this.stripLength; i++) {
      const sprite = new Sprite();
      sprite.y = i * this.symbolSize;
      this.track.addChild(sprite);
      this.sprites.push(sprite);
    }

    this.mask = new Graphics()
      .rect(0, 0, this.symbolSize, this.symbolSize * this.visibleSymbols)
      .fill(0xffffff);

    this.view.addChild(this.track, this.mask);
    this.view.mask = this.mask;

    this.renderIdle(this.symbolIds[0]);
  }

  /** Shows the given symbol (and its deterministic neighbors) without animating. */
  renderIdle(targetSymbolId: string): void {
    this.applyTextures(this.buildStrip(targetSymbolId));
    this.track.y = 0;
  }

  /** Animates the reel so it lands exactly on `targetSymbolId`. Resolves when settled. */
  spinTo({
    targetSymbolId,
    duration,
    delayBeforeStart = 0,
  }: ReelSpinOptions): Promise<void> {
    this.killTimeline();
    this.applyTextures(this.buildStrip(targetSymbolId));
    this.track.y = 0;

    const distance = (this.stripLength - this.visibleSymbols) * this.symbolSize;
    const accelDuration = duration * 0.2;
    const constDuration = duration * 0.5;
    const decelDuration = duration - accelDuration - constDuration;
    const accelDistance = distance * 0.25;
    const constDistance = distance * 0.5;

    return new Promise((resolve) => {
      const proxy = { y: 0 };
      const applyY = () => {
        this.track.y = -proxy.y;
      };

      const tl = gsap.timeline({
        delay: delayBeforeStart,
        onComplete: () => {
          this.track.y = -distance;
          resolve();
        },
      });
      tl.to(proxy, {
        y: accelDistance,
        duration: accelDuration,
        ease: "power2.in",
        onUpdate: applyY,
      });
      tl.to(proxy, {
        y: accelDistance + constDistance,
        duration: constDuration,
        ease: "none",
        onUpdate: applyY,
      });
      tl.to(proxy, {
        y: distance,
        duration: decelDuration,
        ease: "power2.out",
        onUpdate: applyY,
      });

      this.timeline = tl;
    });
  }

  destroy(): void {
    this.killTimeline();
    this.view.mask = null;
    this.mask.destroy();
    this.sprites.forEach((sprite) => sprite.destroy());
    this.track.destroy({ children: true });
    this.view.destroy({ children: true });
  }

  private killTimeline(): void {
    this.timeline?.kill();
    this.timeline = null;
  }

  private idAt(index: number): string {
    const length = this.symbolIds.length;
    return this.symbolIds[((index % length) + length) % length];
  }

  /** Builds a deterministic strip ending on `targetSymbolId` at the reel's result row. */
  private buildStrip(targetSymbolId: string): string[] {
    return buildReelStrip(this.symbolIds, targetSymbolId, this.visibleSymbols);
  }

  private applyTextures(strip: string[]): void {
    strip.forEach((id, index) => {
      this.sprites[index].texture = this.textures.get(id) ?? Texture.WHITE;
    });
  }
}
