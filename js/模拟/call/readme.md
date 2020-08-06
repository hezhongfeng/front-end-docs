# call

call 的基础用法就是改变函数中的 this，并且执行函数

```js
const obj1 = {
  name: '1',
  showName(a, b) {
    console.log(this.name);
    return this.name + a + b;
  }
};

const obj2 = {
  name: '2'
};

console.log(obj1.showName.call(obj2, 1, 2)); // 2 212
```

我门仔细分析下：

1. 改变了函数中 this 的指向
2. 函数执行了

## 思路

这个 call 是在函数后面的，所以模拟的这个函数也要写在`Function.prototype`上面
