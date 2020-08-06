Function.prototype.newCall = function (obj, ...args) {
  const fun = Symbol();
  obj[fun] = this;
  let result = obj[fun](...args);
  delete obj.fun;
  return result;
};

// Function.prototype.newCall = function () {
//   const obj = arguments[0];
//   const args = [];
//   for (let index = 1; index < arguments.length; index++) {
//     const element = arguments[index];
//     args.push(element);
//   }
//   obj.func = this;
//   const str = 'obj.func(' + args + ')';
//   const result = eval(str);
//   delete obj.func;
//   return result;
// };

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

console.log(obj1.showName.newCall(obj2, 1, 2));
