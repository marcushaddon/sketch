import P5 from "p5";
import { pipe, __, range } from "ramda";
import { Leaf } from "./entities";
import { Sketch, Coord } from "./model";
import { rotate, sin, gain, onOff, floor, lazySin, add, envelope, addConst } from "../lib/signals";

const sketch = (p5: P5): Sketch => {
  /**
   * Create 
   */
  const [trigger, env] = envelope({
    a: 1,
    d: 0.5,
    s: 2,
    r: 1,
    sustainGain: -1,
    attackGain: -2
  });
  trigger(0);

  const wave = lazySin({
    amp: env,
    freq: addConst(-1, env)
  });

  return {
    objects: [],
    tick: () => null,
  }
}

export default sketch;
