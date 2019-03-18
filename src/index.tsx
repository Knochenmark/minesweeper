import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import MineSweeper from './mine-sweeper';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <MineSweeper />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
