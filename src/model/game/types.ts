export interface CellData {
  flags: CellFlags;
  serial?: number;
  readonly x: number;
  readonly y: number;
}

export enum CellFlags {
  none = 0,
  next = 1,
  prev = 2,
  last = 4,
  lose = 8,
  win = 16,
}

export enum LevelStatus {
  none,
  lose,
  win,
}
