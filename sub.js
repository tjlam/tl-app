const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')


client.on('connect', () => {
  client.subscribe('tyler/test')
});

client.on('message', (topic, message) => {
  if(topic === 'tyler/test') {
    console.log(`ah ah`, message.toString());
  }
});