const kafka = require('kafka-node');
const kafkaProducer = kafka.Producer;
const keyedMessage = kafka.KeyedMessage;

const kafkaProducerModule = module.exports;

kafkaProducerModule.produce = function(client, topicName, eventKey, event) {
    eventProducer = new kafkaProducer(client);

    km = new keyedMessage(eventKey, JSON.stringify(event));
    payloads = [
        { topic: topicName, messages: [km], partition: 0 }
    ];

    eventProducer.send(payloads, function (err, event) {
        if (err) {
            console.error("Failed to publish event with key " + eventKey + " to topic " + topicName + " :" + JSON.stringify(err));
        }
        console.log("Published event with key " + eventKey + " to topic " + topicName + " :" + JSON.stringify(event));
        console.log(payloads);
    });
}