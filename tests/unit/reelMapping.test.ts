import { describe, expect, it } from "vitest";
import { buildReelStrip, REEL_FILLER_COUNT } from "../../src/slot/reelMapping";

describe("reelMapping", () => {
  it("maps result symbol to final center row after full scroll distance", () => {
    const symbolIds = ["A", "B", "C", "D", "E"];
    const visibleSymbols = 3;
    const targetSymbolId = "D";

    const strip = buildReelStrip(symbolIds, targetSymbolId, visibleSymbols);

    expect(strip).toHaveLength(REEL_FILLER_COUNT + visibleSymbols);

    const resultRow = Math.floor(visibleSymbols / 2);
    const finalCenterIndex = REEL_FILLER_COUNT + resultRow;

    expect(strip[finalCenterIndex]).toBe(targetSymbolId);
  });

  it("keeps deterministic neighbors around the final target", () => {
    const symbolIds = ["A", "B", "C", "D", "E"];
    const visibleSymbols = 3;

    const strip = buildReelStrip(symbolIds, "A", visibleSymbols);
    const finalTopIndex = REEL_FILLER_COUNT;

    expect(strip[finalTopIndex]).toBe("E");
    expect(strip[finalTopIndex + 1]).toBe("A");
    expect(strip[finalTopIndex + 2]).toBe("B");
  });

  it("falls back to first symbol index for unknown target ids", () => {
    const symbolIds = ["A", "B", "C"];
    const visibleSymbols = 3;

    const strip = buildReelStrip(symbolIds, "UNKNOWN", visibleSymbols);

    expect(strip[REEL_FILLER_COUNT + 1]).toBe("A");
  });
});
