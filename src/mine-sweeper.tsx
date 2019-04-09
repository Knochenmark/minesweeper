import * as React from 'react';

import SmileyDead from './icons/smiley-dead';
import SmileyLaugh from './icons/smiley-laugh';
import SmileySunGlasses from './icons/smiley-sunglasses';

const numberColors = {
  0: '',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
};

enum GameStatus {
  RUNNING,
  PAUSED,
  GAME_OVER,
  VICTORY,
}

interface IPosition {
  x: number;
  y: number;
}

interface IMineSweeperStateProps {
  gameStatus: GameStatus;
  rows: number;
  columns: number;
  mines: number;
  mineField: IMineField[][];
}

interface IMineField {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  mineCounter: number | null; // If its a mine the counter will be null
  position: IPosition;
}

interface IMineSweeperProps {
  rows: number;
  columns: number;
  mines: number;
}

export default class MineSweeper extends React.Component<IMineSweeperProps, IMineSweeperStateProps> {
  constructor(props: IMineSweeperProps) {
    super(props);
    this.state = {
      gameStatus: GameStatus.PAUSED,
      rows: this.props.rows,
      columns: this.props.columns,
      mines: this.props.mines,
      mineField: this.generateMineField(this.props.rows, this.props.columns, this.props.mines),
    };
  }

  public componentDidMount() {
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', (e) => this.onKeyDown(e));
  }

  public componentDidUpdate(prevProps: IMineSweeperProps) {
    const { rows, columns, mines } = this.props;
    if (rows !== prevProps.rows || columns !== prevProps.columns || mines !== prevProps.mines) {
      this.setState({
        ...this.state,
        rows,
        columns,
        mines,
        gameStatus: GameStatus.PAUSED,
        mineField: this.generateMineField(rows, columns, mines),
      });
    }
  }

  public gameOver() {
    this.setState({ gameStatus: GameStatus.GAME_OVER });
    this.revealAllMines();
  }

  public render() {
    const grid = this.state.mineField.map((row: any, i: any) => {
      const cells = row.map((_: any, j: any) => {
        const mine = this.state.mineField[i][j];
        const isRevealed = mine.isRevealed;
        const isFlagged = mine.isFlagged;
        const isRevealedMine = mine.isRevealed && mine.isMine;
        const flagged = isFlagged ? ' flagged' : '';
        const revealed = isRevealed ? ' revealed' : '';
        const revealedMine = isRevealedMine ? ' mine' : '';
        const num = isRevealed && mine.mineCounter ? numberColors[mine.mineCounter] : '';
        const mineCounter = mine.mineCounter && mine.isRevealed && mine.mineCounter > 0 ? mine.mineCounter : '';
        return (
          <div
            key={`cell-${i}-${j}`}
            className={`grid-cell${revealed}${revealedMine}${flagged} ${num}`}
            onClick={(e) => this.onCellClick(e, i, j)}
          >
            {mineCounter}
          </div>
        );
      });
      return (
        <div key={`row-${i}`} className="grid-row">
          {cells}
        </div>
      );
    });

    const flagCounter = this.state.mineField
      .reduce((acc: IMineField[], val: IMineField[]) => acc.concat(val), [])
      .filter((m: IMineField) => m.isFlagged && !m.isRevealed).length;
    const counter = this.props.mines - flagCounter;
    const counterText = counter < 10 ? `0${counter}` : `${counter}`;

    return (
      <div className="game-wrapper">
        <div className="mine-sweeper">
          <div className="game-state">
            <div className="counter">
              <span>{counterText}</span>
            </div>
            <div className="game-status" onClick={() => this.resetGame()} title="Reset the game">
              {this.state.gameStatus === GameStatus.PAUSED && <SmileyLaugh />}
              {this.state.gameStatus === GameStatus.RUNNING && <SmileyLaugh />}
              {this.state.gameStatus === GameStatus.GAME_OVER && <SmileyDead />}
              {this.state.gameStatus === GameStatus.VICTORY && <SmileySunGlasses />}
            </div>
            <div className="timer">
              {/* TODO: Add actual timer */}
              <span>00</span>
            </div>
          </div>
          <div className="grid">{grid}</div>
        </div>
      </div>
    );
  }

  private onKeyDown(e: any) {
    if (this.state.gameStatus !== GameStatus.PAUSED && e.keyCode === 82) {
      this.resetGame();
    }
  }

  private resetGame() {
    this.setState({
      gameStatus: GameStatus.PAUSED,
      mineField: this.generateMineField(this.props.rows, this.props.columns, this.props.mines),
    });
  }

  private placeMinesOnField(mineField: IMineField[][], rows: number, columns: number, numberOfMines: number) {
    while (numberOfMines > 0) {
      const rowIdx = this.getRandomNumber(rows);
      const colIdx = this.getRandomNumber(columns);
      if (!mineField[rowIdx][colIdx].isMine) {
        mineField[rowIdx][colIdx].isMine = true;
        numberOfMines--;
      }
    }
    return mineField;
  }

  private getRandomNumber = (num: number): number => Math.floor(Math.random() * num);

  private toMineField = (x: number, y: number): IMineField => ({
    isMine: false,
    isFlagged: false,
    isRevealed: false,
    mineCounter: null, // If its a mine the counter will remain null
    position: { x, y },
  });

  private createEmptyMineField(rows: number, columns: number): IMineField[][] {
    return Array(rows)
      .fill(0)
      .map((_, x) =>
        Array(columns)
          .fill(0)
          .map((m, y) => this.toMineField(x, y))
      );
  }

  private generateMineField(rows: number, columns: number, mines: number) {
    return this.setMineCounters(this.placeMinesOnField(this.createEmptyMineField(rows, columns), rows, columns, mines));
  }

  private onCellClick(e: React.MouseEvent, x: number, y: number) {
    if (this.state.gameStatus === GameStatus.VICTORY || this.state.gameStatus === GameStatus.GAME_OVER) {
      return;
    }
    if (this.state.gameStatus !== GameStatus.RUNNING) {
      this.setState({ gameStatus: GameStatus.RUNNING });
    }
    if (!e.shiftKey && this.isMine(x, y)) {
      this.gameOver();
    } else {
      e.shiftKey ? this.toggleFlagged(x, y) : this.revealCell(x, y);
    }
  }

  private isMine = (x: number, y: number): boolean => this.state.mineField[x][y].isMine;

  private revealAllMines() {
    const mineField = this.state.mineField;
    mineField.map((row) =>
      row.map((field) => {
        if (field.isMine) {
          field.isRevealed = true;
          field.isFlagged = false;
        }
      })
    );
    this.setState({
      mineField,
    });
  }

  private toggleFlagged(x: number, y: number) {
    const mineField = this.state.mineField;
    if (!mineField[x][y].isRevealed) {
      mineField[x][y].isFlagged = !mineField[x][y].isFlagged;
      this.setState({
        mineField,
      });
    }
  }

  private revealCell = (x: number, y: number) => {
    const field = this.state.mineField[x][y];
    field.isRevealed = true;
    field.isFlagged = false;
    const winningCondition =
      this.state.mineField
        .reduce((acc: IMineField[], val: IMineField[]) => acc.concat(val), [])
        .filter((m: IMineField) => !m.isMine && !m.isRevealed).length === 0;

    if (winningCondition) {
      this.setState({
        gameStatus: GameStatus.VICTORY,
      });
    } else {
      this.setState(
        {
          mineField: this.state.mineField,
        },
        () => this.revealSurroundingCells(x, y)
      );
    }
  };

  private revealSurroundingCells(x: number, y: number) {
    if (this.state.mineField[x][y].mineCounter !== 0) {
      return;
    }
    const cellPositions = this.getPositionsOfSurroundingCells(x, y);
    const surroundingMines = cellPositions
      .map((pos) => this.state.mineField[pos[0]][pos[1]])
      .filter((mine) => !mine.isRevealed);
    surroundingMines.forEach((mine) => {
      this.revealCell(mine.position.x, mine.position.y);
    });
  }

  private getSurroundingCells(x: number, y: number) {
    return [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ];
  }

  private setMineCounters(mineField: IMineField[][]): IMineField[][] {
    return mineField.map((row, x) =>
      row.map((field, y) => {
        return field.isMine
          ? field
          : {
              ...field,
              mineCounter: this.countSurroundingMines(x, y, mineField),
            };
      })
    );
  }

  private countSurroundingMines(x: number, y: number, mineField: IMineField[][]): number {
    let counter = 0;
    const surroundingCells = this.constructSurroundingCells(x, y);
    surroundingCells.forEach((pos: number[]) => {
      if (mineField[pos[0]][pos[1]].isMine) {
        counter++;
      }
    });
    return counter;
  }

  private constructSurroundingCells(x: number, y: number) {
    return this.getSurroundingCells(x, y).reduce(
      (acc, val) =>
        val[0] < 0
          ? acc
          : val[1] < 0
          ? acc
          : val[0] >= this.props.rows
          ? acc
          : val[1] >= this.props.columns
          ? acc
          : [...acc, val],
      []
    );
  }

  private getPositionsOfSurroundingCells(x: number, y: number) {
    return this.constructSurroundingCells(x, y);
  }
}
