import P5 from "p5";
import sketch, { IDraw } from "./sketch";


let start = new Date().getTime();

const run = (p5: P5) => {

  let objs: IDraw[];

  p5.setup = () => {
    window.p5 = p5;
    p5.createCanvas(1000, 1000);
    objs = sketch(p5);
  };

  

  p5.draw = () => {
    p5.clear(255, 255, 255, 1);
    
    objs.forEach(o => o.draw(new Date().getTime() - start));
  };
  // p5.draw = () => {
  //   p5.ellipse(x * 10, y, 50);
  //   x += Math.sin(++x);
  // }
}

new P5(run);
