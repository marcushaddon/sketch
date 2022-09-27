import { curry, pipe } from "ramda";

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
) => Math.sin(time * freq * Math.PI - phase) * amp + bias;
export const sin = curry(_sin);

const _add = (a: Signal, b: Signal): Signal =>
  (time: number) => a(time) + b(time);
export const add = curry(_add);

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

