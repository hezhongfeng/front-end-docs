var minWindow = function (s, t) {
  // 左右指针
  let right = s.length - 1;
  let left = right;
  let min = '';
  // 字符计数
  const map = {};
  let typeCount = 0;

  for (const iterator of t) {
    if (map[iterator] !== undefined) {
      map[iterator]++;
    } else {
      map[iterator] = 1;
      typeCount++;
    }
  }

  for (let i = s.length - 1; i >= 0; i--) {
    if (map[s[i]] !== undefined) {
      map[s[i]]--;
      if (map[s[i]] === 0) {
        typeCount--;
      }
    }

    if (typeCount === 0) {
      left = i;

      while (typeCount === 0) {
        if (!min) {
          min = s.slice(left, right + 1);
        } else {
          min = min.length > right - left + 1 ? s.slice(left, right + 1) : min;
        }
        let rightChar = s[right];
        if (map[rightChar] !== undefined) {
          map[rightChar]++;
          if (map[rightChar] > 0) {
            typeCount++;
          }
        }
        right--;
      }
    }
  }
  return min;
};

console.log(minWindow('aabaabaaab', 'bb')); // baab
console.log(minWindow('abcabdebac', 'cda')); // cabd
console.log(minWindow('acbbaca', 'aba')); // baca
