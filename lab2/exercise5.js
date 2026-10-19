// Exercise 5: Calculate sum and product using Array.prototype.reduce
const array = [1, 2, 3, 4];

const calculateSum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);
const calculateProduct = (arr) => arr.reduce((acc, curr) => acc * curr, 1);

console.log(`Sum: ${calculateSum(array)}`);
console.log(`Product: ${calculateProduct(array)}`);