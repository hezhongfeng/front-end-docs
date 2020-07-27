/**
 * @param {number} n
 * @return {string[][]}
 */
const backtrack = function (array, queens, result) {
  // 结束的标识是皇后分配完毕
  if (queens.length === 0) {
    let newArray = [];
    for (const line of array) {
      newArray.push(line.join(''));
    }
    result.push(newArray);
    return;
  }
  const length = array.length;

  for (let i = length - queens.length; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      // 这列没有Q
      let column = false;
      // 左上角没有Q
      let left = false;
      // 右上角没有Q
      let right = false;

      // 检查这列是否有Q
      for (let k = 0; k < i; k++) {
        if (array[k][j] === 'Q') {
          column = true;
          break;
        }
      }

      if (column) {
        continue;
      }

      // 检查左上角是否有Q
      let m = i - 1;
      let n = j - 1;

      while (m >= 0 && n >= 0) {
        if (array[m][n] === 'Q') {
          left = true;
          break;
        }
        m--;
        n--;
      }

      if (left) {
        continue;
      }

      // 检查右上角是否有Q
      m = i - 1;
      n = j + 1;

      while (m >= 0 && n <= length - 1) {
        if (array[m][n] === 'Q') {
          right = true;
          break;
        }
        m--;
        n++;
      }

      if (right) {
        continue;
      }

      // 满足所有条件的时候填入Q
      array[i][j] = queens.pop();
      backtrack(array, queens, result);
      // 复原
      queens.push('Q');
      array[i][j] = '.';
    }
    // 如果这一行都没填上Q的话就是失败了
    if (array[i].indexOf('Q') === -1) {
      return;
    }
  }
};

var solveNQueens = function (n) {
  // 准备好棋盘
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(new Array(n).fill('.'));
  }
  // 皇后
  const queens = new Array(n).fill('Q');
  // 结果
  const result = [];
  backtrack(array, queens, result);
  return result;
};

console.log(solveNQueens(4));
