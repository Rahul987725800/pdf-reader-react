import React, { useContext, useState } from 'react';
import { Debounce, firebaseUrl } from '../utils';
import { useLogin } from './LoginContextProvider';
const NotesContext = React.createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};
export const NotesProvider = ({ children }) => {
  const { loginState } = useLogin();
  const [pageToData, setPageToData] = useState({});
  const [saving, setSaving] = useState(false);

  const postNote = (pageNumber, pageToData, fileName, loginState) => {
    // console.log('called with page num ' + pageNumber);
    // console.log(pageToData);
    // return;
    setSaving(true);
    let url;
    let method;

    url = `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes/${pageNumber}.json`;
    method = 'PUT';
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
  };
  const deleteNote = (pageNumber, fileName) => {
    let url = `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes/${pageNumber}.json`;
    let method = 'DELETE';
    return fetch(url, {
      method,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setPageToData((ptd) => {
          const uptd = { ...ptd };
          delete uptd[pageNumber];
          return uptd;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchData = (fileName) => {
    console.log('fetching data ' + fileName);

    fetch(
      `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes.json`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data) {
          const pageToD = {};
          for (let page in data) {
            const obj = data[page];
            if (obj) {
              const content = obj.content;
              // console.log(page);
              // console.log(content);
              pageToD[page] = {
                content,
                update: new Debounce((pageToData, fileName, loginState) => {
                  postNote(page, pageToData, fileName, loginState);
                }, 1000),
              };
            }
          }
          setPageToData(pageToD);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteAllNotes = (fileName) => {
    fetch(
      `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes.json`,
      { method: 'DELETE' }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setPageToData({});
      })
      .then((err) => console.log(err));
  };
  const changedPageContent = (pageNum, value, fileName) => {
    setPageToData((ptd) => {
      const page = { ...ptd[pageNum] };
      page.content = value;
      const uptd = { ...ptd };
      uptd[pageNum] = page;
      page.update.call(uptd, fileName, loginState);
      return uptd;
    });
  };
  const addNewPage = (pageNum, addedByState = false) => {
    setPageToData((ptd) => {
      const uptd = { ...ptd };
      uptd[pageNum] = {
        content: '',
        update: new Debounce((pageToData, fileName, loginState) => {
          postNote(pageNum, pageToData, fileName, loginState);
        }, 1000),
        addedByState,
      };
      return uptd;
    });
  };

  const exportedValues = {
    pageToData,
    setPageToData,
    saving,
    setSaving,
    postNote,
    deleteNote,
    fetchData,
    changedPageContent,
    addNewPage,
    deleteAllNotes,
  };
  return (
    <NotesContext.Provider value={exportedValues}>
      {children}
    </NotesContext.Provider>
  );
};
