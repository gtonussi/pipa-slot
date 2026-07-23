import type { SlotMachineState } from "../state/SlotMachineStateMachine";

export interface SymbolDefinition {
  id: string;
  /** Placeholder fill color used until real art is available. */
  color: number;
  label?: string;
}

/** One symbol id per reel, already decided externally (never chosen by the animation). */
export type SpinResult = string[];

export interface SlotMachineConfig {
  reelsCount: number;
  symbols: SymbolDefinition[];
  /** Number of symbols visible per reel viewport. Defaults to 3. */
  visibleSymbols?: number;
  symbolSize?: number;
  reelSpacing?: number;
  /** Base spin duration (seconds) for the first reel. */
  spinDuration?: number;
  /** Extra duration (seconds) added per reel index so reels stop left -> right. */
  reelStagger?: number;
  /** Multiplier applied to the last reel's duration on near-win results. */
  anticipationMultiplier?: number;
  /** Supplies the already-decided result when the built-in spin button is used. */
  resultProvider?: () => SpinResult;
}

export interface SlotMachineEvents {
  onResult?: (result: SpinResult) => void;
  onStateChange?: (state: SlotMachineState) => void;
}

export type { SlotMachineState };
