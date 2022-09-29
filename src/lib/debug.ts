import { Chart, registerables } from "chart.js";
import { range } from "ramda";
import { Signal } from "./math";

export type SignalDebug = {
  label: string;
  samples?: number;
  color?: string;
}

Chart.register(...registerables)

let chart: Chart;
let initTimeout: ReturnType<typeof setTimeout> | undefined;

const signals: Signal[] = [];
const signalInfos: SignalDebug[] = [];

let X_SCALE = 10;

const init = (c: HTMLCanvasElement): Chart => {
  return new Chart(c, {
    type: "scatter",
    
    data: {
      datasets: signals.map((s, i) => {
        const info = signalInfos[i];
        const sampleCount = info.samples || 100 * X_SCALE;
        const incr = X_SCALE / sampleCount;
        const color = info.color ? info.color : 'rgb(255, 99, 132)'

        const data = range(0)(sampleCount)
          .map(x => ({
            x,
            y: s(x * incr)
          }));

        return {
          label: signalInfos[i].label,
          // backgroundColor: color,
          borderColor: color,
          showLine: true,
          data,
        };
      })
    }
  });
}

export const debug = (canvas: HTMLCanvasElement) => {

  const maybeInit = (debounce = 0) => {
    clearTimeout(initTimeout);
    initTimeout = setTimeout(() => {
      if (chart) {
        chart.destroy();
      }
      chart = init(canvas);
    }, debounce);
  };


  return {
    // DEBUG
    debug: (s: Signal, info: SignalDebug) => {
      signals.push(s);
      signalInfos.push(info);
  
      maybeInit()
    },

    scale: (s: number) => {
      X_SCALE = s;

      maybeInit(250);
    }
  }
};