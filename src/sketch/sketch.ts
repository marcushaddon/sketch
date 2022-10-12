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
import { grid } from "../lib/space";

type Model = {
  steadyBreeze: Signal;
  gust: Signal;
  windDir: P5.Vector;
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

const model: Model = {
  steadyBreeze: sin(0.25, 0, 1),
  gust: floor(0, addConst(-4, sin(0.05, 0, 5))),
  windDir: new P5.Vector(-1, 0)
};



const sketch = (p5: P5): Sketch => {
  const createLayer = (idx: number): Leaf[] => {
    const count = Math.floor(Math.pow(idx * 10, 1.5));
    const size = 200 / idx;
    const green = 255 - 180 / idx;

    // const color = new P5.Color();
    // color.setGreen(green);
    return grid(1000, 1000, count)
      .map(([x, y]) => new Leaf(x, y, size));
  }
  
  // Apply translations based on layer idx
  const wavesForLayer = curry((model: Model, layer: Leaf[]): LayerGroup => {
    // BOOKMARK: alter waves
    return {
      model: {
        ...model,
      },
      layer,
    }
  });
  
  const wfLayer = wavesForLayer(model);
  
  const wavesForLeaf = curry(({ layer, model }: LayerGroup): Sketch => {
    // TODO: bind waves to leaf
    return {
      objects: layer,
      tick: (time: number) => null
    }
  });
  
  const mergeSketches = (a: Sketch, b: Sketch): Sketch => ({
    objects: [...a.objects, ...b.objects],
    tick: (time: number) => {
      a.tick(time);
      b.tick(time);
    }
  });
  
  const blankSketch: Sketch = {
    objects: [],
    tick: (time: number) => null
  };
  
  const LAYER_COUNT = 2;
  
  const scene = pipe(
    range(0),
    map(createLayer),
    map(wfLayer),
    map(wavesForLeaf),
    reduce((acc, curr) => mergeSketches(acc, curr), blankSketch)
  );

  
  return scene(LAYER_COUNT + 1);
}

export default sketch;
