/**
 * 实际上，无论是几次交易，我们想要的就是收益的最大值
 * 那么，可以将最大两次交易看成是一次交易
 * 即上一个交易的收益和这次的买入价格融合在一起
 */
var maxProfit = function (prices) {
  let min1 = null;
  let min2 = null;
  let max1 = 0;
  let max2 = 0;
  for (const price of prices) {
    if (min1 === null) {
      min1 = price;
      min2 = price;
      continue;
    } else {
      // 当前遇到的最低价
      min1 = Math.min(min1, price);
    }
    // 当前为止，第一次交易赚的钱的最大值
    max1 = Math.max(max1, price - min1);
    // 综合情况当前买入的最低价
    min2 = Math.min(min2, price - max1);
    max2 = Math.max(max2, price - min2);
  }
  return max2;
};

maxProfit([3, 3, 5, 0, 0, 3, 1, 4]);
