import P5 from "p5";
import { Coord } from "../model";

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

/**
 * This will probably be the basis for a general Object class
 * (for managin scale, rotation, translation, parent child relationshipts...)
 */
export class Leaf {
  private basePosition: P5.Vector;
  public position: P5.Vector;

  private origW: number;
  private origH: number;
  private w: number;
  private h: number;

  constructor(
    x: number,
    y: number,
    size: number
  ) {
    let { x: rX, y: rY, w, h} = rect([x, y], size);
    this.position = window.p5.createVector(rX, rY);
    this.basePosition = this.position.copy();

    this.origW = w;
    this.origH = h;
    this.w = w;
    this.h = h;
  }
  
  // TODO: implement .translate(vec)

  translate(dir: P5.Vector): Leaf {
    this.position.add(dir.x, dir.y);

    return this;
  }
  
  // BIG TODO: this is canceling out translation
  scale(s: number) {
    this.w = this.origW * s;
    this.h  = this.origH * s;
    const deltaW = this.origW - this.w;
    const deltaH = this.origH - this.h;

    this.position.x = this.basePosition.x + deltaW * 0.5;
    this.position.y = this.basePosition.y + deltaH * 0.5;

    return this;
  }

  draw() {
    window.p5.rect(this.position.x, this.position.y, this.w, this.h);
  }
}