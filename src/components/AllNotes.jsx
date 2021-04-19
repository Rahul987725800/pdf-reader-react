import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import styles from './AllNotes.module.css';
import { useNotes } from '../provider/NotesContextProvider';
function AllNotes() {
  const {
    saving,
    pageToData,
    deleteNote,
    changedPageContent,
    addNewPage,
    deleteAllNotes,
  } = useNotes();

  const [expandedNotes, setExpandedNotes] = useState([]);
  return (
    <div className={styles.container}>
      <div>
        <Link to="/pdf">
          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Go Back
        </Link>
        {saving && <p className={styles.saving}>Saving Changes ...</p>}
      </div>
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
        <button onClick={deleteAllNotes} className="danger">
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
                    onClick={() => deleteNote(pageNum)}
                  ></i>
                </div>
                <textarea
                  value={pageToData[pageNum].content}
                  onChange={(e) => {
                    changedPageContent(pageNum, e.target.value);
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
