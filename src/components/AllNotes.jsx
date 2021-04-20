import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import styles from './AllNotes.module.css';
import { useNotes } from '../provider/NotesContextProvider';
import { usePdf } from '../provider/PdfContextProvider';
function AllNotes({ history }) {
  const {
    saving,
    pageToData,
    deleteNote,
    changedPageContent,
    addNewPage,
    deleteAllNotes,
    fetchData,
  } = useNotes();
  const [localFileName, setLocalFileName] = useState();

  const { fileName } = usePdf();
  useEffect(() => {
    // console.log(history);
    const path = history.location.pathname.split('/');
    // console.log(path);
    const bookName = path[path.length - 1];
    if (bookName !== 'notes' && path.length === 3) {
      setLocalFileName(bookName);
      fetchData(bookName);
    } else {
      setLocalFileName(fileName);
    }
  }, []);
  const [expandedNotes, setExpandedNotes] = useState([]);
  return (
    <div className={styles.container}>
      <div>
        <Link onClick={() => history.goBack()}>
          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Go Back
        </Link>
        {saving && <p className={styles.saving}>Saving Changes ...</p>}
      </div>
      <h1 className="headerTop">{localFileName}</h1>
      <div className={styles.options}>
        <button
          onClick={() => {
            const page = +prompt('For which page you want to add the note?');
            if (page) {
              addNewPage(page);
            }
          }}
          className="success"
        >
          Add New
        </button>
        <button
          onClick={() => deleteAllNotes(localFileName)}
          className="danger"
        >
          Delete All
        </button>
      </div>
      <div className={styles.notesGrid}>
        {Object.keys(pageToData).map((pageNum) => {
          return (
            (!pageToData[pageNum].addedByState ||
              pageToData[pageNum].content) && (
              <div key={pageNum} className={styles.note}>
                <div className={styles.page}>
                  {!isMobile && (
                    <i
                      className={'fa fa-expand ' + styles.expandNote}
                      onClick={() => {
                        setExpandedNotes((enotes) => {
                          if (enotes.includes(pageNum)) {
                            return enotes.filter((page) => page !== pageNum);
                          } else {
                            return [pageNum, ...enotes];
                          }
                        });
                      }}
                    ></i>
                  )}
                  {pageNum}{' '}
                  <i
                    className={'fa fa-trash ' + styles.deleteNote}
                    onClick={() => deleteNote(pageNum, localFileName)}
                  ></i>
                </div>
                <textarea
                  value={pageToData[pageNum].content}
                  onChange={(e) => {
                    changedPageContent(pageNum, e.target.value, localFileName);
                  }}
                  style={{
                    width:
                      expandedNotes.includes(pageNum) || isMobile
                        ? '90vw'
                        : '25vw',
                    height:
                      expandedNotes.includes(pageNum) || isMobile
                        ? '70vh'
                        : '30vh',
                  }}
                ></textarea>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default AllNotes;
