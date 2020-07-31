/*
 * @lc app=leetcode.cn id=567 lang=javascript
 *
 * [567] 字符串的排列
 */

// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
  if (s1.length > s2.length) {
    return false;
  }
  let obj = {};
  for (const char of s1) {
    if (obj[char]) {
      obj[char]++;
    } else {
      obj[char] = 1;
    }
  }
  let s1Length = s1.length;
  for (let start = 0, end = 0; end < s2.length; end++) {
    let char = s2[end];
    // 这一步太关键了，使用下面的循环非常简单的跳过这个间隔
    if (obj[char] === undefined) {
      obj[char] = 0;
    }
    obj[char]--;
    // start向后移动，因为当前char这个字符超过数量了，一直移动到char的数量为0
    while (obj[char] < 0) {
      obj[s2[start]]++;
      start++;
    }
    // 没有超过数量，也没有间隔，长度匹配就可以了
    if (end - start + 1 === s1Length) {
      return true;
    }
  }
  return false;
};

// @lc code=end
