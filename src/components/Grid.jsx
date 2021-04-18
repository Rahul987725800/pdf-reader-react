import React from 'react';
import Dictionary from './Dictionary';
import PdfReader from './PdfReader';
import styles from './Grid.module.css';
import Notes from './Notes';
import { percent } from '../utils';
import GridLayout from 'react-grid-layout';
import { usePdf } from '../provider/PdfContextProvider';

export const WordContext = React.createContext();
function Grid() {
  const { layout, setLayout } = usePdf();
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={4}
      rowHeight={percent(window.innerHeight, 90) / 4}
      width={percent(window.innerWidth, 99)}
      draggableCancel=".non-draggable"
      onResizeStop={(layout) => {
        // console.log(layout);
        setLayout(layout);
      }}
      onDragStop={(layout) => {
        // console.log(layout);
        setLayout(layout);
      }}
    >
      <div key="a">
        <div className={styles.block}>
          <PdfReader />
        </div>
      </div>
      <div key="b">
        <div className={styles.block + ' ' + styles.noScrollBar}>
          <Dictionary />
        </div>
      </div>
      <div key="c">
        <div className={styles.block + ' ' + styles.noScrollBar}>
          <Notes />
        </div>
      </div>
    </GridLayout>
  );
}

export default Grid;
