import "./Cell.scss";
import React from "react";
import { CellFlags } from "../model/game";

export interface CellProps {
  onClick: (x: number, y: number) => void;
  flags: CellFlags;
  x: number;
  y: number;
}

export default class Cell extends React.PureComponent<CellProps> {
  #handleClick = () => this.props.onClick(this.props.x, this.props.y);

  static #getClassNames(flags: CellFlags) {
    return `Cell${(flags & CellFlags.next) ? " Cell-next" : ""}${(flags & CellFlags.prev) ? " Cell-prev" : ""}${(flags & CellFlags.last) ? " Cell-last" : ""}${(flags & CellFlags.lose) ? " Cell-lose" : ""}${(flags & CellFlags.win) ? " Cell-win" : ""}`;
  }

  public render() {
    const { flags, x, y } = this.props;
    const style: React.CSSProperties = { gridColumn: x + 1, gridRow: y + 1 };

    return <div className={Cell.#getClassNames(flags)} onClick={this.#handleClick} onDoubleClick={this.#handleClick} style={style}>{this.props.children}</div>;
  }
}
