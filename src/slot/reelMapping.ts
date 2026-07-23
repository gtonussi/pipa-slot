/** How many filler symbols scroll past before the reel settles on its result. */
export const REEL_FILLER_COUNT = 18;

function idAt(symbolIds: string[], index: number): string {
  const length = symbolIds.length;
  return symbolIds[((index % length) + length) % length];
}

/**
 * Builds a deterministic strip so that after scrolling exactly REEL_FILLER_COUNT rows,
 * the target lands on the reel result row (center row for odd visibleSymbols values).
 */
export function buildReelStrip(
  symbolIds: string[],
  targetSymbolId: string,
  visibleSymbols: number,
  fillerCount = REEL_FILLER_COUNT,
): string[] {
  const targetIndex = Math.max(0, symbolIds.indexOf(targetSymbolId));
  const strip: string[] = [];

  for (let i = 0; i < fillerCount; i++) {
    strip.push(idAt(symbolIds, targetIndex - fillerCount + i));
  }

  const resultRow = Math.floor(visibleSymbols / 2);
  for (let row = 0; row < visibleSymbols; row++) {
    strip.push(idAt(symbolIds, targetIndex - resultRow + row));
  }

  return strip;
}
