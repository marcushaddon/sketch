import P5 from "p5";
import { SignalDebug } from "../lib/debug";
import { Signal } from "../lib/signals";

declare global {
  interface Window {
    p5: P5;
    debug: (s: Signal, info: SignalDebug) => void;
  }
}