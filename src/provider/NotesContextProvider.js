import React, { useContext, useState, useEffect } from 'react';
import { Debounce, firebaseUrl } from '../utils';
import { useLogin } from './LoginContextProvider';
import { usePdf } from './PdfContextProvider';
const NotesContext = React.createContext();

export const useNotes = () => {
  return useContext(NotesContext);
};
export const NotesProvider = ({ children }) => {
  const { fileName } = usePdf();
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
    if (pageToData[pageNumber].key) {
      url = `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes/${pageToData[pageNumber].key}.json`;
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
      // console.log(loginState.userId);
      url = `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes.json`;
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
  const deleteNote = (pageNumber) => {
    let url;
    let method;
    if (pageToData[pageNumber].key) {
      url = `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes/${pageToData[pageNumber].key}.json`;
      method = 'DELETE';
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
    } else {
      setPageToData((ptd) => {
        const uptd = { ...ptd };
        delete uptd[pageNumber];
        return uptd;
      });
    }
  };

  const fetchData = () => {
    console.log('fetching data');
    fetch(
      `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes.json`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data) {
          const pageToD = {};
          Object.keys(data).forEach((key) => {
            let pnum = data[key].pageNumber;
            pageToD[data[key].pageNumber] = {
              key,
              content: data[key].content,
              update: new Debounce((pageToData, fileName, loginState) => {
                postNote(pnum, pageToData, fileName, loginState);
              }, 1000),
            };
          });
          setPageToData(pageToD);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteAllNotes = () => {
    fetch(
      `${firebaseUrl}users/${loginState.userId}/books/${fileName}/notes.json`,
      { method: 'DELETE' }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPageToData({});
      })
      .then((err) => console.log(err));
  };
  const changedPageContent = (pageNum, value) => {
    setPageToData((ptd) => {
      const page = { ...ptd[pageNum] };
      page.content = value;
      const uptd = { ...ptd };
      uptd[pageNum] = page;
      page.update.call(uptd, fileName, loginState);
      return uptd;
    });
  };
  const addNewPage = (pageNum) => {
    setPageToData((ptd) => {
      const uptd = { ...ptd };
      uptd[pageNum] = {
        key: '',
        content: '',
        update: new Debounce((pageToData, fileName, loginState) => {
          postNote(pageNum, pageToData, fileName, loginState);
        }, 1000),
      };
      return uptd;
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
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
