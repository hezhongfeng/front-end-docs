const debounce = function (func, timeout) {
  let timer;
  return function () {
    let _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.call(_this);
      timer = null;
    }, timeout);
  };
};
