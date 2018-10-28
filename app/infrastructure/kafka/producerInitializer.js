const config = require('../../../resource/config');
const kafka = require('kafka-node');
const kafkaProducer = kafka.Producer;

const kafkaProducerInitializer = module.exports;

kafkaProducerInitializer.initialize = function(component, attempt) {

    try {
        console.log("Try to initialize Kafka Client at " + config.KAFKA_BROKER_IP + " and Producer, attempt :" + attempt);
        const client = new kafka.KafkaClient({ kafkaHost: config.KAFKA_BROKER_IP });
        producer = new kafkaProducer(client);

        producer.on('ready', function () {
            console.log("Kafka Producer is ready in " + component);
        });

        producer.on('error', function (err) {
            console.log("Failed to create the client or the producer " + JSON.stringify(err));
        })

        return client;

    } catch (e) {
        console.log("Exception in initializeKafkaProducer" + JSON.stringify(e));
        console.log("Try again in 5 seconds");
        setTimeout(initializeKafkaProducer, 5000, ++attempt);
    }
}