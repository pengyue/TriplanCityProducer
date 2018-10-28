const config = require('../../../resource/config');
const cityProducer = require('./top_10_citiy_producer');
const kafkaConsumer = require('../../infrastructure/kafka/consumer');
const kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: config.KAFKA_BROKER_IP });

const countryConsumer = module.exports;

countryConsumer.run = async () => {

    kafkaConsumer
        .initializer()
        .then(consumerGroup => {
            consumerGroup.on('message', function(message) {
                console.log(
                    '%s read msg Topic="%s" Partition=%s Offset=%d Key=%s Value=%s',
                    client.clientId, message.topic, message.partition, message.offset, message.key, message.value
                );

                try {
                    let country = JSON.parse(message.value);

                    if (typeof(country.url) === "undefined") {
                        return;
                    }

                    cityProducer.run(country);

                } catch (e) {
                    console.log('Value is not json : ' + message.value)
                }
            });
        })
        .catch(err => {
            console.error(err);
            console.error(err.stack);
        });
}