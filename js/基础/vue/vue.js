const data = {
  name: 'hezf'
};

Object.defineProperty(data, 'name', {
  get() {
    console.log('get hhhh');
    return 'data.name';
  }
});

console.log(data.name);

Array.prototype;

// const proxy = new Proxy(data, {
//   get(target, prop) {
//     console.log('gett');
//     return target[prop];
//   }
// });

// console.log(proxy.name);
