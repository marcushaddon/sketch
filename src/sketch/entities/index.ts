import P5 from "p5";
import { Coord } from "../model";

/**
 * square returns p5.rect params for a square with its
 * center at center having area area.
 */
 const rect = (center: Coord, size: number): { x: number, y: number, w: number, h: number } => {
  const w = window.p5.random(0.25, 0.75) * size;
  const h = size - w;
  const hW = w / 2;
  const hH = h / 2;
  const [centerX, centerY] = center;
  const x = centerX - hW;
  const y =  centerY - hH;


  return {
    x, y, w, h
  }
}

/**
 * This will probably be the basis for a general Object class
 * (for managin scale, rotation, translation, parent child relationshipts...)
 */
export class Leaf {
  readonly position: P5.Vector;

  private origW: number;
  private origH: number;
  private w: number;
  private h: number;

  private color: P5.Color;

  constructor(
    x: number,
    y: number,
    size: number,
    color = window.p5.color(255, 255, 255)
  ) {
    let { x: rX, y: rY, w, h} = rect([x, y], size);
    this.position = window.p5.createVector(rX, rY);

    this.origW = w;
    this.origH = h;
    this.w = w;
    this.h = h;

    this.color = color;
  }

  public get offset(): P5.Vector {
    return window.p5.createVector(this.w * 0.5, this.h * 0.5);
  }

  translate(dir: P5.Vector): Leaf {
    this.position.add(dir.x, dir.y);

    return this;
  }
  
  // BIG TODO: this is canceling out translation
  scale(s: number) {
    this.w = this.origW * s;
    this.h = this.origH * s;

    return this;
  }

  draw() {
    window.p5.fill(this.color)
    window.p5.rect(
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      this.w,
      this.h
    );
  }
}