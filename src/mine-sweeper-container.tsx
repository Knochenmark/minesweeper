import * as React from 'react';

import MineSweeper from './mine-sweeper';

interface IMineSweeperContainerStateProps {
  rows: number;
  columns: number;
  mines: number;
  difficulty: Difficulty;
}

enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

export default class MineSweeperContainer extends React.Component<{}, IMineSweeperContainerStateProps> {
  constructor(props = {}) {
    super(props);
    const { rows, columns, mines } = this.getDifficultySettings(Difficulty.EASY);
    this.state = {
      difficulty: Difficulty.EASY,
      rows,
      columns,
      mines
    }
  }

  public render() {
    return (
      <React.Fragment>
        <div className="difficulty">
          <h3>Difficulty</h3>
          <div className="difficulty-container">
            <span className={this.state.difficulty === Difficulty.EASY ? "active" : ""}
              onClick={() => this.setDifficulty(Difficulty.EASY)}>Easy</span>
            <span className={this.state.difficulty === Difficulty.MEDIUM ? "active" : ""}
              onClick={() => this.setDifficulty(Difficulty.MEDIUM)}>Medium</span>
            <span className={this.state.difficulty === Difficulty.HARD ? "active" : ""}
              onClick={() => this.setDifficulty(Difficulty.HARD)}>Hard</span>
          </div>
        </div>
        <MineSweeper rows={this.state.rows} columns={this.state.columns} mines={this.state.mines} />
      </React.Fragment>
    );
  }

  private getDifficultySettings(difficulty: Difficulty): { rows: number, columns: number, mines: number } {
    return {
      0: { rows: 6, columns: 12, mines: 16 },
      1: { rows: 10, columns: 18, mines: 32 },
      2: { rows: 14, columns: 24, mines: 64 },
    }[difficulty];
  }

  private setDifficulty(difficulty: Difficulty) {
    const { rows, columns, mines } = this.getDifficultySettings(difficulty);

    this.setState({
      difficulty,
      rows,
      columns,
      mines,
    });
  }
}
