// Exercise 3: Capitalize colors using Array.prototype.map
const colors = ['red', 'green', 'blue'];

const capitalize = ([first = '', ...rest]) => 
  `${first.toUpperCase()}${rest.join('')}`;

const capitalizedColors = colors.map(capitalize);

console.log(capitalizedColors);