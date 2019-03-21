import './App.css';

import * as React from 'react';

interface IMineSweeperStateProps {
  gameStatus: string;
  rows: number;
  columns: number;
  mines: number;
  mineField: IMineField[][];
}

interface IMineField {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  mineCounter: number | null;
}

interface IMineSweeperProps {
  rows: number,
  columns: number,
  mines: number,
}

export default class MineSweeper extends React.Component<IMineSweeperProps, IMineSweeperStateProps> {
  constructor(props: IMineSweeperProps) {
    super(props)
    this.state = {
      gameStatus: "0_0",
      rows: this.props.rows,
      columns: this.props.columns,
      mines: this.props.mines,
      mineField: this.generateMineField(this.props.rows, this.props.columns, this.props.mines)
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
        return <div key={`cell-${i}-${j}`} className={`grid-cell${revealed}${revealedMine}`} onClick={() => this.cellClickedHandler(i, j)} >{this.state.mineField[i][j].mineCounter}</div>
      });
      return <div key={`row-${i}`} className="grid-row">{cells}</div>
    });

    // TODO Change counter so that flagged mines are also counted when flags are introduce
    const mineCounter = this.state.mineField
      .reduce((acc: IMineField[], val: IMineField[]) => acc.concat(val), [])
      .filter((m: IMineField) => m.isMine && !m.isRevealed).length;
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

  private placeMinesOnField(mineField: IMineField[][], rows: number, columns: number, numberOfMines: number) {
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

  private toMineField = (): IMineField => ({
    isMine: false,
    isFlagged: false,
    isRevealed: false,
    mineCounter: null // If its a mine the counter will remain null
  });

  private createEmptyField = (rows: number, columns: number) =>
    Array(rows)
      .fill(0)
      .map(_ => Array(columns).fill(0).map(m => this.toMineField()))

  private generateMineField(rows: number, columns: number, mines: number) {
    return this.setMineCounters(
      this.placeMinesOnField(
        this.createEmptyField(rows, columns),
        rows,
        columns,
        mines
      )
    );
  }

  private cellClickedHandler(x: number, y: number) {
    if (this.isMine(x, y)) {
      this.gameOver();
    } else {
      this.revealCell(x, y);
    }
  }

  private isMine = (x: number, y: number): boolean => this.state.mineField[x][y].isMine

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

  private getSurroundingCells(x: number, y: number) {
    return [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]
  }

  private setMineCounters(mineField: IMineField[][]): IMineField[][] {
    return mineField
      .map((row, y) => row
        .map((field, x) => {
          return field.isMine
            ? field
            : {
              ...field,
              mineCounter: this.countSurroundingMines(x, y, mineField)
            }
        })
      );
  }

  private countSurroundingMines(x: number, y: number, mineField: IMineField[][]): number {
    let counter = 0;
    this.constructSurroundingCells(x, y).forEach((pos: number[]) => {
      if (mineField[pos[0]][pos[1]].isMine) {
        counter++;
      }
    });
    return counter;
  }

  private constructSurroundingCells(x: number, y: number) {
    return this.getSurroundingCells(x, y).reduce((acc, val) =>
      val[0] < 0
        ? acc
        : val[1] < 0
          ? acc
          : val[0] >= this.props.rows
            ? acc
            : val[1] >= this.props.columns
              ? acc
              : [...acc, val]
      , [])
  }

  private checkSurroundingCells(x: number, y: number) {
    return this.constructSurroundingCells(x, y);
  }
}
