import React, { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import styles from './PdfReader.module.css';
import lodash from 'lodash';
import { usePdf } from '../provider/PdfContextProvider';
import { isMobile } from 'react-device-detect';
import { Debounce, truncate } from '../utils';
import { Link } from 'react-router-dom';

export default function PdfReader() {
  const fileInputRef = useRef();
  const {
    fileName,
    setFileName,
    pdfFile,
    setPdfFile,
    scale,
    setScale,
    numPages,
    setNumPages,
    pageNumber,
    setPageNumber,
    setLayout,
    initialLayout,
    setProgramaticScroll,
    firstLoad,
    setFirstLoad,
  } = usePdf();
  const [localPageNumber, setLocalPageNumber] = useState(pageNumber);
  const [localPdfFile, setLocalPdfFile] = useState(pdfFile);
  const activePageRef = useRef();
  const [navBarClasses, setNavBarClasses] = useState([
    styles.navBar,
    firstLoad ? '' : styles.up,
  ]);
  useEffect(() => {
    if (firstLoad) {
      setTimeout(() => {
        setNavBarClasses([styles.navBar, styles.up]);
      }, 2000);
      setFirstLoad(false);
    }
  }, []);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(
      '.react-pdf__Page__textContent'
    );
    textLayers.forEach((layer) => {
      const { style } = layer;
      style.top = '0';
      style.left = '0';
      style.transform = '';
      // style.margin = '0 auto';
    });
  }
  useEffect(() => {
    window.onkeypress = (e) => {
      // console.log(e.key);
      switch (e.key) {
        case '+':
          setScale((ps) => ps + 0.1);
          break;
        case '-':
          setScale((ps) => ps - 0.1);
          break;
        default:
          break;
      }
    };
  }, []);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file?.type === 'application/pdf') {
      setFileName(file.name.split('.')[0]);
      setPdfFile(file);
      setPageNumber(1);
    }
  };
  useEffect(() => {
    setLocalPdfFile(null);
    setLocalPdfFile(pdfFile);
    setTimeout(() => {
      inputChangedHandler.current.call(pageNumber);
    }, 100);
  }, [scale, pdfFile]);

  const inputChangedHandler = useRef(
    new Debounce((pageNumber) => {
      setPageNumber(pageNumber);
      setProgramaticScroll(true);
      setTimeout(() => {
        activePageRef?.current?.scrollIntoView(true);
      }, 0);
    }),
    500
  );
  useEffect(() => {
    setLocalPageNumber(pageNumber);
  }, [pageNumber]);
  return (
    <div>
      {Navbar()}
      <div
        className="non-draggable"
        style={{
          paddingTop: isMobile ? '8.5rem' : '6rem',
        }}
      >
        {DocumentRendered()}
      </div>
    </div>
  );

  function Navbar() {
    return (
      <div
        className={navBarClasses.join(' ')}
        style={{
          marginTop: isMobile && '2.5rem',
        }}
        onMouseEnter={() => {
          // console.log('hovered');
          setNavBarClasses([styles.navBar]);
        }}
        onMouseLeave={() => {
          setNavBarClasses([styles.navBar, styles.up]);
        }}
      >
        <div className={styles.header}>
          {!isMobile && (
            <button
              class={styles.resetLayout}
              onClick={() => setLayout(initialLayout)}
            >
              Reset Layout
            </button>
          )}
          <Link to="/books" className="light">
            Saved Books/Notes
          </Link>
          <p className={styles.fileName}>{truncate(fileName, 15)}</p>
          <p></p>
        </div>
        <div className={styles.controls + ' non-draggable'}>
          <div>
            <input
              type="file"
              onChange={handleFile}
              ref={fileInputRef}
              style={{
                display: 'none',
              }}
            ></input>
            <button
              onClick={() => {
                fileInputRef.current.click();
              }}
              className={styles.chooseFileButton}
            >
              Choose File
            </button>
          </div>
          <p>
            {!isMobile && 'Page'}
            <input
              className={styles.pageInput}
              value={pdfFile && localPageNumber ? localPageNumber : ''}
              onChange={(e) => {
                setLocalPageNumber(+e.target.value);
                if (+e.target.value)
                  inputChangedHandler.current.call(+e.target.value);
              }}
            ></input>
            &nbsp;/ &nbsp;{numPages || '--'}
          </p>
          <div>
            {window.innerWidth > 600 && <label>Zoom :&nbsp;&nbsp;</label>}
            <input
              type="range"
              value={scale * 33}
              min={16.5}
              max={66}
              onChange={(e) => {
                // console.log(+e.target.value / 33);
                setScale(+e.target.value / 33);
              }}
            ></input>
          </div>
        </div>
      </div>
    );
  }

  function DocumentRendered() {
    return pdfFile ? (
      <Document
        file={localPdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className={styles.documentUpperPart}
        renderMode="svg" // more clear compared to canvas
      >
        {lodash
          .range(1, numPages + 1)
          .map((page) =>
            page > Math.max(0, pageNumber - 4) &&
            page < Math.min(numPages + 1, pageNumber + 4) ? (
              <Page
                key={page}
                scale={scale}
                pageNumber={page}
                onLoadSuccess={removeTextLayerOffset}
                className={styles.page}
                inputRef={pageNumber === page ? activePageRef : null}
                loading=""
                error=""
              ></Page>
            ) : null
          )}
      </Document>
    ) : (
      <p style={{ textAlign: 'center' }}>
        <p style={{ marginTop: '3rem' }}> Click to Choose PDF File </p>

        <p>
          <button
            onClick={() => {
              fileInputRef.current.click();
            }}
            className={styles.chooseFileButton}
          >
            Choose File
          </button>
        </p>

        <p>OR</p>

        <p>Drop the PDF here</p>

        <input
          className={styles.fileDropInput}
          type="file"
          onChange={handleFile}
        ></input>
      </p>
    );
  }
}
