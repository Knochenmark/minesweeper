import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import MineSweeper from './mine-sweeper';
import registerServiceWorker from './registerServiceWorker';

const rows = 6;
const columns = 12;
const mines = 16;

ReactDOM.render(
  <MineSweeper rows={rows} columns={columns} mines={mines}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
