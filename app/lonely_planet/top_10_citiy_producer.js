const KAFKA_BROKER_IP =
    (process.env.KAFKA_BROKER_IP ? process.env.KAFKA_BROKER_IP : "192.168.0.54")
    + ':' +
    (process.env.KAFKA_BROKER_PORT ? process.env.KAFKA_BROKER_PORT : "9092");

const APP_NAME =
    process.env.APP_NAME ? process.env.APP_NAME : "triplan-city-producer";

const KAFKA_RETRY_ATTEMPTS = 1

const CITY_TOPIC_NAME =
    process.env.PRODUCER_KAFKA_CITY_TOPIC_NAME
        ? process.env.PRODUCER_KAFKA_CITY_TOPIC_NAME
        : "top_10_cities";

const puppeteer = require('puppeteer');

var kafka = require('kafka-node')
var Producer = kafka.Producer
var KeyedMessage = kafka.KeyedMessage;
var kafkaConnectDescriptor = KAFKA_BROKER_IP;

function initializeKafkaProducer(attempt) {
    try {
        console.log(`Try to initialize Kafka Client at ${kafkaConnectDescriptor} and Producer, attempt ${attempt}`);
        const client = new kafka.KafkaClient({kafkaHost: kafkaConnectDescriptor});
        console.log("Created (city) client ... ");
        producer = new Producer(client);
        console.log("Submitted async (city) producer creation request");
        producer.on('ready', function () {
            console.log("City Producer is ready in " + APP_NAME);
        });
        producer.on('error', function (err) {
            console.log("Failed to create the (city) client or the producer " + JSON.stringify(err));
        })
    } catch (e) {
        console.log("Exception in initializeKafkaProducer" + JSON.stringify(e));
        console.log("Try again in 5 seconds");
        setTimeout(initializeKafkaProducer, 5000, ++attempt);
    }
}

initializeKafkaProducer(KAFKA_RETRY_ATTEMPTS);

var eventSubscriber = module.exports;

eventSubscriber.run = async function (countryName, countryUrl) {

    console.log("Start the city scrapper from country url ...");

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 926});
    await page.goto(countryUrl);

    // click on the button to expand list
    var SELECTOR = "div > button.js-top-places";
    await page.focus(SELECTOR);
    await page.waitFor(1000);
    await page.click(SELECTOR);

    // get city details
    let citiesData = await page.evaluate(() => {

        let cities = [];

        // get the top 10 city elements
        let top10CitiesElms = document.querySelectorAll('ul.tlist__secondary > li.tlist__secondary-item');
        // get the city data
        top10CitiesElms.forEach((cityElement) => {
            let cityJson = {};
            try {
                cityJson.name = cityElement.querySelector('a').innerText;
                cityJson.url = cityElement.querySelector('a').href;
            }
            catch (exception) {
                console.log(exception);
            }

            publishEvent(
                "top-10-cities-producer-key",
                {
                    "country": countryName,
                    "country_url": countryUrl,
                    "city": cityJson.name,
                    "city_url": cityJson.url
                }
            );

            cities.push(cityJson);
        });

        return cities;
    });

    console.dir(citiesData);
}

publishEvent = function (eventKey, event) {
    km = new KeyedMessage(eventKey, JSON.stringify(event));
    payloads = [
        {topic: CITY_TOPIC_NAME, messages: [km], partition: 0}
    ];
    producer.send(payloads, function (err, data) {
        if (err) {
            console.error("Failed to publish event with key " + eventKey + " to topic " + CITY_TOPIC_NAME + " :" + JSON.stringify(err));
        }
        console.log("Published event with key " + eventKey + " to topic " + CITY_TOPIC_NAME + " :" + JSON.stringify(data));
    });
}

