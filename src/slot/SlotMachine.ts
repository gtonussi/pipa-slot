import { Application, Container } from "pixi.js";
import { gsap } from "gsap";
import { Reel } from "./Reel";
import { SpinButton } from "./SpinButton";
import { SymbolFactory } from "./SymbolFactory";
import {
  SlotMachineStateMachine,
  type SlotMachineState,
} from "../state/SlotMachineStateMachine";
import type {
  SlotMachineConfig,
  SlotMachineEvents,
  SpinResult,
} from "../types/slot.types";

const DEFAULTS = {
  visibleSymbols: 3,
  symbolSize: 96,
  reelSpacing: 16,
  spinDuration: 1.6,
  reelStagger: 0.35,
  anticipationMultiplier: 1.8,
} as const;

type ResolvedConfig = SlotMachineConfig &
  Required<
    Omit<SlotMachineConfig, "symbols" | "reelsCount" | "resultProvider">
  >;

/**
 * Data-driven slot machine component. Reel count and symbol pool come entirely from `config`.
 * The result is always supplied externally via `spin(result)` — this class only animates it.
 */
export class SlotMachine {
  readonly view: Container;
  private readonly reels: Reel[] = [];
  private readonly symbolFactory: SymbolFactory;
  private readonly spinButton: SpinButton;
  private readonly stateMachine = new SlotMachineStateMachine();
  private readonly resultListeners = new Set<(result: SpinResult) => void>();
  private readonly config: ResolvedConfig;
  private readonly validSymbolIds: Set<string>;
  private pendingSettleDelay: gsap.core.Tween | null = null;

  constructor(
    app: Application,
    config: SlotMachineConfig,
    events: SlotMachineEvents = {},
  ) {
    this.config = { ...DEFAULTS, ...config };
    this.validSymbolIds = new Set(
      this.config.symbols.map((symbol) => symbol.id),
    );

    if (events.onResult) this.resultListeners.add(events.onResult);
    if (events.onStateChange) this.stateMachine.onChange(events.onStateChange);

    this.view = new Container();
    this.symbolFactory = new SymbolFactory(
      app,
      this.config.symbols,
      this.config.symbolSize,
    );

    const symbolIds = this.config.symbols.map((symbol) => symbol.id);
    const reelsContainer = new Container();

    for (let i = 0; i < this.config.reelsCount; i++) {
      const reel = new Reel({
        symbolIds,
        textures: this.symbolFactory.getAll(),
        symbolSize: this.config.symbolSize,
        visibleSymbols: this.config.visibleSymbols,
      });
      reel.view.x = i * (this.config.symbolSize + this.config.reelSpacing);
      reelsContainer.addChild(reel.view);
      this.reels.push(reel);
    }

    const reelsWidth =
      this.reels.length * this.config.symbolSize +
      (this.reels.length - 1) * this.config.reelSpacing;
    const reelsHeight = this.config.visibleSymbols * this.config.symbolSize;

    this.spinButton = new SpinButton(reelsWidth, 48, "GIRAR");
    this.spinButton.view.y = reelsHeight + 24;
    this.spinButton.onClick(() => this.handleSpinRequest());

    this.view.addChild(reelsContainer, this.spinButton.view);
  }

  getState(): SlotMachineState {
    return this.stateMachine.getState();
  }

  /** Subscribes to spin results; returns an unsubscribe function. */
  onResult(listener: (result: SpinResult) => void): () => void {
    this.resultListeners.add(listener);
    return () => this.resultListeners.delete(listener);
  }

  /**
   * Animates the reels to land exactly on `result`. The result must already be decided
   * externally — this method never chooses or alters it. No-ops if already spinning.
   */
  async spin(result: SpinResult): Promise<void> {
    if (result.length !== this.reels.length) {
      throw new Error(
        `Expected ${this.reels.length} symbols, received ${result.length}`,
      );
    }
    const invalid = result.find((id) => !this.validSymbolIds.has(id));
    if (invalid) {
      throw new Error(`Unknown symbol id in result: ${invalid}`);
    }
    if (!this.stateMachine.canSpin()) {
      return;
    }

    this.stateMachine.start();
    this.spinButton.setEnabled(false);

    const anticipation = this.isAnticipationResult(result);
    const lastIndex = this.reels.length - 1;

    const spinPromises = result.map((targetSymbolId, index) => {
      const isLastReel = index === lastIndex;
      const anticipationBonus =
        isLastReel && anticipation
          ? this.config.spinDuration * (this.config.anticipationMultiplier - 1)
          : 0;
      const duration =
        this.config.spinDuration +
        index * this.config.reelStagger +
        anticipationBonus;

      return this.reels[index].spinTo({ targetSymbolId, duration });
    });

    await Promise.all(spinPromises);

    this.stateMachine.settle();
    await this.wait(0.2);
    this.stateMachine.complete();

    this.spinButton.setEnabled(true);
    this.resultListeners.forEach((listener) => listener(result));
  }

  destroy(): void {
    this.pendingSettleDelay?.kill();
    this.pendingSettleDelay = null;
    this.reels.forEach((reel) => reel.destroy());
    this.spinButton.destroy();
    this.symbolFactory.destroy();
    this.stateMachine.destroy();
    this.resultListeners.clear();
    this.view.destroy({ children: true });
  }

  private handleSpinRequest(): void {
    if (!this.config.resultProvider) return;
    if (!this.stateMachine.canSpin()) return;
    void this.spin(this.config.resultProvider());
  }

  /** Minimal anticipation heuristic: if every reel but the last agrees, slow the last reel down. */
  private isAnticipationResult(result: SpinResult): boolean {
    if (result.length < 2) return false;
    const leading = result.slice(0, -1);
    return leading.every((id) => id === leading[0]);
  }

  private wait(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      this.pendingSettleDelay = gsap.delayedCall(seconds, () => {
        this.pendingSettleDelay = null;
        resolve();
      });
    });
  }
}
