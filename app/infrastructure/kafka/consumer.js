const config = require('../../../resource/config');
const kafka = require('kafka-node');
const kafkaConsumer = module.exports;

const initialize = function() {

    var topics = [config.COUNTRY_TOPIC_NAME];

    var consumerOptions = {
        host: config.KAFKA_HOST,
        kafkaHost: config.KAFKA_BROKER_IP,
        groupId: config.CONSUMER_OPTION_CONSUMER_GROUP_ID,
        sessionTimeout: config.CONSUMER_OPTION_SESSION_TIMEOUT,
        protocol: [config.CONSUMER_OPTION_PROTOCOL],
        fromOffset: config.CONSUMER_OPTION_FROM_OFFSET // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
    };
    var consumerGroup = new kafka.ConsumerGroup(Object.assign({id: config.COUNTRIES_TOPIC_CONSUMER_ID}, consumerOptions), topics);

    consumerGroup.on('connect', function () {
        console.log('Connected to ' + config.COUNTRY_TOPIC_NAME + " at " + config.KAFKA_BROKER_IP);
    })

    return consumerGroup;
}

kafkaConsumer.initializer = async() => {
    return await new Promise((resolve, reject) => {
        try {
            return resolve(initialize());
        } catch (err) {
            return reject(err);
        }
    })
}