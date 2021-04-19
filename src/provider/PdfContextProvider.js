import React, { useContext, useEffect, useState } from 'react';
const PdfContext = React.createContext();
export const usePdf = () => useContext(PdfContext);
const initialLayout = [
  { i: 'a', x: 0, y: 0, w: 4, h: 4 },
  { i: 'b', x: 3, y: 0, w: 1, h: 2, minH: 2 },
  { i: 'c', x: 3, y: 2, w: 1, h: 2 },
];
export const PdfProvider = ({ children }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState();
  const [layout, setLayout] = useState(initialLayout);
  const [scale, setScale] = useState(1.3);
  const [fileName, setFileName] = useState('No PDF Selected');
  const [pdfFile, setPdfFile] = useState(null);
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
  };
  return (
    <PdfContext.Provider value={exportedValues}>{children}</PdfContext.Provider>
  );
};
