const config = require('../../../resource/config');
const puppeteer = require('puppeteer');
const kafkaProducer = require('../../infrastructure/kafka/producer');

let kafkaProducerInitializer = require('../../infrastructure/kafka/producerInitializer');

const cityExtractor = module.exports;

cityExtractor.run = function (country) {

    const subscriber = async (country) => {

        console.log("Start the city scrapper for country: " + country.name + " (url: " + country.url + ")");

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();

        await page.setViewport({width: 1920, height: 926});

        try {
            const response = await page.goto(country.url);

            if (404 == response._status) {
                console.log('Error loading city page (404) ...');
                await browser.close();
            } else {

                // click on the button to expand list
                var SELECTOR = "div > button.js-top-places";

                await page.focus(SELECTOR);

                await page.waitFor(1000);

                await page.click(SELECTOR);

                // get city details
                return await page.evaluate(() => {

                    let cities = [];

                    // get the top 10 city elements
                    let top10CitiesElms = document.querySelectorAll('ul.tlist__secondary > li.tlist__secondary-item');
                    // get the city data
                    top10CitiesElms.forEach((cityElement) => {
                        let city = {};
                        try {
                            city.name = cityElement.querySelector('a').innerText;
                            city.url = cityElement.querySelector('a').href;

                        } catch (exception) {
                            console.log(exception);
                        }

                        cities.push(city);

                    });

                    return cities;

                });
            }

        } catch (err)  {
            console.log('Error loading city page:', err);
            await browser.close();
        }
    }

    subscriber(country)
        .then(cities => {

            console.log(" ");

            const initializer = async() => {
                return await new Promise((resolve, reject) => {
                    try {
                        return resolve(kafkaProducerInitializer.initialize('lonely-planet-city', 1));
                    } catch (err) {
                        return reject(err);
                    }
                });
            }

            initializer()
                .then(kafkaClient => {
                    cities.forEach((city) => {
                        kafkaProducer.produce(kafkaClient, config.CITY_TOPIC_NAME, config.CITY_TOPIC_KEY, city);
                    });
                })
                .catch(err => {
                    console.error(err);
                });

        })
        .catch(
            err => console.log(err)
        );
}
