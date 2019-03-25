import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Bug from './icons/Bug';
import Github from './icons/Github';
import MineSweeper from './mine-sweeper';
import registerServiceWorker from './registerServiceWorker';

const rows = 6;
const columns = 12;
const mines = 16;

ReactDOM.render(
  <React.Fragment>
    <a href='https://github.com/Knochenmark/minesweeper/issues' title='Report a bug' className="bug">
      <Bug />
    </a>
    <a href='https://github.com/Knochenmark' title='Find me on Github' className="github">
      <Github />
    </a>
    <MineSweeper rows={rows} columns={columns} mines={mines} />
  </React.Fragment>
  ,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
