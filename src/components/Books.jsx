import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { useLogin } from '../provider/LoginContextProvider';
import { firebaseUrl } from '../utils';
import styles from './Books.module.css';
function Books({ history }) {
  const { loginState } = useLogin();
  const [fetchedBooks, setFetchedBooks] = useState();
  useEffect(() => {
    const url = `${firebaseUrl}users/${loginState.userId}/books.json`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const books = [];
        for (let book in data) {
          books.push(book);
        }
        setFetchedBooks(books);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className={styles.container}>
      <div>
        <Link onClick={() => history.goBack()}>
          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Go Back
        </Link>
      </div>

      <h1 className="headerTop">Books</h1>
      <h6 className="headerSecond">Click to view notes</h6>
      <div className={styles.books}>
        {fetchedBooks &&
          fetchedBooks.map((book) => (
            <li key={book}>
              <Link to={`notes/${book}`}>{book}</Link>
            </li>
          ))}
      </div>
    </div>
  );
}

export default Books;
