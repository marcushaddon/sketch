import {
  sin,
  lazySin,
  rotate
} from "./signals";

describe("rotate", () => {
  it("applies rotatons correcty", () => {
    const freq = Math.random();
    const s = sin(freq, 0, 1);
    const ls = lazySin({ freq });

    for (let cycle = 0; cycle < 10 * freq; cycle += freq) {
      expect(s(cycle)).toBeLessThan(0.00000001);
      expect(ls(cycle)).toBeLessThan(0.00000001);
    }
  });

  it("applies rotations correctly", () => {
    const freq = Math.random();
    const phase = Math.random();

    const s = sin(freq, phase, 1);
    const ls = lazySin({
      freq,
      phase
    });
    for (let cycle = 0; cycle < freq * 10; cycle += freq) {
      expect(s(cycle + phase)).toBeLessThan(0.000001);
      expect(ls(cycle + phase)).toBeLessThan(0.0000001);
    }
  });

});
