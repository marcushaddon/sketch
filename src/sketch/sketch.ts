import P5 from "p5";
import { pipe, __, range } from "ramda";
import { Leaf } from "./entities";
import { Sketch, Coord } from "./model";
import {
  rotate,
  sin,
  gain,
  onOff,
  floor,
  lazySin,
  add,
  envelope,
  addConst,
  multConst,
  delta
} from "../lib/signals";
import { grid } from "../lib/space";

const ratios: [number, number][] = [
  [100, 40],
  [70, 60],
  [20, 100]
];

const gentleBreeze = sin(1, 0, 1, 0);


const sketch = (p5: P5): Sketch => {
  const leafA = new Leaf(400, 500, 100);
  const leafB = new Leaf(600, 500, 100);

  window.debug(gentleBreeze, { label: "breeze" });

  const dir = window.p5.createVector(1, 0);
  const dBreeze = delta(gentleBreeze);
  window.debug(dBreeze, { label: "delta breeze" });
  const anim = (time: number) => {
    const breezeLevel = dBreeze(time) * 10;
    leafA.translate(dir.mult(breezeLevel));
    leafB.translate(dir.mult(breezeLevel));
  }


  return {
    objects: [leafA, leafB],
    tick: (t: number) => anim(t)
  };
}

export default sketch;
