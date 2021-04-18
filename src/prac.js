let falsyValues = ['', 0, null, undefined];
const returnDiffentFalsyValue = (val) => {
  for (let v of falsyValues) {
    if (v !== val) {
      return v;
    }
  }
};
for (let i = 0; i < falsyValues.length; i++) {
  for (let j = i + 1; j < falsyValues.length; j++) {
    if (falsyValues[i] === falsyValues[j]) {
      console.log('equal');
    }
  }
}
