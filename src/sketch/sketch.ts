import P5 from "p5";
import { pipe, __, range, map, reduce, curry } from "ramda";
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
  Signal,
} from "../lib/signals";
import { grid, mutateCoord } from "../lib/space";

type Model = {
  steadyBreeze: Signal;
  gust: Signal;
  windDir: Coord;
}

const ratios: [number, number][] = [
  [100, 40],
  [70, 60],
  [20, 100]
];

type LayerGroup = {
  model: Model,
  layer: Leaf[]
};

const BREEZE_FREQ = 6;
const model: Model = {
  steadyBreeze: sin(BREEZE_FREQ, 0, 1),
  gust: floor(0, addConst(-4, sin(0.05, 0, 5))),
  windDir: [-1, 0]
};

const LAYER_COUNT = 3;

const sketch = (p5: P5): Sketch => {
  const createLayer = (idx: number): Leaf[] => {
    const count = Math.floor(Math.pow(idx * 10, 1.5));
    const size = 200 / idx;
    const green = 255 - 50 * idx;

    const color = window.p5.color(0, green, 0);

    return grid(1000, 1000, count)
      .map(([ x, y ]) => new Leaf(x, y, size, color))
      .sort(() => Math.random() > 0.5 ? -1 : 1);
  }

  const animateLayer = (leaves: Leaf[], layerIdx: number) => {
    const layerBreezeRotation = 
      BREEZE_FREQ * 0.25 * layerIdx;


    return leaves.map(leaf => {
      const leafBreezeRotation = layerBreezeRotation + leaf.position.x / 500;
      const steadyBreeze = rotate(
        leafBreezeRotation,
        model.steadyBreeze
      );
      const [x, y] = model.windDir;
      const dir = window.p5.createVector(x, y);

      return (time: number) => {
        const steadyBreezeLevel = steadyBreeze(time);
        const breezeMovement = P5.Vector.mult(dir, steadyBreezeLevel);
        leaf.translate(breezeMovement);
      }
    })
  };

  const layers = range(1, LAYER_COUNT + 1)
    .map(idx => createLayer(idx));

  const animations = layers
    .map((layer, idx) => animateLayer(layer, idx))
    .flatMap(tick => tick);

  const tick = (time: number) => animations.forEach(a => a(time));


  return {
    objects: layers.reverse().flatMap(leaf => leaf),
    tick
  }
}

export default sketch;
