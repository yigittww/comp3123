// Exercise 1: ES6 syntax rewrite
const greeter = (myArray, counter) => {
  const greetText = 'Hello ';
  for (const element of myArray) {
    console.log(`${greetText}${element}`);
  }
};

greeter(['Randy Savage', 'Ric Flair', 'Hulk Hogan'], 3);