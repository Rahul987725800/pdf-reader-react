export class Debounce {
  callback;
  delay;
  timeOut;
  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
  }
  call(...args) {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => this.callback(...args), this.delay);
  }
}
export const getDicUrl = (word) => {
  return `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${process.env.REACT_APP_DICTIONARY_KEY}`;
};
export const firebaseUrl = process.env.REACT_APP_FIREBASE_URL;
export const percent = (val, percent) => {
  return (val * percent) / 100;
};
export const returnDiffentFalsyValue = (val) => {
  let falsyValues = ['', 0, null, undefined];
  for (let v of falsyValues) {
    if (v !== val) {
      return v;
    }
  }
};
export const truncate = (fileName, len) => {
  return (
    [...fileName].splice(0, len).join('') + (fileName.length > len ? '..' : '')
  );
};
