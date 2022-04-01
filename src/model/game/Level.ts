import { CellData, CellFlags, LevelStatus } from "./types";

export class Level {
  #cells: readonly CellData[];
  #map: Map<string, CellData> = new Map();
  #moves: string[] = [];
  #status: LevelStatus = LevelStatus.lose;

  public constructor() {
    const cells: CellData[] = [];

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const cell: CellData = {
          flags: CellFlags.next,
          x: x,
          y: y,
        };

        cells.push(cell);
        this.#map.set(makeKey(x, y), cell);
      }
    }

    this.#cells = cells;
  }

  public get cells() {
    return this.#cells; 
  }

  public touch(x: number, y: number): void {
    const key = makeKey(x, y);
    const nextCell = this.#map.get(key);
    if (nextCell === undefined) {
      return;
    }

    let nextCells: readonly CellData[];

    const cellFlags = nextCell.flags & (CellFlags.prev | CellFlags.next | CellFlags.last);

    switch (cellFlags) {
      case CellFlags.next:
        if (this.#moves.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const lastCell = this.#map.get(this.#moves.at(-1)!)!;
          nextCells = getNextCells(lastCell, this.#map);

          // reset current 'next' cells
          for (const cell of nextCells) {
            cell.flags = CellFlags.none;
          }

          nextCells = getNextCells(nextCell, this.#map);
          for (const cell of nextCells) {
            cell.flags = CellFlags.next;
          }

          lastCell.flags = CellFlags.prev;

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          nextCell.serial = lastCell.serial! + 1;
          nextCell.flags = CellFlags.last;

          this.#moves.push(key);
                    
          if (nextCells.length === 0) {
            nextCell.flags |= this.#moves.length === this.#cells.length ? CellFlags.win : CellFlags.lose;
          }
        } else {
          nextCells = this.#cells;

          // reset current 'next' cells
          for (const cell of nextCells) {
            cell.flags = CellFlags.none;
          }

          nextCells = getNextCells(nextCell, this.#map);
          for (const cell of nextCells) {
            cell.flags = CellFlags.next;
          }

          nextCell.serial = 1;
          nextCell.flags = CellFlags.last;

          this.#moves.push(key);
                    
          if (nextCells.length === 0) {
            nextCell.flags |= this.#moves.length === this.#cells.length ? CellFlags.win : CellFlags.lose;
          }
        }

        if (nextCells.length === 0) {
          this.#status = this.#moves.length === this.#cells.length ? LevelStatus.win : LevelStatus.lose;
        }

        break;

      case CellFlags.prev:
        break;
            
      case CellFlags.last:
        if (this.#moves.length > 1) {
          const lastCell = nextCell;
          nextCells = getNextCells(lastCell, this.#map);

          // reset current 'next' cells
          for (const cell of nextCells) {
            cell.flags = CellFlags.none;
          }

          lastCell.serial = undefined;
          lastCell.flags = CellFlags.next;

          this.#moves.pop();

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const prevCell = this.#map.get(this.#moves.at(-1)!)!;
          nextCells = getNextCells(prevCell, this.#map);
          for (const cell of nextCells) {
            cell.flags = CellFlags.next;
          }
          prevCell.flags = CellFlags.last;
        } else {
          const lastCell = nextCell;
          nextCells = getNextCells(lastCell, this.#map);

          // reset current 'next' cells
          for (const cell of nextCells) {
            cell.flags = CellFlags.none;
          }

          lastCell.serial = undefined;
          lastCell.flags = CellFlags.next;

          this.#moves.pop();

          nextCells = this.#cells;
          for (const cell of nextCells) {
            cell.flags = CellFlags.next;
          }
        }

        this.#status = LevelStatus.none;

        break;
    }
  }
}

function getNextCell(x: number, y: number, map: Map<string, CellData>) {
  const key = makeKey(x, y);
  const cell = map.get(key);

  if (cell !== undefined && (cell.flags === CellFlags.next || cell.flags === CellFlags.none)) {
    return cell;
  }
}

function getNextCells(cell: CellData, map: Map<string, CellData>): readonly CellData[] {
  let nextCell: CellData | undefined;

  const cells: CellData[] = [];

  if ((nextCell = getNextCell(cell.x + 1, cell.y + 2, map)) !== undefined) {
    cells.push(nextCell);
  }
  if ((nextCell = getNextCell(cell.x + 1, cell.y - 2, map)) !== undefined) {
    cells.push(nextCell);
  }
  if ((nextCell = getNextCell(cell.x - 1, cell.y + 2, map)) !== undefined) {
    cells.push(nextCell);
  }
  if ((nextCell = getNextCell(cell.x - 1, cell.y - 2, map)) !== undefined) {
    cells.push(nextCell);
  }
  if ((nextCell = getNextCell(cell.x + 2, cell.y + 1, map)) !== undefined) {
    cells.push(nextCell);
  }
  if ((nextCell = getNextCell(cell.x + 2, cell.y - 1, map)) !== undefined) {
    cells.push(nextCell);
  }
  if ((nextCell = getNextCell(cell.x - 2, cell.y + 1, map)) !== undefined) {
    cells.push(nextCell);
  }
  if ((nextCell = getNextCell(cell.x - 2, cell.y - 1, map)) !== undefined) {
    cells.push(nextCell);
  }

  return cells;
}

function makeKey(x: number, y: number) {
  return `${x}:${y}`;
}
