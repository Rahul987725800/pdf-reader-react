import React, { useState } from 'react';
import Dictionary from './Dictionary';
import PdfReader from './PdfReader';
import styles from './Grid.module.css';
import Notes from './Notes';
import Books from '../components/Books';
import { percent } from '../utils';
import GridLayout from 'react-grid-layout';
import { usePdf } from '../provider/PdfContextProvider';
import { isMobile } from 'react-device-detect';

export const WordContext = React.createContext();
function Grid() {
  const {
    layout,
    setLayout,
    setPageNumber,
    programaticScroll,
    setProgramaticScroll,
  } = usePdf();

  const pdfScroller = (e) => {
    // console.log('scrolled');
    if (programaticScroll) {
      setProgramaticScroll(false);
    } else {
      const documentRef = document.querySelector('.react-pdf__Document');
      const nPages = documentRef.children.length;
      let pageHeight = e.target.scrollHeight / nPages;

      setPageNumber((pn) => {
        return (
          pn - Math.min(pn - 1, 3) + Math.floor(e.target.scrollTop / pageHeight)
        );
      });
    }

    // console.log(e.target.scrollTop);
    // console.log(e.target.scrollHeight);
    // console.log(e.target.offsetHeight);
  };
  return isMobile ? MobileGrid() : DesktopGrid();
  function MobileGrid() {
    const [activeTab, setActiveTab] = useState('pdf'); // 'dic', 'note', 'pdf'
    const activeComponent = () => {
      switch (activeTab) {
        case 'dic':
          return (
            <div className={styles.mobileBlock}>
              <Dictionary />
            </div>
          );
        case 'note':
          return (
            <div className={styles.mobileBlock}>
              <Notes />
            </div>
          );
        case 'pdf':
          return (
            <div className={styles.mobileBlock} onScroll={pdfScroller}>
              <PdfReader />
            </div>
          );
        default:
          return null;
      }
    };
    return (
      <div>
        <div className={styles.tabs}>
          <p
            onClick={() => setActiveTab('dic')}
            className={activeTab === 'dic' ? styles.active : ''}
          >
            Dictionary &nbsp; <i className="fa fa-language"></i>
          </p>

          <p
            onClick={() => setActiveTab('pdf')}
            className={activeTab === 'pdf' ? styles.active : ''}
          >
            PDF &nbsp; <i className="fa fa-book"></i>
          </p>

          <p
            onClick={() => setActiveTab('note')}
            className={activeTab === 'note' ? styles.active : ''}
          >
            Notes &nbsp; <i className="fa fa-pencil"></i>
          </p>
        </div>
        {activeComponent()}
      </div>
    );
  }
  function DesktopGrid() {
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
          <div className={styles.block} onScroll={pdfScroller}>
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
}

export default Grid;
