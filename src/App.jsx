import React, { useState } from 'react';
import Dictionary from './components/Dictionary';
import PdfReader from './components/PdfReader';
import styles from './App.module.css';
import Notes from './components/Notes';

import GridLayout from 'react-grid-layout';
const percent = (val, percent) => {
  return (val * percent) / 100;
};
export const WordContext = React.createContext();
function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const layout = [
    { i: 'a', x: 0, y: 0, w: 3, h: 4 },
    { i: 'b', x: 3, y: 0, w: 1, h: 2 },
    { i: 'c', x: 3, y: 2, w: 1, h: 2 },
  ];
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={4}
      rowHeight={percent(window.innerHeight, 92) / 4}
      width={percent(window.innerWidth, 99)}
      draggableCancel=".non-draggable"
    >
      <div key="a">
        <div className={styles.block}>
          <PdfReader pageNumber={pageNumber} setPageNumber={setPageNumber} />
        </div>
      </div>
      <div key="b">
        <div className={styles.block}>
          <Dictionary />
        </div>
      </div>
      <div key="c">
        <div className={styles.block}>
          <Notes pageNumber={pageNumber} />
        </div>
      </div>
    </GridLayout>
  );
}

export default App;
