/* 
 * variabler
 * vi saknar datatyper, dynamiskt typat
 * scope
 * let block scope
 * const block scope, kan inte byta värde
 * var global scope
 */

let num = 2378527358;
let num2 = 2358239.23523;

let str = "Hejsan svejsan";
let str2 = 'Hejtan svejtan';
let str3 = "23578923";

let bool = true;
// let bool2 = True;

console.log(num + num2);
console.log(num + str3);
console.log(num + parseInt(str3));
console.log(str + str2);
console.log(bool + num2);
console.log(str + " " +str2);
if (bool === true)
    console.log("sant");

if (bool)
    console.log("sant");

let obj = {
    name: "Joe",
    age: 100
};
obj.age = 49;
console.log(obj);
console.log(obj.name);

let arr = ['Hej', 'på'];
arr.push('dig');
console.log(arr);
console.log(arr[0] + " " + obj.name);

/*
 * Iteration
 */

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

for (let word of arr) {
    console.log(word);
}

arr.forEach(element => {
    console.log(element);
});

/*
 * selektion
 */

if (1 > 2) {
    console.log("nix")
} else if (3 < 1) {
    console.log("nej nej")
} else {
    console.log("japp")
}

switch (arr[0]) {
    case "Hej":
        console.log("Hej!");
        break;

    default:
        break;
}

/*
 * HTML / DOM
 */

// select element(s) på alika sätt, beronde på vad du behöver
let header = document.getElementsByTagName("h1"); // elements -> array
console.log(header);

header = document.getElementsByClassName("header"); // elements -> array
console.log(header[0]);

header = document.getElementById("header"); // element != array
console.log(header);

header = document.querySelector("#header");
console.log(header);

// skapa ett element, sätt dess text, lägg till en klass och fäst det på body taggen
let p = document.createElement('p');
p.textContent = "Hejsan!";
p.classList.add('lead');

document.querySelector('body').appendChild(p);

/*
 * Stuff
 * Math funktioner
 * loop / villkor
 */
const rand = Math.floor(Math.random() * 10);
console.log(rand);
let guess;

do {
    guess = parseInt(prompt("Gissa: "));
    console.log(guess);
    if (guess < rand)
        console.log("Too low");
    else if (guess > rand)
        console.log("Too high");
} while (guess !== rand);

alert("Winner!");

// https://www.destroyallsoftware.com/talks/wat
