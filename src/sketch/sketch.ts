import P5 from "p5";
import { range } from "../lib";

type TimeFunc = (p5: P5, time: number) => void;

export interface IDraw {
  draw(time: number);
}

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

const leaf = (x: number, y: number, size: number): IDraw => {
  // TODO: choose 3 x,y coords such that area is size
  const { x: rX, y: rY, w, h} = rect([x, y], size);

  return {
    draw( _: number) {
      window.p5.rect(rX, rY, w, h);
    }
  };
}

const sketch = (p5: P5) => {
  return range(500).map(_ => {
    const x = p5.random(1000);
    const y = p5.random(1000);
    const size = p5.random(10000);

    return leaf(x, y, size);
  })
}

export default sketch;
