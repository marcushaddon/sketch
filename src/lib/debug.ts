import P5 from "p5";
import { range } from "ramda";
import { IDraw } from "../sketch/model";
import { Signal } from "./math";

export class GraphDebug implements IDraw {
  private _p5: P5;
  private _scaleX = 1000;
  private _scaleY = 500;
  private _rangeX = 5;
  private _rangeY = 2;
  private _dirty = false;

  private _signals: Signal[] = [];
  private _sampleSets: number[][] = [];

  constructor() { }

  debug(s: Signal) {
    this._signals.push(s);
    this._dirty = true;
  }

  set p5(p5: P5) {
    this._p5 = p5;
  }

  setRangeX(x: number) {
    this._rangeX = x;
    this._dirty = true;
  }

  setRangeY(y: number) {
    this._rangeY = y;
    this._dirty = true;
  }

  sample(s: Signal): number[] {
    const sampleCount = 500;
    const step = this._rangeX / sampleCount;

    const samples = range(0)(sampleCount)
      .map(n => s(n * step));

    return samples;
  }

  scaleY(samples: number[]): number[] {
    const halfScale = this._scaleY * 0.5;
    const scaled = samples.map(s => s / this._rangeY * this._scaleY);
    const adjusted = scaled.map(s => s + halfScale);

    return adjusted;
  }

  draw() {
    if (!this._dirty) return;
    this._p5.clear(255, 255, 255, 1);

    this._sampleSets = this._signals.map(s => this.sample(s));

    const step = this._scaleX / this._sampleSets[0].length;
    for (const sampleSet of this._sampleSets) {
      const scaled = this.scaleY(sampleSet);
      for (let i = 0; i < scaled.length - 1; i++) {
        const x1 = i * step;
        const y1 = scaled[i];
        const x2 = (i + 1) * step;
        const y2 = scaled[i + 1];

        this._p5.line(x1, y1, x2, y2);
      }
    }

    this._dirty = false;
  }
}
