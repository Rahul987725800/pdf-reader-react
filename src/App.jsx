import React, { useState } from 'react';
import Dictionary from './components/Dictionary';
import PdfReader from './components/PdfReader';
import styles from './App.module.css';
import Notes from './components/Notes';
export const WordContext = React.createContext();
function App() {
  const [pageNumber, setPageNumber] = useState(1);
  return (
    <div className={styles.container}>
      <div className={styles.reader}>
        <PdfReader pageNumber={pageNumber} setPageNumber={setPageNumber} />
      </div>
      <div>
        <div className={styles.dictionary}>
          <Dictionary />
        </div>
        <div className={styles.notes}>
          <Notes pageNumber={pageNumber} />
        </div>
      </div>
    </div>
  );
}

export default App;
