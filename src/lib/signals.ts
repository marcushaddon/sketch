import { curry, path, pipe } from "ramda";
import { Coord } from "../sketch/model";

/**
 * WAVE FUNC + TOOLS
 */
export type Signal = (time: number) => number;

export const _sin = (
  freq: number,
  phase: number,
  amp: number,
  bias: number,
  time: number
) => Math.sin(time * freq * Math.PI * 2 - phase) * amp + bias;
export const sin = curry(_sin);

export type LazyNum = number | ((time: number) => number);

export type SinOpts = {
  freq?: LazyNum;
  phase?: LazyNum;
  amp?: LazyNum;
  bias?: LazyNum;
};

const ensureLazy = (v: LazyNum): ((_: number) => number) =>
  typeof v === "function" ? v : (_: number = 0) => v;

/**
 * LazySin creates a sin wave that accepts functions
 * as parameters that are lazily evaluated. Allows for
 * a wave whos parameters are modulated by another wave.
 * Should only be used when actually passing funcs as args,
 * otherwise use `sin` for performance.
 */
export const lazySin = ({
  freq = 1,
  phase = 0, // TODO: Make this proportional to freq
  amp = 1,
  bias = 0
}: SinOpts): Signal => {
  const _freq = ensureLazy(freq);
  const _phase = ensureLazy(phase);
  const _amp = ensureLazy(amp);
  const _bias = ensureLazy(bias);

  // To ensure that phase of 0.5 rotates wave by 0.5 of *initial* wavelength
  const phaseCorrection = 1 / _freq(0);

  return (time: number) =>
    Math.sin(
      time * _freq(time) * Math.PI * 2 - _phase(time) * phaseCorrection
    ) * _amp(time) + _bias(time);
}

const _add = (a: Signal, b: Signal): Signal =>
  (time: number) => a(time) + b(time);
export const add = curry(_add);

const _addConst = (a: number, b: Signal): Signal =>
  (time: number) => b(time) + a;
export const addConst = curry(_addConst);

const _multConst = (a: number, b: Signal): Signal =>
  (time: number) => b(time) * a;
export const multConst = curry(_multConst);

const _limit = (limit: number, s: Signal, ) =>
  (time: number) => Math.min(limit, s(time));
export const limit = curry(_limit);

const _floor = (floor: number, s: Signal) =>
  (time: number) => Math.max(floor, s(time));
export const floor = curry(_floor);

const _gate = (threshold: number, s: Signal) =>
  (time: number) => {
    const sig = s(time);
    return sig > threshold ? sig : 0;
  };
export const gate = curry(_gate);

const _onOff = (threshold: number, s: Signal) =>
  (time: number) => s(time) > threshold ? 1 : 0;
export const onOff = curry(_onOff);

const _rotate = (rot: number, s: Signal) =>
  (time: number) => s(time + rot);
export const rotate = curry(_rotate);

const _gain = (g: number, s: Signal) =>
  (time: number) => s(time) * g;
export const gain = curry(_gain);

export type ADSR = {
  a?: number;
  attackGain?: number;
  d?: number;
  s?: number;
  sustainGain?: number;
  r?: number;
}

const PEAK_LEVEL = 1.2;
const SUSTAIN_LEVEL = 1;

const lineContaning = (a: Coord, b: Coord): { m: number, b: number } => {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const m = (y2 - y1) / (x2 - x1);
  const bias = y1 - m * x1;

  return {
    m, b: bias,
  }
}

export const envelope = ({
  a = 0.2, d = 0.2, s = 0.2, r = 0.4,
  attackGain = PEAK_LEVEL, sustainGain = SUSTAIN_LEVEL
}: ADSR = {}): [(triggerTime: number) => void, Signal] => {
  const aDur = a * 1;
  const dDur = d * 1;
  const sDur = s * 1;
  const rDur = r * 1;
  const totalDur = aDur + dDur + sDur + rDur;
  debugger;

  const start: Coord = [0,0];
  const peak: Coord = [aDur, attackGain];
  const sustain: Coord = [aDur + dDur, sustainGain];
  const decay: Coord = [aDur + dDur + sDur, sustainGain];
  const finish: Coord = [totalDur, 0];

  const { m: aSlope, b: aBias } = lineContaning(
    start,
    peak
  );

  const { m: dSlope, b: dBias } = lineContaning(
    peak,
    sustain
  );

  const { m: rSlope, b: rBias } = lineContaning(
    decay,
    finish
  );

  let lastTrigger = -Infinity;

  // TODO: retrigger modes
  const signal = (time: number): number => {
    const elapsed = (time) - lastTrigger;
    if (elapsed > totalDur || elapsed < 0) {
      debugger;
      return 0;
    }

    // In attack?
    if (elapsed < aDur) {
      return elapsed * aSlope + aBias;
    }
    // In decay?
    if (elapsed < aDur + dDur) {
      return elapsed * dSlope + dBias;
    }
    // In sustain?
    if (elapsed < aDur + dDur + sDur) {
      return sustainGain;
    }
    // in release!
    return rSlope * elapsed + rBias;
  }

  const trigger = (time: number) => {
    lastTrigger = time;
  };

  return [trigger, signal];
}

