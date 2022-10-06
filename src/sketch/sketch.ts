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
  multConst
} from "../lib/signals";
import { grid } from "../lib/space";

const ratios = [
  [600, 40],
  [300, 60],
  [30, 120]
]

const sketch = (p5: P5): Sketch => {

  const objs = grid(1000, 1000, 40)
    .map(([x, y]) => new Leaf(x, y, 20));
  
  const actions: ((time: number) => void)[] = []

  return {
    objects: objs,
    tick: (t: number) => actions.forEach(a => a(t)),
  }
}

export default sketch;
