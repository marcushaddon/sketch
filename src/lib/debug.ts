import P5 from "p5";
import { range } from "ramda";
import { IDraw } from "../sketch/model";
import { Signal, sin } from "./math";

const signals: Signal[] = [sin(1, 0, 500, 0)];
let sampleSets: number[][][];
let rendered = false;

const sample = (s: Signal): number[][] => {
  return range(0)(500)
    .map(n => [n, s(n * 0.01) * 0.5 + 250]);
    
}

const graph = (p5: P5) => {
  const windowWidth = 1000; // TODO: get dynamically
  const windowHeight = 1000; // TODO: get dynamically
  const width = 1000;
  const height = 500;

  if (rendered) return;


  p5.rect(
    windowWidth - width / 2,
    windowHeight - height / 2,
    width,
    height
  );
  sampleSets = signals.map(s => sample(s));
  for (const sampleSet of sampleSets) {
    for (let i = 0; i < sampleSet.length - 1; i++) {
      const [x1, y1] = sampleSet[i], [x2, y2] = sampleSet[i + 1];
      p5.line(x1, y1, x2, y2);
    }
  }

  rendered = true;
}

export const debug = (p5: P5): IDraw => ({
  draw() { graph(p5); }
});
