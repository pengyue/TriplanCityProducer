const APP_VERSION =
    process.env.APP_VERSION ? process.env.APP_VERSION : "0.1.0";

const APP_NAME =
    process.env.APP_NAME ? process.env.APP_NAME : "triplan-city-producer";

const TOPIC_NAME =
    process.env.PRODUCER_KAFKA_COUNTRY_TOPIC_NAME
        ? process.env.PRODUCER_KAFKA_COUNTRY_TOPIC_NAME
        : "test1";

const CONSUMER_OPTION_SESSION_TIMEOUT =
    process.env.CONSUMER_OPTION_SESSION_TIMEOUT
        ? process.env.CONSUMER_OPTION_SESSION_TIMEOUT
        : 15000;

const CONSUMER_OPTION_PROTOCOL =
    process.env.CONSUMER_OPTION_PROTOCOL
        ? process.env.CONSUMER_OPTION_PROTOCOL
        : "roundrobin";

const CONSUMER_OPTION_FROM_OFFSET =
    process.env.CONSUMER_OPTION_FROM_OFFSET
        ? process.env.CONSUMER_OPTION_FROM_OFFSET
        : "earliest";

const CONSUMER_OPTION_CONSUMER_GROUP_ID =
    process.env.CONSUMER_OPTION_CONSUMER_GROUP_ID
        ? process.env.CONSUMER_OPTION_CONSUMER_GROUP_ID
        : "countries-consumer-group";

const COUNTRIES_TOPIC_CONSUMER_ID =
    process.env.COUNTRIES_TOPIC_CONSUMER_ID
        ? process.env.COUNTRIES_TOPIC_CONSUMER_ID
        : "countries-consumer";

const KAFKA_BROKER_IP =
    (process.env.KAFKA_BROKER_IP ? process.env.KAFKA_BROKER_IP : "192.168.0.54")
    + ':' +
    (process.env.KAFKA_BROKER_PORT ? process.env.KAFKA_BROKER_PORT : "9092");

const KAFKA_HOST =
    (process.env.KAFKA_ZOOKEEPER_HOST_IP ? process.env.KAFKA_ZOOKEEPER_HOST_IP : "192.168.0.55")
    + ":" +
    (process.env.KAFKA_ZOOKEEPER_HOST_PORT ? process.env.KAFKA_ZOOKEEPER_HOST_PORT : "2181");

var cityProducer = require('./top_10_citiy_producer');
var kafka = require('kafka-node');
var client;

console.log("Running Module " + APP_NAME + " version " + APP_VERSION);
console.log("Event Hub Topic " + TOPIC_NAME);
var topics = [TOPIC_NAME];

var consumerOptions = {
    host: KAFKA_HOST,
    kafkaHost: KAFKA_BROKER_IP,
    groupId: CONSUMER_OPTION_CONSUMER_GROUP_ID,
    sessionTimeout: CONSUMER_OPTION_SESSION_TIMEOUT,
    protocol: [CONSUMER_OPTION_PROTOCOL],
    fromOffset: CONSUMER_OPTION_FROM_OFFSET // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
};
var consumerGroup = new kafka.ConsumerGroup(Object.assign({id: COUNTRIES_TOPIC_CONSUMER_ID}, consumerOptions), topics);

consumerGroup.on('error', onError);
consumerGroup.on('message', onMessage);

console.log('Start to connect to KAFKA topic ...');
consumerGroup.on('connect', function () {
    console.log('connected to ' + TOPIC_NAME + " at " + KAFKA_BROKER_IP);
})

function onMessage(message) {
    console.log(message);
    console.log(
        '%s read msg Topic="%s" Partition=%s Offset=%d Key=%s Value=%s',
        this.client.clientId, message.topic, message.partition, message.offset, message.key, message.value
    );

    try {
        let country = JSON.parse(message.value);

        if (typeof(country.country_url) === "undefined") {
            return;
        }

        console.log('url::::::::::::::' + country.country_url);
        cityProducer.run(country.country_url);

    } catch (e) {
        console.log('Value is not json : ' + message.value)
    }
}

function onError(error) {
    console.error(error);
    console.error(error.stack);
}

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
})

