import { curry, path, pipe } from "ramda";

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
      time * _freq(time) * Math.PI - _phase(time) * phaseCorrection
    ) * _amp(time) + _bias(time);
}

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

