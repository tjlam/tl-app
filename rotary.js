const Gpio = require("onoff").Gpio;

const clk = new Gpio(17, "in", "both");
const dt = new Gpio(18, "in", "both");
const sw = new Gpio(27, "in", "rising", { debounceTimeout: 100 });

let clkVal = 0; 
let dtVal = 0; 
let swVal = 1; // off

let clkState = 0;
let swState = 1; // off

let counter = 0;
let lastCounter = 0;

let time = 0;
let lastTime = 0;

const sendToMain = (action, amount) => {
    process.send({
        action,
        amount
    });
}

const run = () => {
    clk.read().then((value) => clkVal = value);
    dt.read().then((value) => dtVal = value);
    sw.read().then((value) => swVal = value);

    if (clkVal !== clkState) {
        if (dtVal !== clkVal) {
            counter += 1;
        } else {
            counter -= 1;
        }
    }

    // every 50ms send right or left or press or reset counters if no action
    if (time - lastTime > 100) {
        const diff = counter - lastCounter;
        if (diff > 1) {
            console.log('right', diff);
            sendToMain('right', diff);
        } else if (diff < -1) {
            console.log('left', diff);
            sendToMain('left', diff);
        }

        if (swState !== swVal) {
            console.log('button', swVal);
            sendToMain('press', 0);
        }

        lastTime = 0;
        time = 0;
        lastCounter = 0;
        counter = 0;
    }

    clkState = clkVal;
    time += 1;
    setTimeout(run, 1);
}

run();