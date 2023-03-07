// ------------------------------------ PART 1 -----------------------------------

console.log("start");

process.on("exit", (code) => {
console.log("exit called with code: ",code)
});

console.log("End");

// Output: 
// start
// End
// exit called with code:  0


// Process simply is the code which runs in the OS
// Process in Node js is the program in Node js which runs in the OS
// Process is the instance of Events in Node js so you can listen to all the events (even error ones) [-- PART 2]
// Process is a global object
// process.exit is run by Event Loop when the call stack is empty and even all the event loop queue is empty, but there's a catch
// process.exit can also be called on its own when there's an error event like uncaughtException 
// exit returns with an exit code which tells the status of the how the process ended e.g. 0 means a success while 1 means a fatal error, there are many
// you can change the exit codes
// while listening to process.exit you can't run any async function, as exit is synchronous [--PART 2]

// ------------------------------------ PART 2 -----------------------------------

console.log("start");

setTimeout(() => {
    console.log("after 5 sec")
},5000);

process.on("exit", (code) => {
console.log("exit called with code: ",code)
});

console.log("End");

// Output: 
// start
// End
// after 5 sec
// exit called with code:  0

// process.exit is run by Event Loop when the call stack is empty and even all the event loop queue

// ** but ** 

console.log("start");

process.on("exit", (code) => {
console.log("exit called with code: ",code);
setTimeout(() => {
    console.log("after 5 sec")
},5000);

});

console.log("End");

// Output:
// start
// End
// exit called with code:  0

// exit will not run any async function inside exit listener as it ends synchronously
// if you want to do some async operation e.g. log error to another server and then exit, this can't be done in exit listener

// ------------------------------------ PART 3 -----------------------------------


console.log("start");

process.on("exit", (code) => {
console.log("exit called with code: ",code);
});

process.on("beforeExit",() => {
    console.log("before exit called");
})

console.log("End");

// Output:
// start
// End
// before exit called

// beforeExit is another event the process can listen and this is run by event loop once the call stack is empty
// then the exit is called
// best part is you can run async function inside beforeExit listener


console.log("start");


process.on("exit", (code) => {
console.log("exit called with code: ",code);
});

process.on("beforeExit",() => {
    console.log("before exit called");
    setTimeout(() => {
        console.log("after 5 sec");
    },5000);
})


console.log("End");

// Output: 
// start
// End
// before exit called
// after 5 sec
// before exit called
// after 5 sec
// before exit called
// and so on

// async operation is achieved inside beforeExit but there's a catch,
// in the output the setTimeout is called again and again and goes in an infinite loop
// because every time the event loop checks for call stack and triggers beforeExit, then we run an async function
// when the async function is resolved, event loop will check for call stack and queues and triggers beforeExit if empty, then we run an async function
// and it goes on infinitely
// so call process.exit(0) inside async function of beforeExit listener

console.log("start");


process.on("exit", (code) => {
console.log("exit called with code: ",code);
});

process.on("beforeExit",() => {
    console.log("before exit called");
    setTimeout(() => {
        console.log("after 5 sec");
        process.exit(0);
    },5000);
})


console.log("End");

// Output:
// start
// End
// before exit called
// after 5 sec
// exit called with code:  0

// Now you have it
// but again there's a catch
// you can't listen to beforeExit if process.exit() is called explicitly or uncaught error event is triggered

console.log("start");


process.on("exit", (code) => {
console.log("exit called with code: ",code);
});

process.on("beforeExit",() => {
    console.log("before exit called");
    setTimeout(() => {
        console.log("after 5 sec");
    },5000);
})


console.log("End");

process.exit();

// Output:
// start
// End
// exit called with code:  0

// as mentioned beforeExit is not triggered in this case

// ------------------------------------ PART 4 -----------------------------------

console.log("start");

process.on("exit", (code) => {
console.log("exit called with code: ",code);
});

const obj = {};

obj.something.toString();

console.log("End");

// Output:
// start
// exit called with code:  1
// /Users/halfcute/Desktop/backend/index.js:11
// obj.something.toString();
//               ^

// TypeError: Cannot read property 'toString' of undefined
//     at Object.<anonymous> (/Users/halfcute/Desktop/backend/index.js:11:15)
//     at Module._compile (internal/modules/cjs/loader.js:1085:14)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
//     at Module.load (internal/modules/cjs/loader.js:950:32)
//     at Function.Module._load (internal/modules/cjs/loader.js:790:12)
//     at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
//     at internal/main/run_main_module.js:17:47

// let's talk about another event called uncaughtException which is triggered here
// you can listen to uncaughtException, also uncaughtException calls process.exit() internally as you can see

console.log("start");

process.on("exit", (code) => {
console.log("exit called with code: ",code);
});

process.on("uncaughtException",(err) => {
    console.log("error encountered");
    console.log(err.stack);
    setTimeout(() => {
        console.log("after 5 sec");
    },5000);
})

const obj = {};

obj.something.toString();

console.log("End");

// Output:
// start
// error encountered
// TypeError: Cannot read property 'toString' of undefined
//     at Object.<anonymous> (/Users/halfcute/Desktop/backend/index.js:17:15)
//     at Module._compile (internal/modules/cjs/loader.js:1085:14)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
//     at Module.load (internal/modules/cjs/loader.js:950:32)
//     at Function.Module._load (internal/modules/cjs/loader.js:790:12)
//     at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
//     at internal/main/run_main_module.js:17:47
// after 5 sec
// exit called with code:  0

// uncaughtException can run async function as well
// there is one issue in the above code, the exit code which we are recieveing is 0 meaaning success, by default, but since we are listening to an error event
// we should send 1 as exitcode meaning fatal error

console.log("start");

process.on("exit", (code) => {
console.log("exit called with code: ",code);
});

process.on("uncaughtException",(err) => {
    console.log("error encountered");
    console.log(err.stack);
    process.exitCode = 1;
})

const obj = {};

obj.something.toString();

console.log("End");

// Output:
// start
// error encountered
// TypeError: Cannot read property 'toString' of undefined
//     at Object.<anonymous> (/Users/halfcute/Desktop/backend/index.js:17:15)
//     at Module._compile (internal/modules/cjs/loader.js:1085:14)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:1114:10)
//     at Module.load (internal/modules/cjs/loader.js:950:32)
//     at Function.Module._load (internal/modules/cjs/loader.js:790:12)
//     at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
//     at internal/main/run_main_module.js:17:47
// exit called with code:  1



// ------------------------------------ PART 5 -----------------------------------

// Let's talk about Signals
// Signals are recieved by Node js as event
// Two signals which you should know about is SIGINT and SIGTERM

// let's dive into SIGINT

console.log("start");
console.log(process.pid); // the id of the current process

setTimeout(() => {
    console.log("after 10 sec");
}, 10000);

process.on("SIGINT",() => {
    console.log("SIGINT recieved");
})

console.log("End");

// Output:
// start
// 1671
// End
// ^CSIGINT recieved
// after 10 sec

// SIGINT is emitted when you end the server, here pressing ctrl+c in the terminal to exit the server, but it will wait for all async operation to complete that are in event loop
// and will then end the process
// you can also run async operation inside SIGINT listener, for e.g. you can log the error to another server and exit




console.log("start");
console.log(process.pid);

setTimeout(() => {
    console.log("after 10 sec");
}, 10000);

console.log("End");

// Output:
// start
// 1922
// End
// Terminated: 15

// SIGTERM is another event which is emitted when you kill the process in the terminal by saying, kill <process.pid>
// we are not listening to SIGTERM event above and upon killing the process the entire Node Js process exits
// Here's a very important point from Node JS official DOCS
// 'SIGTERM' and 'SIGINT' have default handlers on non-Windows platforms that reset the terminal mode before exiting with code 
// 128 + signal number. If one of these signals has a listener installed, its default behavior will be removed (Node.js will no longer exit).
// This means that once you have a listener in your process for SIGTERM it won't terminate the process abruptly
// but will wait for call stack to be empty and will then exit
// You can also have have async opeartion inside SIGTERM listener


console.log("start");
console.log(process.pid);

setTimeout(() => {
    console.log("after 10 sec");
}, 10000);

process.on("SIGTERM",() => {
    console.log("SIGTERM recieved");
    setTimeout(() => {
        console.log("after 20 sec");
    }, 20000);
})

console.log("End");

// Output:
// start
// 1985
// End
// SIGTERM recieved
// after 10 sec
// after 20 sec

// on having a SIGTERM listener now we have altered it's default behaviour

// So if you have not provided any listener to SIGINT or SIGTERM it will
// 1. end process
// 2. will not care for event loop, even if any task is remaining
// 3. therefore will not call exit, even if you have an exit listener

// It's a good practise to have listener for SIGINT and SIGTERM

















