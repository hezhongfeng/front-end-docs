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
      // 注意这里需要bind下，不然resolve里面的this有问题
      handle(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }

  // 添加resovle时执行的函数
  resolve(value) {
    this.status = 'FULFILLED';
    this.resolvedCallback(value);
  }

  // 添加reject时执行的函数
  reject(err) {
    this.status = 'REJECTED';
    this.rejectedCallback(err);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  this.resolvedCallback = onResolved;
  this.rejectedCallback = onRejected;
};

new MyPromise(function (resolve) {
  setTimeout(() => {
    resolve('success');
  }, 100);
  console.log('MyPromise');
}).then(
  function (value) {
    console.log(value);
  },
  function () {
    console.log('fail');
  }
);
