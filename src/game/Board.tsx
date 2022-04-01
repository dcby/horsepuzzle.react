import "./Board.scss";
import React from "react";
import { CellData, CellFlags } from "../model/game";
import Cell from "./Cell";

export interface BoardProps {
  cells: readonly CellData[];
  onCellTouch: (x: number, y: number) => void;
}

export default class Board extends React.Component<BoardProps> {
  public render() {
    const { cells, onCellTouch } = this.props;

    const children = cells.map(e => <Cell key={makeKey(e.x, e.y)} flags={e.flags} onClick={onCellTouch} x={e.x} y={e.y}>{getText(e)}</Cell>);

    return <div className="Board">
      {children}
    </div>;
  }
}

function getText(cell: CellData) {
  if (cell.flags === CellFlags.none)
    return undefined;
    
  return cell.serial ?? "?";
}

function makeKey(x: number, y: number) {
  return `${x}:${y}`;
}
