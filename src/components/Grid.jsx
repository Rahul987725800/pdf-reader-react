import React, { useState } from 'react';
import Dictionary from './Dictionary';
import PdfReader from './PdfReader';
import styles from './Grid.module.css';
import Notes from './Notes';
import { percent } from '../utils';
import GridLayout from 'react-grid-layout';
export const initialLayout = [
  { i: 'a', x: 0, y: 0, w: 3, h: 4 },
  { i: 'b', x: 3, y: 0, w: 1, h: 2, minH: 2 },
  { i: 'c', x: 3, y: 2, w: 1, h: 2 },
];
export const WordContext = React.createContext();
function Grid() {
  const [pageNumber, setPageNumber] = useState(1);
  const [layout, setLayout] = useState(initialLayout);
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={4}
      rowHeight={percent(window.innerHeight, 90) / 4}
      width={percent(window.innerWidth, 99)}
      draggableCancel=".non-draggable"
      onResize={(layout) => {
        setLayout(layout);
      }}
    >
      <div key="a">
        <div className={styles.block}>
          <PdfReader
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            setLayout={setLayout}
          />
        </div>
      </div>
      <div key="b">
        <div className={styles.block + ' ' + styles.noScrollBar}>
          <Dictionary />
        </div>
      </div>
      <div key="c">
        <div className={styles.block + ' ' + styles.noScrollBar}>
          <Notes pageNum={pageNumber} setLayout={setLayout} />
        </div>
      </div>
    </GridLayout>
  );
}

export default Grid;
