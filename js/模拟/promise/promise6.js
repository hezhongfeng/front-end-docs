// 判断变量否为function
const isFunction = variable => typeof variable === 'function';

class MyPromise {
  constructor(handle) {
    // 添加状态
    this.status = 'PENDING';
    // Promise resolve时的回调
    this.resolvedCallback = null;
    // Promise reject时的回调
    this.rejectedCallback = null;

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
      if (this.resolvedCallback) {
        this.resolvedCallback(value);
      }
    }, 0);
  }

  // 添加reject时执行的函数
  reject(err) {
    this.status = 'REJECTED';
    setTimeout(() => {
      if (this.rejectedCallback) {
        this.rejectedCallback(err);
      }
    }, 0);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  const newPromise = new MyPromise((resolve, reject) => {
    const resolved = value => {
      try {
        const res = onResolved(value);
        if (res instanceof MyPromise) {
          res.then(resolve, reject);
        } else {
          resolve(res);
        }
      } catch (error) {
        reject(error);
      }
    };

    const rejected = error => {
      try {
        if (!isFunction(onRejected)) {
          reject(error);
          return;
        }
        const res = onRejected(error);
        if (res instanceof MyPromise) {
          res.then(resolve, reject);
        } else {
          reject(res);
        }
      } catch (error) {
        reject(error);
      }
    };
    this.resolvedCallback = resolved;
    this.rejectedCallback = rejected;
  });
  return newPromise;
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

MyPromise.prototype.finally = function (fn) {
  return this.then(
    value => {
      fn();
      return value;
    },
    reason => {
      fn();
      throw reason;
    }
  );
};

MyPromise.all = function (promiseArr) {
  return new MyPromise((resolve, reject) => {
    let result = [];

    promiseArr.forEach((promise, index) => {
      promise.then(value => {
        result[index] = value;

        if (result.length === promiseArr.length) {
          resolve(result);
        }
      }, reject);
    });
  });
};

MyPromise.race = function (promiseArr) {
  return new MyPromise((resolve, reject) => {
    promiseArr.forEach(promise => {
      promise.then(value => {
        resolve(value);
      }, reject);
    });
  });
};

MyPromise.resolve = function (value) {
  let promise;

  promise = new MyPromise((resolve, reject) => {
    this.prototype.resolvePromise(promise, value, resolve, reject);
  });

  return promise;
};

MyPromise.reject = function (reason) {
  return new MyPromise((resolve, reject) => {
    reject(reason);
  });
};

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('这是第一个 resolve 值');
  }, 1000);
  console.log('new Promise');
})
  .then(
    data => {
      console.log('data', data);
      return new MyPromise((resolve, reject) => {
        setTimeout(() => {
          reject('这是第二个 resolve 值');
        }, 1000);
      });
    },
    error => {
      console.log('error', error);
    }
  )
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log(error);
  });
