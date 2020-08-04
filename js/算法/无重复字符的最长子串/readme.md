## 无重复字符的最长子串

```js
给定一个字符串，请你找出其中不含有重复字符的最长子串的长度。

示例 1:

输入: "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

来源：力扣（LeetCode）
[链接](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters)

## 解法

最直接的思路就是暴力解法:

> 遍历字符串，查找以当前字符开头的最长无重复子串，记录下来，然后进行下一个循环

```js
/**
 * @param {string}
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  let maxLength = 0;
  let str = '';
  let tempLength = 0;
  for (let char of s) {
    if (str.indexOf(char) === -1) {
      str += char;
      tempLength = str.length;
      maxLength = maxLength > tempLength ? maxLength : tempLength;
    } else {
      str += char;
      str = str.slice(str.indexOf(char) + 1);
    }
  }
  return maxLength;
};

```
