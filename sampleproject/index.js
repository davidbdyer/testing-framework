module.exports = {
  forEach(arr, fn) {
    for (const elm of arr) {
      fn(elm);
    }
  }
};