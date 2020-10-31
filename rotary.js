const { Gpio } = require("onoff");

const Gpio = require("onoff").Gpio;

const clk = new Gpio(17, "in", "both");
const ct = new Gpio(18, "in", "both");
const sw = new Gpio(27, "in", "both");

clk.read().then((value) => console.log(value));
