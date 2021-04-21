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
  return `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=b0fbbe0b-fa8c-4b29-a68d-c452c64d2ea9`;
};
export const firebaseUrl =
  'https://pdfreader-93a01-default-rtdb.firebaseio.com/';
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
