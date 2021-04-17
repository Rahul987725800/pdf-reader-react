import React, { useEffect, useState, useRef } from 'react';
import { firebaseUrl } from '../utils';
import styles from './Notes.module.css';
function Notes({ pageNumber }) {
  const [pageToData, setPageToData] = useState({});
  const [lastEdit, setLastEdit] = useState(new Date());
  const [saving, setSaving] = useState(false);

  const postNote = (pageNumber) => {
    setSaving(true);
    setPageToData((ptd) => {
      const page = { ...ptd[pageNumber] };
      page.updated = false;
      const uptd = { ...ptd };
      uptd[pageNumber] = page;
      return uptd;
    });
    let url;
    let method;
    if (pageToData[pageNumber].key) {
      url = firebaseUrl + 'notes/' + pageToData[pageNumber].key + '.json';
      method = 'PATCH';
      return fetch(url, {
        method,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          content: pageToData[pageNumber].content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setSaving(false);
        })
        .catch((err) => {
          console.log(err);
          setSaving(false);
        });
    } else {
      url = firebaseUrl + 'notes.json/';
      method = 'POST';
      return fetch(url, {
        method,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          pageNumber,
          content: pageToData[pageNumber].content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setPageToData((ptd) => {
            const page = { ...ptd[pageNumber] };
            page.key = data.name;
            const uptd = { ...ptd };
            uptd[pageNumber] = page;
            return uptd;
          });
          setSaving(false);
        })
        .catch((err) => {
          console.log(err);
          setSaving(false);
        });
    }
  };

  useEffect(() => {
    // console.log(pageToData);
    if (pageToData.hasOwnProperty(pageNumber)) return;

    fetch(firebaseUrl + 'notes.json?orderBy="pageNumber"&equalTo=' + pageNumber)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (Object.keys(data).length > 0) {
          const k = Object.keys(data)[0];
          // console.log(pageToData);
          setPageToData((ptd) => {
            return {
              ...ptd,
              [pageNumber]: {
                content: data[k].content,
                updated: false,
                key: k,
              },
            };
          });
        } else {
          setPageToData((ptd) => {
            return {
              ...ptd,
              [pageNumber]: {
                content: '',
                updated: false,
                key: '',
              },
            };
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageNumber, pageToData]);

  const saveAllRef = useRef();
  useEffect(() => {
    setInterval(() => {
      saveAllRef.current.click();
    }, 2000);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>Notes</p>
        <p className="link">All Notes</p>
      </div>
      <div className={`${styles.body} non-draggable`}>
        <button
          ref={saveAllRef}
          onClick={() => {
            if (new Date() - lastEdit > 2000) {
              // console.log(pageToData);
              for (let pageNo in pageToData) {
                if (pageToData[pageNo].updated) {
                  postNote(+pageNo);
                }
              }
            }
          }}
          style={{
            display: 'none',
          }}
        ></button>

        <div className={styles.input}>
          <textarea
            className="scrollBar"
            onChange={(e) => {
              setLastEdit(new Date());
              setPageToData((ptd) => {
                const page = { ...ptd[pageNumber] };
                page.updated = true;
                page.content = e.target.value;
                const uptd = { ...ptd };
                uptd[pageNumber] = page;
                return uptd;
              });
            }}
            value={pageToData[pageNumber]?.content}
          ></textarea>
        </div>
        <div className={styles.buttons}>
          {saving ? <p>Auto Saving...</p> : <p></p>}
          <div>
            <button
              className="success"
              style={{ marginRight: '10px' }}
              onClick={() => postNote(pageNumber)}
            >
              Save
            </button>
            <button
              className="danger"
              onClick={() => {
                setLastEdit(new Date());
                setPageToData((ptd) => {
                  const page = { ...ptd[pageNumber] };
                  page.updated = true;
                  page.content = '';
                  const uptd = { ...ptd };
                  uptd[pageNumber] = page;
                  return uptd;
                });
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notes;
