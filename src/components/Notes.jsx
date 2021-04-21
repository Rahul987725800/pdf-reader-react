import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../provider/NotesContextProvider';
import { usePdf } from '../provider/PdfContextProvider';
import { truncate } from '../utils';
import styles from './Notes.module.css';
function Notes() {
  const {
    pageToData,
    deleteNote,
    changedPageContent,
    addNewPage,
    fetchData,
  } = useNotes();
  const { pageNumber, setLayout, fileName } = usePdf();

  useEffect(() => {
    fetchData(fileName);
  }, [fileName]);
  const getValue = () => {
    if (pageToData[pageNumber]) {
      return pageToData[pageNumber].content;
    } else {
      addNewPage(pageNumber, true);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Notes for Page {pageNumber}</p>
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
              changedPageContent(pageNumber, e.target.value, fileName);
            }}
          ></textarea>
        </div>
        <div className={styles.buttons}>
          <Link to="/notes">Other Notes for {truncate(fileName, 10)}</Link>
          {/* {saving ? <p>Saving...</p> : <p></p>} */}

          <button
            className="danger"
            onClick={() => {
              deleteNote(pageNumber, fileName);
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
