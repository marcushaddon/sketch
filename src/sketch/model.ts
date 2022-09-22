export interface IDraw {
  draw(): void;
}

export interface Sketch {
  objects: IDraw[];
  tick(time: number): void;
}


export type Coord = [number, number];