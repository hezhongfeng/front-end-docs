var maxProfit = function (prices) {
  let max = 0;
  let minPrice = prices[0];
  for (let i = 1; i < prices.length; i++) {
    let currentMax = prices[i] - minPrice;
    if (minPrice > prices[i]) {
      minPrice = prices[i];
    }
    if (max < currentMax) {
      max = currentMax;
    }
  }
  return max;
};
