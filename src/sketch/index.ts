import P5 from "p5";
import build from "./sketch";
import { Sketch } from "./model";


let start = new Date().getTime();
const ms = 1 / 1000;

const run = (p5: P5) => {

  let sketch: Sketch;

  p5.setup = () => {
    window.p5 = p5;
    p5.createCanvas(1000, 1000);
    sketch = build(p5);
  };

  

  p5.draw = () => {
    p5.clear(255, 255, 255, 1);
    const d = (new Date().getTime() - start) * ms;
    sketch.tick(d);
    sketch.objects.forEach(o => o.draw());
  };
  // p5.draw = () => {
  //   p5.ellipse(x * 10, y, 50);
  //   x += Math.sin(++x);
  // }
}

new P5(run);
