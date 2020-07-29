var minWindow = function (s, t) {
  let right = s.length - 1;
  let left = right;
  let tCopy = t.split('');
  let DCopy = t.split('');
  let min = '';
  for (let i = s.length - 1; i >= 0; i--) {
    let index = tCopy.indexOf(s[i]);
    if (index === -1) {
      continue;
    }
    right = i;
    for (let j = i; j >= 0; j--) {
      index = tCopy.indexOf(s[j]);
      if (index === -1) {
        continue;
      }
      tCopy.splice(index, 1);
      left = j;

      if (tCopy.length === 0) {
        let minLength = min.length;
        let currentLength = right - left;
        if (minLength === 0 || minLength > currentLength) {
          min = s.slice(left, right + 1);
        }
        tCopy = DCopy.slice();
      }
    }
    tCopy = DCopy.slice();
  }
  return min;
};

console.log(minWindow('cabwefgewcwaefgcf', 'cae'));
