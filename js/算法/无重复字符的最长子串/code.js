/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string}
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let left = 0;
  let right = 0;
  let obj = {};
  let max = 0;
  for (; right < s.length; right++) {
    if (obj[s[right]] === undefined) {
      obj[s[right]] = 0;
    }
    obj[s[right]]++;
    while (obj[s[right]] > 1) {
      obj[s[left]]--;
      left++;
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
};

// @lc code=end
