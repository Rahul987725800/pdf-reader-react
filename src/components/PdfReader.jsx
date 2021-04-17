import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';

import book from '../book.pdf';

export default function PdfReader({ pageNumber, setPageNumber }) {
  const [numPages, setNumPages] = useState(null);

  const [scale, setScale] = useState(1.4);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
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
    });
  }

  return (
    <div>
      <div>
        <p>
          Page{' '}
          <input
            value={pageNumber}
            onChange={(e) => setPageNumber(+e.target.value)}
          ></input>{' '}
          of {numPages || '--'}
        </p>
        <button type="button" disabled={pageNumber <= 1} onClick={previousPage}>
          Previous
        </button>
        <button
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Next
        </button>
        <input
          type="range"
          value={scale * 33}
          min={33}
          max={99}
          onChange={(e) => {
            // console.log(+e.target.value / 33);
            setScale(+e.target.value / 33);
          }}
        ></input>
      </div>
      <div className="non-draggable">
        <Document file={book} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            scale={scale}
            pageNumber={pageNumber}
            onLoadSuccess={removeTextLayerOffset}
          />
        </Document>
      </div>
    </div>
  );
}
