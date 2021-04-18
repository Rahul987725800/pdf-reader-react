import React, { useState, useEffect, useRef } from 'react';
import { Debounce, getDicUrl } from '../utils';
import lodash from 'lodash';
import styles from './Dictionary.module.css';
function Dictionary() {
  const setSelection = useRef(
    new Debounce(() => {
      // console.log('called');
      setWord(document.getSelection().toString());
    }, 1000)
  );
  const fetchWord = useRef(
    new Debounce((word) => {
      fetch(getDicUrl(word))
        .then((result) => result.json())
        .then((data) => {
          // console.log(data);
          // console.log(typeof data[0]);
          if (typeof data[0] === 'string') {
            setSuggestedWords(
              data.map((val) => {
                return {
                  val,
                  active: false,
                };
              })
            );
          } else {
            const shortDefs = data.map((meaning) => meaning.shortdef);
            // console.log(shortDefs);
            setMeanings(lodash.flatten(shortDefs));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500)
  );
  const [word, setWord] = useState('');
  const [meanings, setMeanings] = useState([]);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const [showSuggestedWords, setShowSuggestedWords] = useState(true);
  const suggestionOptionsRef = useRef();
  useEffect(() => {
    document.onselectionchange = () => {
      if (document.getSelection().toString()) {
        setSelection.current.call();
      }
    };
  }, []);
  useEffect(() => {
    setShowSuggestedWords(true);
    setSuggestedWords([]);
    setMeanings([]);
    fetchWord.current.call(word);
  }, [word]);
  const inputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestedWords((sws) => {
        let activeIdx;
        for (let i = 0; i < sws.length; i++) {
          if (sws[i].active) {
            activeIdx = i;
            break;
          }
        }

        if (activeIdx === undefined || activeIdx === sws.length - 1) {
          activeIdx = 0;
        } else {
          activeIdx++;
        }
        return sws.map((sw, i) => {
          if (i === activeIdx) {
            const child = suggestionOptionsRef.current?.children?.[i];
            suggestionOptionsRef.current?.scrollTo(0, child.offsetTop - 5 * 33);
            return { ...sw, active: true };
          }

          return { ...sw, active: false };
        });
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestedWords((sws) => {
        let activeIdx;
        for (let i = 0; i < sws.length; i++) {
          if (sws[i].active) {
            activeIdx = i;
            break;
          }
        }

        if (activeIdx === undefined || activeIdx === 0) {
          activeIdx = sws.length - 1;
        } else {
          activeIdx--;
        }
        return sws.map((sw, i) => {
          if (i === activeIdx) {
            const child = suggestionOptionsRef.current?.children?.[i];
            suggestionOptionsRef.current?.scrollTo(0, child.offsetTop - 5 * 33);
            return { ...sw, active: true };
          }

          return { ...sw, active: false };
        });
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const currentlyActive = suggestedWords.find((sw) => sw.active);
      if (currentlyActive) {
        setWord(currentlyActive.val);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestedWords(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentlyActive = suggestedWords.find((sw) => sw.active);
      if (currentlyActive) {
        setWord(currentlyActive.val);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.upper}>
        <div className={styles.header}>
          <p>Dictionary</p>
          <button
            className="info"
            onClick={() => {
              if (word) {
                if (word.length < 20) {
                  window.open(
                    `https://www.google.com/search?q=meaning+of+${word}&rlz=1C1CHBF_enIN863IN863&oq=meaning+of+rigr&aqs=chrome.1.69i57j0l7.22150j1j7&sourceid=chrome&ie=UTF-8`,
                    '_blank'
                  );
                } else {
                  window.open(
                    `https://www.google.com/search?q=${word}&rlz=1C1CHBF_enIN863IN863&oq=meaning+of+rigr&aqs=chrome.1.69i57j0l7.22150j1j7&sourceid=chrome&ie=UTF-8`,
                    '_blank'
                  );
                }
              }
            }}
            disabled={word.length === 0}
          >
            <i className="fa fa-search" aria-hidden="true"></i> Search Web
          </button>
        </div>
        <div className={styles.userInput + ' non-draggable'}>
          <div>
            <div className={styles.inputBox}>
              <input
                onChange={(e) => setWord(e.target.value)}
                value={word}
                onKeyDown={inputKeyDown}
                onBlur={() => {
                  // this is done to not close immediately even
                  // when user clicks on suggestion to select it
                  setTimeout(() => {
                    setShowSuggestedWords(false);
                  }, 200);
                }}
                onFocus={() => {
                  setShowSuggestedWords(true);
                }}
              ></input>
              <p onClick={() => setWord('')}>&#10005;</p>
            </div>
          </div>
          {showSuggestedWords && suggestedWords.length > 0 && (
            <div className={styles.dropdown}>
              <div className={styles.arrowUp}></div>
              <div className={styles.suggestionsBox} ref={suggestionOptionsRef}>
                {suggestedWords.map((suggest, i) => (
                  <p
                    key={suggest.val + i}
                    className={suggest.active ? styles.active : ''}
                    onClick={() => {
                      // console.log(suggest);
                      setWord(suggest.val);
                    }}
                  >
                    {suggest.val}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.lower + ' non-draggable scrollBar'}>
        {suggestedWords.length === 0 &&
          meanings.map((mean, i) => <p key={mean + i}>{mean}</p>)}
      </div>
    </div>
  );
}

export default Dictionary;
