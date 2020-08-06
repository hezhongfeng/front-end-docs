# new

首先分析一下 new 运算符做了什么：

1. 新建了一个对象
2. 构造函数中的 this 绑定到对象上
3. 新生成的对象可以通过`__proto__`访问到构造函数的原型`.prototype`上

## 思路

1. 需要 new 一个标准的 Object 返回
2. 需要准备好参数，使用`[].slice.call(rguments, 1)`
3. 构造函数执行的时候需要，使用 apply 将标准 Object 绑定一下，因为上一步取得是个参数数组，这一步必须使用 apply
4. 直接将构造函数的`prototype`赋值给`__proto__`

```js
const newF = function () {
  const obj = new Object();
  const constructor = arguments[0];
  const args = [].slice.call(arguments, 1);
  constructor.apply(obj, args);
  obj.__proto__ = constructor.prototype;
  return obj;
};
```
