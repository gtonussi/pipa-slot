export type SlotMachineState = "idle" | "spinning" | "settling" | "result";

type StateListener = (state: SlotMachineState) => void;

const ALLOWED_TRANSITIONS: Record<SlotMachineState, SlotMachineState[]> = {
  idle: ["spinning"],
  spinning: ["settling"],
  settling: ["result"],
  result: ["spinning", "idle"],
};

/**
 * Pure state machine for the slot machine lifecycle: idle -> spinning -> settling -> result.
 * Holds no rendering/animation logic so it can be unit tested in isolation.
 */
export class SlotMachineStateMachine {
  private state: SlotMachineState = "idle";
  private readonly listeners = new Set<StateListener>();

  getState(): SlotMachineState {
    return this.state;
  }

  canSpin(): boolean {
    return this.state === "idle" || this.state === "result";
  }

  start(): void {
    this.transition("spinning");
  }

  settle(): void {
    this.transition("settling");
  }

  complete(): void {
    this.transition("result");
  }

  reset(): void {
    if (this.state === "result") {
      this.transition("idle");
    }
  }

  onChange(listener: StateListener): void {
    this.listeners.add(listener);
  }

  offChange(listener: StateListener): void {
    this.listeners.delete(listener);
  }

  destroy(): void {
    this.listeners.clear();
  }

  private transition(next: SlotMachineState): void {
    if (!ALLOWED_TRANSITIONS[this.state].includes(next)) {
      throw new Error(
        `Invalid slot machine transition: ${this.state} -> ${next}`,
      );
    }
    this.state = next;
    this.listeners.forEach((listener) => listener(this.state));
  }
}
