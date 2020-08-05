## 题目描述

你有一个带有四个圆形拨轮的转盘锁。每个拨轮都有 10 个数字： '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' 。每个拨轮可以自由旋转：例如把 '9' 变为   '0'，'0' 变为 '9' 。每次旋转都只能旋转一个拨轮的一位数字。

锁的初始数字为 '0000' ，一个代表四个拨轮的数字的字符串。

列表 deadends 包含了一组死亡数字，一旦拨轮的数字和列表里的任何一个元素相同，这个锁将会被永久锁定，无法再被旋转。

字符串 target 代表可以解锁的数字，你需要给出最小的旋转次数，如果无论如何不能解锁，返回 -1。

示例 1:

```js
输入：deadends = ["0201","0101","0102","1212","2002"], target = "0202"
输出：6
解释：
可能的移动序列为 "0000" -> "1000" -> "1100" -> "1200" -> "1201" -> "1202" -> "0202"。
注意 "0000" -> "0001" -> "0002" -> "0102" -> "0202" 这样的序列是不能解锁的，
因为当拨动到 "0102" 时这个锁就会被锁定。
```

示例 2:

```js
输入: deadends = ["8888"], target = "0009"
输出：1
解释：
把最后一位反向旋转一次即可 "0000" -> "0009"。
```

示例 3:

```js
输入: deadends = ["8887","8889","8878","8898","8788","8988","7888","9888"], target = "8888"
输出：-1
解释：
无法旋转到目标数字且不被锁定。
```

示例 4:

```js
输入: deadends = ["0000"], target = "8888"
输出：-1
```

提示：

1. 死亡列表 deadends 的长度范围为 [1, 500]。
2. 目标数字 target 不会在 deadends 之中。
3. 每个 deadends 和 target 中的字符串的数字会在 10,000 个可能的情况 '0000' 到 '9999' 中产生。

来源：力扣（LeetCode）[链接](https://leetcode-cn.com/problems/open-the-lock)

## 思路

这道题很有意思，有个类似于我们皮箱的那种密码锁，可以通过上下转动转出任意的密码，不过这里有个限制，就是不能通过一些死亡数字，算是给我们增加了一些难度，否则的话就只看密码的数字是大还是小了，例如是 3 的话就从`0->1->2->3`，是 8 的话就`0->9->8`。

我们可以把`0 0 0 0`看做一个原点，然后这 1 个点可以变化出 8 种不同的结果，如下图所示：

![图1](https://i.loli.net/2020/08/05/FKlO71SWD9ygRuY.png)

然后这 8 个点可以继续变化:

![图2](https://i.loli.net/2020/08/05/N54GuE1y6vmFclr.png)

请注意观察上图，其中有 8 种组合又回到了 `0 0 0 0`，还有蓝色部分都是具有重合项的。

那么我们的思路来了，可以利用这种变化，从`0 0 0 0`变化为 8 个点，再继续由先和 8 个点继续变化。。。直到我们找到了目标密码，每变化一次需要旋转一次。

```js
var openLock = function (deadends, target) {
  // 存储所有的原点，最初是 0000
  let nodes = new Set();
  nodes.add('0000');
  // 匹配过的点，比如 0000 这种，对于匹配过的点不会加入到原点集合里面去
  const history = new Set();
  // 初始化旋转次数
  let step = 0;
  // 向上旋转，例如从0->1
  const plus = function (nums, i) {
    let array = nums.split('');
    if (array[i] === '9') {
      array[i] = '0';
    } else {
      array[i] = Number(array[i]) + 1;
    }
    return array.join('');
  };
  // 向下旋转，例如从0->9
  const miuns = function (nums, i) {
    let array = nums.split('');
    if (array[i] === '0') {
      array[i] = '9';
    } else {
      array[i] = Number(array[i]) - 1;
    }
    return array.join('');
  };

  // 原点没有目标密码
  while (!nodes.has(target)) {
    // 新增的原点集合
    const newNodes = new Set();
    // 当前原点集合
    for (const nums of nodes) {
      // 遇到不通的路就跳过
      if (deadends.includes(nums)) {
        continue;
      }
      // 遍历数字，分别做向上和向下旋转
      for (let i = 0; i < nums.length; i++) {
        // 旋转后的结果，把向上和向下旋转后的原点都存储起来
        let result = plus(nums, i);
        // 排除已选择的原点
        if (!history.has(result) && !newNodes.has(result)) {
          newNodes.add(result);
        }
        result = miuns(nums, i);
        if (!history.has(result) && !newNodes.has(result)) {
          newNodes.add(result);
        }
      }
      // 已检查过的原点
      history.add(nums);
    }
    step++;
    // 新生成的原点集合，下一轮将对这些原点进行旋转
    nodes = newNodes;
    // 这里很关键，最后可能收敛没了
    if (nodes.size === 0) {
      return -1;
    }
  }

  return step;
};
```

经过测试结果如下：

- 43/43 cases passed (652 ms)
- Your runtime beats 33.05 % of javascript submissions
- Your memory usage beats 72.41 % of javascript submissions (48.8 MB)

结果正确，但好像运行时间有点长，哪里可以优化呢？

我们目前的思路是由一个原点慢慢扩散到终点，也就是目标密码。就像是向水面扔了一颗石子，激起了一圈的涟漪，然后这圈涟漪最终碰到了我们的目标，那么如果我同时在目标处扔一个石子，让两个涟漪互相靠近，这样是不是会快很多呢？直觉告诉我肯定会快很多，而且，涟漪不需要扩散得很大就可以发现目标，我们来试一下

```js
var openLock = function (deadends, target) {
  // 存储所有的原点，最初是 0000
  let nodes = new Set();
  nodes.add('0000');
  // 目标原点
  let targetNodes = new Set();
  targetNodes.add(target);
  // 匹配过的点，比如 0000 这种，对于匹配过的点不会加入到原点集合里面去
  const history = new Set();
  // 初始化旋转次数
  let step = 0;
  // 向上旋转，例如从0->1
  const plus = function (nums, i) {
    let array = nums.split('');
    if (array[i] === '9') {
      array[i] = '0';
    } else {
      array[i] = Number(array[i]) + 1;
    }
    return array.join('');
  };
  // 向下旋转，例如从0->9
  const miuns = function (nums, i) {
    let array = nums.split('');
    if (array[i] === '0') {
      array[i] = '9';
    } else {
      array[i] = Number(array[i]) - 1;
    }
    return array.join('');
  };

  // 原点没有目标密码
  while (nodes.size > 0 && targetNodes.size > 0) {
    // 新增的原点集合
    const newNodes = new Set();
    // 当前原点集合
    for (const nums of nodes) {
      // 遇到不通的路就跳过
      if (deadends.includes(nums)) {
        continue;
      }
      // 相遇
      if (targetNodes.has(nums)) {
        return step;
      }
      // 遍历数字，分别做向上和向下旋转
      for (let i = 0; i < nums.length; i++) {
        // 旋转后的结果，把向上和向下旋转后的原点都存储起来
        let result = plus(nums, i);
        // 排除已选择的原点
        if (!history.has(result) && !newNodes.has(result)) {
          newNodes.add(result);
        }
        result = miuns(nums, i);
        if (!history.has(result) && !newNodes.has(result)) {
          newNodes.add(result);
        }
      }
      // 已检查过的原点
      history.add(nums);
    }
    step++;
    // 交换集合，下一轮对targetNodes进行检查
    nodes = targetNodes;
    // 新生成的原点集合，下下一轮将对这些原点进行旋转
    targetNodes = newNodes;
  }

  // 没有结果
  return -1;
};
```

代码稍加改动的结果：

- 43/43 cases passed (208 ms)
- Your runtime beats 80 % of javascript submissions
- Your memory usage beats 100 % of javascript submissions (44.2 MB)

借用斯温(DOTA 英雄)的一句名言：『这下牛 b 了』，运行时间和所占内存都上了一个台阶

最近在看算法方面的内容，碰到有趣的就分享一下，会持续分享
