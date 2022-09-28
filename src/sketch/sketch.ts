import P5 from "p5";
import { pipe, __ } from "ramda";
import { Leaf } from "./entities";
import { Sketch, Coord } from "./model";
import { range } from "../lib";
import { rotate, sin, gain, onOff, floor, lazySin } from "../lib/math";

const sketch = (p5: P5): Sketch => {
  /**
   * excercise:
   * generate spread of random coords
   * for each, generate a leaf at that coord
   * then generate list of wave funcs,
   * each composed of a large gentle sway, and a short shiver, 
   * rotated according to distance from lower left
   * 
   * later we will modulate freq/amp this way too, as well as distrubute it unevenly/in groups
   */

  const coords = range(20)
    .map(x => range(20)
      .map(y => [x * 50, y * 50]))
      .flatMap(c => c) as Coord[];
  
  const leaves = coords.map(([x, y]) => new Leaf(x, y, window.p5.random(100, 10000)));
  const scrambled = leaves.sort((_a, _b) => window.p5.random(1) > 0.5 ? -1 : 1);

  const swaySignal = sin(1, 0, 1, 0);
  const swayDir = window.p5.createVector(-1, 0).normalize();

  const breeze = floor(
    0,
    sin(0.1, 0, 1, 0)
  )
  window.debug(swaySignal);

  const shiver = lazySin({
    freq: breeze,
  })

  const actions = scrambled
    .map(leaf => {
      
      const rotatedSway = rotate(leaf.position.x * 0.1, swaySignal);
      const dir = swayDir.copy().rotate(window.p5.random(Math.PI * 2));

      return (time: number) => {
        const swaySignal = rotatedSway(time);
        leaf.translate(dir.copy().mult(swaySignal));

        // The breeze moves through the branches
        const rotatedBreeze = rotate(leaf.position.x * 0.001, breeze);
        const breezeLevel = rotatedBreeze(time);
  
        // The breeze causes the leaves to shiver (modulates its frequency)
        const rotatedShiver = rotate(window.p5.random(), shiver)
        const shiverLevel = rotatedShiver(time);


        // const shiverSignal = rotatedshiver(time);
        // leaf.scale(1 - shiverLevel);
      };
    });

  const tick = (time: number) => actions.forEach(a => a(time));

  return {
    objects: scrambled,
    tick,
  }
}

export default sketch;
