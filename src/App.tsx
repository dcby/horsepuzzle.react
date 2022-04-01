import React from "react";
import "./App.css";
import Board from "./game/Board";
import { Level } from "./model/game";

export default class App extends React.Component {
  #level = new Level();

  #handleCellTouch = (x: number, y: number) => {
    this.#level.touch(x, y);
    this.forceUpdate();
  };

  public render() {
    return (
      <div className="App">
        <Board cells={this.#level.cells} onCellTouch={this.#handleCellTouch} />
      </div>
    );
  }
}
