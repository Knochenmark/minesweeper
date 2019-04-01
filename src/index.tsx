import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Bug from './icons/Bug';
import Github from './icons/Github';
import MineSweeperContainer from './mine-sweeper-container';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <React.Fragment>
    <a href="https://github.com/Knochenmark/minesweeper/issues" title="Report a bug" className="bug">
      <Bug />
    </a>
    <a href="https://github.com/Knochenmark" title="Find me on Github" className="github">
      <Github />
    </a>
    <MineSweeperContainer />
  </React.Fragment>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
