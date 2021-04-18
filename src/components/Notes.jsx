import React from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../provider/NotesContextProvider';
import styles from './Notes.module.css';
function Notes({ pageNum, setLayout }) {
  const {
    saving,
    pageToData,
    deleteNote,
    changedPageContent,
    addNewPage,
  } = useNotes();
  const getValue = () => {
    if (pageToData[pageNum]) {
      return pageToData[pageNum].content;
    } else {
      addNewPage(pageNum);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Notes</p>
        <p>
          <i
            className={'fa fa-expand ' + styles.expandIcon}
            onClick={() => {
              setLayout((layout) => {
                const noteLayout = { ...layout[2] };
                if (noteLayout.w < 4 || noteLayout.h < 4) {
                  noteLayout.px = noteLayout.x;
                  noteLayout.py = noteLayout.y;
                  noteLayout.pw = noteLayout.w;
                  noteLayout.ph = noteLayout.h;
                  noteLayout.w = 4;
                  noteLayout.h = 4;
                } else {
                  if (noteLayout.pw && noteLayout.ph) {
                    noteLayout.w = noteLayout.pw;
                    noteLayout.h = noteLayout.ph;
                    noteLayout.x = noteLayout.px;
                    noteLayout.y = noteLayout.py;
                    delete noteLayout.pw;
                    delete noteLayout.ph;
                  }
                }

                const updatedLayout = [...layout];
                updatedLayout[2] = noteLayout;
                return updatedLayout;
              });
            }}
          ></i>
        </p>
      </div>
      <div className={`${styles.body} non-draggable`}>
        <div className={styles.input}>
          <textarea
            value={getValue()}
            onChange={(e) => {
              changedPageContent(pageNum, e.target.value);
            }}
          ></textarea>
        </div>
        <div className={styles.buttons}>
          <Link to="/all-notes">All Notes</Link>
          {saving ? <p>Saving...</p> : <p></p>}

          <button
            className="danger"
            onClick={() => {
              deleteNote(pageNum);
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notes;
