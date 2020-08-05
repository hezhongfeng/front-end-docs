/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
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

console.log(openLock(['8887', '8889', '8878', '8898', '8788', '8988', '7888', '9888'], '8888'));
