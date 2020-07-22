# Promise 的模拟实现

先需要熟悉 promise 的用法，才能去模拟实现。

## 基本用法

```js
new Promise(function(resolve, reject) {
  if (/* 异步操作成功 */) {
    resolve(value);
  } else {
    reject(error);
  }
}).then(
  function() {
    console.log('success');
  },
  function() {
    console.log('fail');
  }
);

```

## 手动模拟 1

首先 Promise 对象代表一个异步（同步也可以）操作，有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）从 pending 变为 fulfilled 和从 pending 变为 rejecte，一旦状态改变，就不会再变。

然后 Promise 构造函数接受一个具有 resolve 和 reject 参数的函数，在调用 resolve 的时候开始执行 then 里面传进的回调函数，并且要传递回来参数。

```js
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

// MyPromise
// success
```

上面的模拟运行是正常的，但是有一个问题，如果不使用 setTimeout 的话，直接调用 resolve 就会因为 then 在 handle 后调用而没有注册 resolvedCallback 和 rejectedCallback，导致 this.rejectedCallback is not a function。

## 手动模拟 2

我们需要搞定另外一种直接调用 resolve 的情况，需要在 then 之后调用，如下代码，在 resolve 的时候使用`setTimeout`就可以完成

```js
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
      // 保证resolve能访问到这里的回调
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
  // resolve('success');
  reject('fail');
  console.log('MyPromise');
}).then(
  function (value) {
    console.log(value);
  },
  function (error) {
    console.log(error);
  }
);
```

## then 链式调用

上一步我们完成了最基本的功能，首先由 pending 变为 fulfilled，然后执行 then 里面的 resolve 回调。

下一步来实现 then 方法的链式调用，使用方式如下所示：

```js
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('这是第一个 resolve 值');
  }, 1000);
  console.log('new Promise');
})
  .then(
    data => {
      console.log('data', data);
      return '这是第二个 resolve 值';
    },
    error => {
      console.log('error', error);
    }
  )
  .then(data => {
    console.log(data);
  });
```

到这步需要完成，then 之后返回的是一个新的 Promise，得想想怎么做

```js
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
        resolve(res);
      } catch (error) {
        reject(error);
      }
    };

    const rejected = error => {
      try {
        const res = onRejected(error);
        reject(res);
      } catch (error) {
        reject(error);
      }
    };
    this.resolvedCallback = resolved;
    this.rejectedCallback = rejected;
  });
  return newPromise;
};
```

## catch

一般的链式调用需要在后面接着一个 catch，处理任意步骤产生的错误，像下面这样

```js
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('这是第一个 resolve 值');
  }, 1000);
  console.log('new Promise');
})
  .then(
    data => {
      console.log('data', data);
      return '这是第二个 resolve 值';
    },
    error => {
      console.log('error', error);
    }
  )
  .then(data => {
    console.log(data);
    throw '这是reject 值';
  })
  .catch(err => {
    console.log(err);
  });
```

上面我们完成了，直接返回参数的 then 连续调用，但是更多的时候是第一个 then 里面返回一个 promise，第二个 then 对返回的这个 promise 起作用。

## promise 连续调用

```js
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('这是第一个 resolve 值');
  }, 1000);
  console.log('new Promise');
})
  .then(
    data => {
      console.log('data', data);
      return MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve('这是第二个 resolve 值');
        }, 1000);
      });
    },
    error => {
      console.log('error', error);
    }
  )
  .then(data => {
    console.log(data);
  });
```

上面代码中，第一个 then 方法指定的回调函数，返回的是另一个 Promise 对象。这时，第二个 then 方法指定的回调函数，就会等待这个新的 Promise 对象状态发生变化。如果变为 resolved，就调用第一个回调函数，如果状态变为 rejected，就调用第二个回调函数。

经过思考，只需要在 then 判断执行后的数据类型，是否为 promise，如果不是 promise 我们就 new 一个返回去，是的话就直接把这个 resolve 给配置上去

```js
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
        const res = onRejected(error);
        reject(res);
      } catch (error) {
        reject(error);
      }
    };
    this.resolvedCallback = resolved;
    this.rejectedCallback = rejected;
  });
  return newPromise;
};
```

## 增加 catch 函数

一般使用的时候都是下面这样的方式，这样比较容易处理正常的业务，一个接一个的 then 然后使用 catch。

```js
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('109');
  }, 1000);
})
  .then(data => {
    console.log('data', data);
  })
  .catch(error => {
    console.log('error2', error);
  });
```

使用 isFunction 判断后即可，最终 error 会被传递至最后通过 catch 添加的 onRejected

```js
// then里面的
let rejected = error => {
  try {
    if (!isFunction(onRejected)) {
      reject(error);
      return;
    }
    let res = onRejected(error);
    if (res instanceof MyPromise) {
      res.then(resolve, reject);
    } else {
      reject(res);
    }
  } catch (error) {
    reject(error);
  }
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```

我来描述下上面代码的执行顺序：

1. 执行 setTimeout
2. 执行 then，然后返回一个 new Promise 并且把 then 添加的回调放在了回调
3. 继续执行 catch，先把 then(null,onRejected)注册到第二个 promise,然后返回第三个 Promise
4. timeout 到时间了，开始执行 reject
5. 在执行 rejected 的时候发现 onRejected 不是 function,继续使用 reject，即 catch 中的函数代码

至此，我们的代码整体是这样的：

```js
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
      // 保证resolve能访问到这里的回调
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
  return new MyPromise((resolve, reject) => {
    let resolved = value => {
      try {
        let res = onResolved(value);
        if (res instanceof MyPromise) {
          res.then(resolve, reject);
        } else {
          resolve(res);
        }
      } catch (error) {
        reject(error);
      }
    };

    let rejected = error => {
      try {
        if (!isFunction(onRejected)) {
          reject(error);
          return;
        }
        let res = onRejected(error);
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
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};
```
