import './App.css';

import * as React from 'react';

interface IMineSweeperStateProps {
  gameStatus: string;
  mineField: IMineField[][];
}

interface IMineField {
  isMine: boolean;
  isRevealed: boolean;
}

export default class MineSweeper extends React.Component<{}, IMineSweeperStateProps> {
  constructor(props = {}) {
    super(props)
    this.state = {
      gameStatus: "0_0",
      mineField: this.generateMineField(6, 6, 6)
    }
  }

  public gameOver() {
    this.setState({ gameStatus: "X_X" });
    this.revealAllMines();
    console.log("GAMEOVER", this.state.mineField)
  }

  public render() {
    const grid = this.state.mineField.map((row: any, i: any) => {
      const cells = row.map((_: any, j: any) => {
        const isRevealed = this.state.mineField[i][j].isRevealed;
        const isRevealedMine = this.state.mineField[i][j].isRevealed && this.state.mineField[i][j].isMine;
        const revealed = isRevealed ? " revealed" : "";
        const revealedMine = isRevealedMine ? " mine" : "";
        return <div key={`cell-${i}-${j}`} className={`grid-cell${revealed}${revealedMine}`} onClick={() => this.cellClickedHandler(i, j)} />
      });
      return <div key={`row-${i}`} className="grid-row">{cells}</div>
    });

    const mineCounter = this.state.mineField.flat().filter((m: IMineField) => m.isMine && !m.isRevealed).length; // TODO Fix counter when flags are introduce
    const counterText = mineCounter < 10 ? `0${mineCounter}` : `${mineCounter}`;

    return (
      <div className="game-wrapper">
        <h1>Minesweeper</h1>
        <div className="mine-sweeper">
          <div className="game-state">
            <div className="counter">
              <span>{counterText}</span>
            </div>
            {this.state.gameStatus}
            <button onClick={() => this.resetGame()}>Reset</button>
          </div>
          <div className="grid">
            {grid}
          </div>
        </div>
      </div>
    );
  }

  private resetGame() {
    this.setState({
      gameStatus: "0_0",
      mineField: this.generateMineField(6, 6, 6)
    })
  }

  private placeMinesOnField(mineField: any, rows: number, columns: number, numberOfMines: number) {
    while (numberOfMines > 0) {
      const rowIdx = this.random(rows)
      const colIdx = this.random(columns)
      if (!mineField[rowIdx][colIdx].isMine) {
        mineField[rowIdx][colIdx].isMine = true
        numberOfMines--;
      }
    }
    return mineField;
  }

  private random = (num: number): number => Math.floor(Math.random() * num);

  private toObj = (): IMineField => ({ isMine: false, isRevealed: false });

  private createEmptyField = (rows: number, columns: number) =>
    Array(rows)
      .fill(0)
      .map(_ => Array(columns).fill(0).map(m => this.toObj()))

  private generateMineField(rows: number, columns: number, eggs: number) {
    return this.placeMinesOnField(this.createEmptyField(rows, columns), rows, columns, eggs);
  }

  private cellClickedHandler(x: number, y: number) {
    if (this.isMine(x, y)) {
      this.gameOver();
    } else {
      this.revealCell(x, y);
      // this.checkSurroundingCells(x, y)
    }
  }

  private isMine = (x: number, y: number): boolean => this.state.mineField[x][y].isMine

  // this is for game over
  private revealAllMines() {
    const mineField = this.state.mineField;
    mineField.map(row => row.map(field => {
      if (field.isMine) {
        field.isRevealed = true
      }
    }));
    this.setState({
      mineField
    });
  }

  private revealCell(x: number, y: number) {
    const mineField = this.state.mineField;
    mineField[x][y].isRevealed = true;
    this.setState({
      mineField
    });
    this.checkSurroundingCells(x, y);
  }

  private checkSurroundingCells(x: number, y: number) {
    // let mineCounter = 0;

    // if (x - 1 >= 0 && y - 1 >= 0) {
    //   mineCounter += this.state.mineField[x - 1][y - 1];
    //   mineCounter += this.state.mineField[x][y - 1];
    //   mineCounter += this.state.mineField[x - 1][y];
    // }
    // if (y - 1 >= 0 && x + 1 < this.columns) {
    //   mineCounter += this.state.mineField[x + 1][y - 1];
    // }
    // if (x + 1 < this.columns) {
    //   mineCounter += this.state.mineField[x + 1][y];
    // }
    // if (x - 1 >= 0 && y + 1 < this.rows) {
    //   mineCounter += this.state.mineField[x][y + 1];
    //   mineCounter += this.state.mineField[x - 1][y + 1];
    // }
    // if (x + 1 < this.columns && y + 1 < this.rows) {
    //   mineCounter += this.state.mineField[x + 1][y + 1];
    // }

    // console.log("minecounter", mineCounter);

    // if (mineCounter !== 0) {
    // this.revealCell(x,y,mineCounter);
    // } else {
    // not tco yet
    /*
    checkSurroundingCells(x-1,y-1)
    checkSurroundingCells(x-1,y-1)
    checkSurroundingCells(x-1,y-1)
    checkSurroundingCells(x-1,y-1)

    checkSurroundingCells(x-1,y-1)
    checkSurroundingCells(x-1,y-1)
    checkSurroundingCells(x-1,y-1)
    checkSurroundingCells(x-1,y-1)
    */
  }
}
