import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../provider/LoginContextProvider';
import MyLoader from '../shared/MyLoader';
import { firebaseUrl } from '../utils';
import styles from './Books.module.css';
function Books({ history }) {
  const { loginState } = useLogin();
  const [fetchedBooks, setFetchedBooks] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const url = `${firebaseUrl}users/${loginState.userId}/books.json`;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const books = [];
        for (let book in data) {
          books.push(book);
        }
        setFetchedBooks(books);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className={styles.container}>
      {loading && <MyLoader right />}
      <div>
        <Link onClick={() => history.goBack()}>
          <i className="fa fa-arrow-left"></i>&nbsp;&nbsp;Go Back
        </Link>
      </div>
      <h1 className="headerTop">Books</h1>
      <h6 className="headerSecond">Click to view notes</h6>
      <div className={styles.books}>
        {fetchedBooks && fetchedBooks.length ? (
          fetchedBooks.map((book) => (
            <li key={book}>
              <Link to={`notes/${book}`}>{book}</Link>
            </li>
          ))
        ) : (
          <h2>No Books saved</h2>
        )}
      </div>
    </div>
  );
}

export default Books;
