import { describe, expect, it, vi } from "vitest";
import { SlotMachineStateMachine } from "../../src/state/SlotMachineStateMachine";

describe("SlotMachineStateMachine", () => {
  it("starts in idle and can spin", () => {
    const machine = new SlotMachineStateMachine();

    expect(machine.getState()).toBe("idle");
    expect(machine.canSpin()).toBe(true);
  });

  it("follows the valid lifecycle transitions", () => {
    const machine = new SlotMachineStateMachine();

    machine.start();
    expect(machine.getState()).toBe("spinning");
    expect(machine.canSpin()).toBe(false);

    machine.settle();
    expect(machine.getState()).toBe("settling");

    machine.complete();
    expect(machine.getState()).toBe("result");
    expect(machine.canSpin()).toBe(true);
  });

  it("throws on invalid transition", () => {
    const machine = new SlotMachineStateMachine();

    expect(() => machine.complete()).toThrow(
      "Invalid slot machine transition: idle -> result",
    );
  });

  it("notifies listeners in transition order and supports offChange", () => {
    const machine = new SlotMachineStateMachine();
    const listener = vi.fn();

    machine.onChange(listener);
    machine.start();
    machine.settle();
    machine.complete();

    expect(listener.mock.calls.map(([state]) => state)).toEqual([
      "spinning",
      "settling",
      "result",
    ]);

    machine.offChange(listener);
    machine.reset();

    expect(listener).toHaveBeenCalledTimes(3);
    expect(machine.getState()).toBe("idle");
  });
});
