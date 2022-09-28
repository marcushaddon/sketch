import P5 from "p5";
import { Signal } from "../lib/math";

declare global {
  interface Window {
    p5: P5;
    debug: (s: Signal) => void;
  }
}