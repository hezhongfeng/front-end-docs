var search = function (nums, target) {
  let left = 0;
  let right = nums.length;
  let mid = null;

  while (left < right) {
    mid = parseInt((left + right) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      if (left === mid) {
        left++;
      } else {
        left = mid;
      }
    } else if (nums[mid] > target) {
      if (right === mid) {
        left--;
      } else {
        right = mid;
      }
    }
  }
  return -1;
};