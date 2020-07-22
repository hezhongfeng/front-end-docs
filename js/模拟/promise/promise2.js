class MyPromise {
  constructor(handle) {
    // 添加状态
    this.status = 'PENDING';
    // Promise resolve时的回调
    this.resolvedCallback = null;
    // Promise reject时的回调
    this.ejectedCallback = null;

    // 执行handle
    try {
      handle(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }

  // 添加resovle时执行的函数
  resolve(value) {
    this.status = 'FULFILLED';
    setTimeout(() => {
      this.resolvedCallback(value);
    }, 0);
  }

  // 添加reject时执行的函数
  reject(err) {
    this.status = 'REJECTED';
    setTimeout(() => {
      this.rejectedCallback(err);
    }, 0);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  this.resolvedCallback = onResolved;
  this.rejectedCallback = onRejected;
};

new MyPromise(function (resolve, reject) {
  resolve('success');
  console.log('MyPromise');
}).then(
  function (value) {
    console.log(value);
  },
  function (value) {
    console.log('fail', value);
  }
);
