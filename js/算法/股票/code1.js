var maxProfit = function (prices) {
  let max = 0;
  let minPrice = prices[0];
  for (let i = 1; i < prices.length; i++) {
    minPrice = Math.min(minPrice, prices[i]);
    let currentMax = prices[i] - minPrice;
    max = Math.max(max, currentMax);
  }
  return max;
};
