import P5 from "p5";
import build from "./sketch";
import { Sketch } from "./model";
import { GraphDebug } from "../lib/debug";
import { add, sin } from "../lib/math";
import { __ } from "ramda";

const graph = new GraphDebug();
window.debug = graph.debug.bind(graph);

const rangeX = document.getElementById("debug.range.x") as HTMLInputElement;
rangeX
  ?.addEventListener("change", event => {
    graph.setRangeX(parseFloat(rangeX.value));
  });
const rangeY = document.getElementById("debug.range.y") as HTMLInputElement;

rangeY
  ?.addEventListener("change", event => {
    graph.setRangeY(parseFloat(rangeY.value));
  });


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

const runDebug = (p5: P5) => {
  p5.setup = () => {
    p5.createCanvas(1000, 500);
    graph.p5 = p5;
  }

  p5.draw = () => {
    graph.draw();
  }
  
}

new P5(runSketch, document.getElementById("sketch")!);
new P5(runDebug, document.getElementById("debug")!);
