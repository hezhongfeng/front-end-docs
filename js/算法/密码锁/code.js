var openLock = function (deadends, target) {
  let nodes = new Set();
  nodes.add('0000');
  let history = new Set();
  let step = 0;
  const plus = function (nums, i) {
    let value = nums.split('');
    if (value[i] === '9') {
      value[i] = '0';
    } else {
      value[i] = Number(value[i]) + 1;
    }
    return value.join('');
  };
  const miuns = function (nums, i) {
    let value = nums.split('');
    if (value[i] === '0') {
      value[i] = '9';
    } else {
      value[i] = Number(value[i]) - 1;
    }
    return value.join('');
  };

  while (!nodes.has(target)) {
    // 当前新增的所有叶子节点
    let newNodes = new Set();
    for (const nums of nodes) {
      // 遇到不停的路就跳过
      if (deadends.includes(nums)) {
        continue;
      }
      for (let i = 0; i < nums.length; i++) {
        let value = plus(nums, i);
        if (!newNodes.has(value) && !history.has(value)) {
          newNodes.add(value);
        }
        value = miuns(nums, i);
        if (!newNodes.has(value) && !history.has(value)) {
          newNodes.add(value);
        }
      }
      history.add(nums);
    }
    step++;
    nodes = newNodes;
    // 这里很关键，居然是收敛没了
    if (nodes.size === 0) {
      return -1;
    }
  }

  return step;
};

console.log(openLock(['8887', '8889', '8878', '8898', '8788', '8988', '7888', '9888'], '8888'));
