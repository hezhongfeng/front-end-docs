const newF = function () {
  const obj = new Object();
  const constructor = arguments[0];
  const args = [].slice.call(arguments, 1);
  constructor.apply(obj, args);
  obj.__proto__ = constructor.prototype;
  return obj;
};

const Human = function (name) {
  this.name = name;
};

Human.prototype.callName = function () {
  console.log(this.name);
  return this.name;
};

const hezf = newF(Human, 'hezf');

console.log(hezf.callName());
