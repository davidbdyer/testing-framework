const assert = require('assert');
const { forEach } = require('../index.js');

let numbers;

beforeEach(() => {
  numbers = [1, 2, 3];
});

it('should sum an array', () => {

  let total = 0;
  forEach(numbers, (value) => {
    total += value;
  });

  assert.strictEqual(total, 6);
  numbers.push(3);
  numbers.push(3);
  numbers.push(3);
  numbers.push(3);
});

it('before is ran each time', () => {
  assert.strictEqual(numbers.length, 3);
});