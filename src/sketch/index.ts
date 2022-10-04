import P5 from "p5";
import { Chart } from "chart.js";
import build from "./sketch";
import { Sketch } from "./model";
import { debug as initDebug } from "../lib/debug";

let start = new Date().getTime();
const ms = 1 / 1000;

const runSketch = (p5: P5) => {

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
    sketch.objects.forEach(o => { o.draw() });


  };
}

const { debug, scale } = initDebug(document.getElementById("debug") as HTMLCanvasElement);

window.debug = debug;
new P5(runSketch, document.getElementById("sketch")!);

const scaleX = document.getElementById("debug.scale.x") as HTMLInputElement;
scaleX.addEventListener("change", event => {
  scale(parseFloat(scaleX.value));
})
