import { range } from "ramda";
import { Coord } from "../sketch/model";

/**
 * @param n The number that the two numbers need to be multiply
 * @param ratio the approx. ratio between the two numbers (< 1)
 */
const factorsOfRatio = (n: number, ratio: number): [number, number] => {
  let bestError = Infinity;
  let a = ratio, b = (1 - ratio);
  let i = 1;
  while (i < n) {
    const error = Math.abs(i * a + i * b - n);
    if (error >= bestError) {
      break;
    }

    bestError = error;
    i++;
  }

  return [Math.floor(i * a), Math.floor(i * b)];
}
/**
 * grid returns a list of `count` coordinates evenly gridded across a space of
 * dimensions `width` x `height`
 */
export const grid = (width: number, height: number, count: number): Coord[] => {
  // Find count for w and h
  // two numbers adding up to count, one that goes into width n times, one that goes into h n times
  // if w == h, wCount hCount = count // 2
  // if w == h * 2, wCount = count * 2/3, hCount == count * 1/3
  // [wRatio, hRatio] = [w / (w + h), h / (w + h)], wCount = wRatio * count, hCount = hRatio * count
  const wRatio = width / (width + height);
  const [wCount, hCount] = factorsOfRatio(count, wRatio);
  // OH DUH we will end up with wCount X hCount, not wCount + hCount
  // how do we get numbers of this ratio that multiply to be `count`?
  console.assert(wCount + hCount === count);

  const wIncr = width / wCount;
  const hIncr = height / hCount;

  console.log({
    wRatio,
    wCount, hCount,
    wIncr, hIncr
  })

  // TODO: offset around sides (sum heights, widths)
  return range(0)(wCount)
    .map(x => range(0)(hCount).map(y => ([
      Math.floor(x * wIncr), Math.floor(y * hIncr)
    ]) as Coord)).flatMap(c => c);

}