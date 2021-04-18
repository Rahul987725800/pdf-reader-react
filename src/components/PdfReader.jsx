import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import styles from './PdfReader.module.css';
import { initialLayout } from './Grid';

export default function PdfReader({ pageNumber, setPageNumber, setLayout }) {
  const fileInputRef = useRef();
  const [numPages, setNumPages] = useState(null);

  const [scale, setScale] = useState(1.4);
  const [fileName, setFileName] = useState('No PDF Selected');
  const [pdfFile, setPdfFile] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    if (pdfFile) setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    if (pageNumber === 1) return;
    changePage(-1);
  }

  function nextPage() {
    if (pageNumber === numPages) return;
    changePage(1);
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
      style.margin = '0 auto';
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
  return (
    <div className={styles.container}>
      <div className={styles.navBar}>
        <div className={styles.header}>
          <button
            class={styles.resetLayout}
            onClick={() => setLayout(initialLayout)}
          >
            Reset Layout
          </button>
          <p>{fileName}</p>
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
            >
              Choose File
            </button>
          </div>
          <div>
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
            >
              Previous
            </button>
            &nbsp; &nbsp;
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
          <p>
            Page{' '}
            <input
              className={styles.pageInput}
              value={pdfFile && pageNumber ? pageNumber : ''}
              onChange={(e) => {
                setPageNumber(+e.target.value);
              }}
            ></input>
            &nbsp;/ &nbsp;{numPages || '--'}
          </p>
          <div>
            <label>Zoom:</label>
            <input
              type="range"
              value={scale * 33}
              min={33}
              max={66}
              onChange={(e) => {
                // console.log(+e.target.value / 33);
                setScale(+e.target.value / 33);
              }}
            ></input>
          </div>
        </div>
      </div>
      <div className={styles.documentContainer + ' non-draggable'}>
        <div
          className={styles.arrow + ' ' + styles.prevArrow}
          style={{
            width: `${(10 * 1.5) / scale - 5}%`,
          }}
          onClick={previousPage}
        >
          <i className="fa fa-arrow-left"></i>
        </div>
        {pdfFile ? (
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            className={styles.documentUpperPart}
          >
            <Page
              scale={scale}
              pageNumber={pageNumber}
              onLoadSuccess={removeTextLayerOffset}
              className={styles.page}
            ></Page>
          </Document>
        ) : (
          <p style={{ textAlign: 'center' }}>
            Choose PDF File <br />
            or
            <br /> Drop the PDF here
            <br />
            <input
              className={styles.fileDropInput}
              type="file"
              onChange={handleFile}
              onClick={(e) => {
                e.preventDefault();
              }}
            ></input>
          </p>
        )}

        <div
          className={styles.arrow + ' ' + styles.nextArrow}
          style={{
            width: `${(10 * 1.5) / scale - 5}%`,
          }}
          onClick={nextPage}
        >
          <i className="fa fa-arrow-right"></i>
        </div>
        {/* even after pdf is loaded file drop works  */}
      </div>
    </div>
  );
}
