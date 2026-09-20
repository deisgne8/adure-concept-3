export const aosSequenceDelay = (index: number) =>
  Math.min(Math.max(index, 0), 4) * 100;
