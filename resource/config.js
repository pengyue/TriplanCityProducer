module.exports = {

    PORT: (process.env.APP_HTTP_PORT) ? process.env.APP_HTTP_PORT : 8110,
    HOST: '0.0.0.0',
    HEALTH_LIVENESS: "/health-liveness",
    HEALTH_READINESS: "/health-readiness",

    KAFKA_BROKER_IP:
        (process.env.KAFKA_BROKER_IP ? process.env.KAFKA_BROKER_IP : "kubernetes-kafka.kafka")
        + ':' +
        (process.env.KAFKA_BROKER_PORT ? process.env.KAFKA_BROKER_PORT : "9092"),

    KAFKA_HOST:
        (process.env.KAFKA_ZOOKEEPER_HOST_IP ? process.env.KAFKA_ZOOKEEPER_HOST_IP : "kubernetes-kafka-zookeeper.kafka")
        + ":" +
        (process.env.KAFKA_ZOOKEEPER_HOST_PORT ? process.env.KAFKA_ZOOKEEPER_HOST_PORT : "2181"),


    COUNTRY_TOPIC_NAME:
        process.env.PRODUCER_KAFKA_COUNTRY_TOPIC_NAME
            ? process.env.PRODUCER_KAFKA_COUNTRY_TOPIC_NAME
            : "prototype-country",

    CONSUMER_OPTION_SESSION_TIMEOUT:
        process.env.CONSUMER_OPTION_SESSION_TIMEOUT
            ? process.env.CONSUMER_OPTION_SESSION_TIMEOUT
            : 15000,

    CONSUMER_OPTION_PROTOCOL:
        process.env.CONSUMER_OPTION_PROTOCOL
            ? process.env.CONSUMER_OPTION_PROTOCOL
            : "roundrobin",

    CONSUMER_OPTION_FROM_OFFSET:
        process.env.CONSUMER_OPTION_FROM_OFFSET
            ? process.env.CONSUMER_OPTION_FROM_OFFSET
            : "earliest",

    CONSUMER_OPTION_CONSUMER_GROUP_ID:
        process.env.CONSUMER_OPTION_CONSUMER_GROUP_ID
            ? process.env.CONSUMER_OPTION_CONSUMER_GROUP_ID
            : "countries-consumer-group",

    COUNTRIES_TOPIC_CONSUMER_ID:
        process.env.COUNTRIES_TOPIC_CONSUMER_ID
            ? process.env.COUNTRIES_TOPIC_CONSUMER_ID
            : "countries-consumer",

    CITY_TOPIC_NAME:
        process.env.PRODUCER_KAFKA_CITY_TOPIC_NAME
            ? process.env.PRODUCER_KAFKA_CITY_TOPIC_NAME
            : "prototype-top-10-cities",

    CITY_TOPIC_KEY:
        process.env.PRODUCER_KAFKA_CITY_TOPIC_KEY
            ? process.env.PRODUCER_KAFKA_CITY_TOPIC_KEY
            : "lonely-planet-top-10-city-key"
}