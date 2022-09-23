import P5 from "p5";
import { Sketch, IDraw, Coord } from "./model";
import { range } from "../lib";
import { rotate, sin } from "../lib/math";



/**
 * square returns p5.rect params for a square with its
 * center at center having area area.
 */
const rect = (center: Coord, area: number): { x: number, y: number, w: number, h: number } => {
  const w = Math.sqrt(area) * window.p5.random(0.5, 1.5);
  const h = area / w;
  const hW = w / 2;
  const hH = h / 2;
  const [centerX, centerY] = center;
  const x = centerX - hW;
  const y =  centerY - hH;


  return {
    x, y, w, h
  }
}

class Leaf {
  private position: P5.Vector;
  public w: number;
  public h: number;

  constructor(
    x: number,
    y: number,
    size: number
  ) {
    let { x: rX, y: rY, w, h} = rect([x, y], size);
    this.position = window.p5.createVector(rX, rY);

    this.w = w;
    this.h = h;
  }

  draw() {
    window.p5.rect(this.position.x, this.position.y, this.w, this.h);
  }
}

const sketch = (p5: P5): Sketch => {
  /**
   * excercise:
   * generate spread of random coords
   * for each, generate a leaf at that coord
   * then generate list of wave funcs,
   * each composed of a large gentle sway, and a short wiggle, 
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

  const sway = sin(1, 0, 1, 0);
  const actions = scrambled
    .map(leaf => {
      const rotated = rotate(leaf.x / 500, sway);
      return (time: number) => {
        const signal = rotated(time);
        leaf.x += signal;
      };
    });

  const tick = (time: number) => actions.forEach(a => a(time));

  return {
    objects: scrambled,
    tick,
  }
}

export default sketch;
