var maxProfit = function (prices) {
  let sum = 0;
  let min = prices[0];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > min) {
      sum += prices[i] - min;
      min = prices[i];
    } else {
      if (prices[i] < min) {
        min = prices[i];
      }
    }
  }
  return sum;
};
