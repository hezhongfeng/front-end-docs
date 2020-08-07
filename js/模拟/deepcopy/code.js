const copy = function (source, map = new WeakMap()) {
  if (source === null) {
    return source;
  }
  const target = Array.isArray(source) ? [] : new Object();
  if (map.has(source)) {
    return map.get(source);
  }
  map.set(source, target);
  for (const key in source) {
    let element = source[key];
    if (typeof element === 'object') {
      element = copy(element, map);
    }
    target[key] = element;
  }
  return target;
};

let a = {
  name: 'hezf',
  tt: null,
  tn: undefined,
  body: {
    label: "You Don't Know JS",
    height: '45'
  },
  array: [1, 2]
};
a.a = a;

let b = copy(a);
console.log(b);

a.name = 'change';
a.body.height = '55';
a.array[0] = 34;
console.log(a);
console.log(b);
console.log(b.a === b);
