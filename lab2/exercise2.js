// Exercise 2: Capitalize first letter using destructuring and rest/spread
const capitalize = ([first = '', ...rest]) => 
  `${first.toUpperCase()}${rest.join('')}`;

console.log(capitalize('fooBar'));
console.log(capitalize('nodeJs'));