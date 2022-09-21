import P5 from "p5";

const run = (p5: P5) => {

  p5.setup = () => {
    p5.createCanvas(1000, 1000);
  };

  p5.draw = () => {
    p5.ellipse(200, 200, 100);
  }
}

new P5(run);
