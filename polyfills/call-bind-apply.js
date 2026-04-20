//apply
Function.prototype.myApply = function(context,args=[]){
    context = context || globalThis;
    const fnkey = Symbol();
    context[fnkey] = this;
    const result = context[fnkey](...args);
    delete context[fnkey];
    return result;
}


// function greet(greeting, punct) {
//     return `${greeting}, ${this.name}${punct}`;
// }
// const user = { name: 'Bharat' };
// console.log(greet.myApply(user, ['Hello', '!']));


//call 
Function.prototype.myCall = function(context,...args){
    context = context || globalThis;
    const fnKey = Symbol();
    context[fnKey] = this;
    const result = context[fnKey](...args)
    delete context[fnKey];
    return result;
}

// function greet(greeting, punct) {
//     return `${greeting}, ${this.name}${punct}`;
// }
// const user = { name: 'Bharat' };
// console.log(greet.myCall(user, 'Hello', '!'));       // Hello, Bharat!


// function whoAmI() { return this === globalThis; }
// console.log(whoAmI.myCall(null));  

// console.log(greet.call(user, 'Hello', '!'));          // Hello, Bharat!


// function getName() { return this.name; }
// console.log(getName.myCall(user));    

// function add(a, b) { return a + b; }
// console.log(add.myCall({}, 3, 4)); 



// bind

Function.prototype.myBind = function(context,...args){
    let fn = this;

    return function(...newArgs){
     return fn.apply(context,[...args,...newArgs])
    }

}

function greet(greeting, punct) {
    return `${greeting}, ${this.name}${punct}`;
}

const user = { name: 'Bharat' };

const boundGreet = greet.myBind(user, 'Hello');
console.log(boundGreet('!'));  // Hello, Bharat!
