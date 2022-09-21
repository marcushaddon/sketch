import P5 from "p5";
import { range } from "../lib";

export interface IDraw {
  draw(): void;
}

export interface Sketch {
  objects: IDraw[];
  tick(time: number): void;
}

type TimeFunc = (p5: P5, time: number) => void;



const sin = (
  len: number,
  phase: number = 0,
  amp: number = 1,
  bias = 0
) => (time: number) => Math.sin(time * len + phase) * amp + bias;

type Coord = [number, number];

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
  public x: number;
  public y: number;
  public w: number;
  public h: number;

  constructor(
    x: number,
    y: number,
    size: number
  ) {
    let { x: rX, y: rY, w, h} = rect([x, y], size);
    this.x = rX;
    this.y = rY;
    this.w = w;
    this.h = h;
  }

  draw() {
    window.p5.rect(this.x, this.y, this.w, this.h);
  }
}

const sketch = (p5: P5): Sketch => {
  const leaf = new Leaf(500, 500, 2000);
  const signal = sin(5, 0, 5);
  const wiggle = (time: number) => {
    const d = signal(time);
    leaf.x += d;
  }

  return {
    objects: [leaf],
    tick: wiggle,
  }
}

export default sketch;
