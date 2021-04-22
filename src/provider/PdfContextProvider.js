import React, { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Debounce } from '../utils';
const PdfContext = React.createContext();
export const usePdf = () => useContext(PdfContext);
const largeLayout = [
  { i: 'a', x: 0, y: 0, w: 3, h: 4 },
  { i: 'b', x: 3, y: 0, w: 1, h: 2, minH: 2 },
  { i: 'c', x: 3, y: 2, w: 1, h: 2 },
];
const midLayout = [
  { i: 'a', x: 0, y: 0, w: 4, h: 4 },
  { i: 'b', x: 0, y: 4, w: 2, h: 2, minH: 2 },
  { i: 'c', x: 2, y: 4, w: 2, h: 2 },
];
const smallLayout = [
  { i: 'a', x: 0, y: 0, w: 4, h: 4 },
  { i: 'b', x: 0, y: 4, w: 4, h: 4, minH: 2 },
  { i: 'c', x: 0, y: 8, w: 4, h: 4 },
];
export const PdfProvider = ({ children }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [initialLayout, setInitialLayout] = useState(largeLayout);
  const [layout, setLayout] = useState(initialLayout);
  const [scale, setScale] = useState(1);
  const [fileName, setFileName] = useState('No PDF Selected');
  const [pdfFile, setPdfFile] = useState(null);
  const [programaticScroll, setProgramaticScroll] = useState(false);
  useEffect(() => {
    const decideLayout = new Debounce(() => {
      setLayout(null);
      if (window.innerWidth >= 900) {
        setLayout(largeLayout);
        setInitialLayout(largeLayout);
      } else if (window.innerWidth > 600 && window.innerWidth < 900) {
        setLayout(midLayout);
        setInitialLayout(midLayout);
      } else {
        setLayout(smallLayout);
        setInitialLayout(smallLayout);
      }
    }, 500);
    decideLayout.call();
    window.onresize = () => decideLayout.call();
  }, []);
  useEffect(() => {
    setPageNumber(1);
  }, [pdfFile]);
  const exportedValues = {
    fileName,
    setFileName,
    pdfFile,
    setPdfFile,
    numPages,
    setNumPages,
    scale,
    setScale,
    pageNumber,
    setPageNumber,
    layout,
    setLayout,
    initialLayout,
    programaticScroll,
    setProgramaticScroll,
  };
  return (
    <PdfContext.Provider value={exportedValues}>{children}</PdfContext.Provider>
  );
};
