/* 
   Student Name: Yigit Alkoc
   Student ID: 101558073
   Course: COMP3123
   Lab: Exercise 1
*/


// Exercise 1: Capitalize the first letter

function capitalizeWords(text) {
    let wordsArray = text.split(" ");
    for (let i = 0; i < wordsArray.length; i++) {
        // Capitalize the first character and append the rest of the string
        wordsArray[i] = wordsArray[i].charAt(0).toUpperCase() + wordsArray[i].substring(1);
    }
    return wordsArray.join(" ");
}

console.log("--- Exercise 1 ---");
console.log(capitalizeWords("the quick brown fox")); 



// Exercise 2: Find the largest of three integers

function findMax(num1, num2, num3) {
    let maxNumber = num1;
    
    if (num2 > maxNumber) {
        maxNumber = num2;
    }
    if (num3 > maxNumber) {
        maxNumber = num3;
    }
    
    return maxNumber;
}

console.log("\n--- Exercise 2 ---");
console.log(findMax(1, 0, 1));
console.log(findMax(0, -10, -20));
console.log(findMax(1000, 510, 440));



// Exercise 3: Move last three characters to the start

function moveLastThree(str) {
    if (str.length >= 3) {
        let lastThree = str.slice(-3);
        let remaining = str.slice(0, -3);
        return lastThree + remaining;
    }
    // Return original string if length is less than 3
    return str; 
}

console.log("\n--- Exercise 3 ---");
console.log(moveLastThree("Python"));
console.log(moveLastThree("JavaScript"));
console.log(moveLastThree("Hi"));


// Exercise 4: Find the types of a given angle

function checkAngleType(angle) {
    if (angle > 0 && angle < 90) {
        return "Acute angle";
    } else if (angle === 90) {
        return "Right angle";
    } else if (angle > 90 && angle < 180) {
        return "Obtuse angle";
    } else if (angle === 180) {
        return "Straight angle";
    } else {
        return "Invalid angle";
    }
}

console.log("\n--- Exercise 4 ---");
console.log(checkAngleType(47));
console.log(checkAngleType(90));
console.log(checkAngleType(145));
console.log(checkAngleType(180));