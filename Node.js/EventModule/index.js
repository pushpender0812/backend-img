const { ok } = require("assert");
const EventEmitter  = require("events");

const event = new EventEmitter();

event.on("sayMyName",() => {
    console.log("My Name is Pushpender Yadav");
});

event.on("sayMyName",() => {
    console.log("My Name is Pushpu Yadav");
});
event.on("sayMyName",() => {
    console.log("My Name is Golu Yadav");
});
event.on("sayMyName",() => {
    console.log("My Name is Bhuvi Yadav");
});

event.on("checkpage",(sc,mssg) => {
console.log(`Status code is ${sc} and the page is ${mssg}`);
})

event.emit("checkpage",200,ok)

// event.emit("sayMyName")