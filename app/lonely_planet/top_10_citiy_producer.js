const puppeteer = require('puppeteer');

var eventSubscriber = module.exports;

eventSubscriber.run = async function(countryUrl) {

  const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
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
            catch (exception){
                console.log(exception);
            }
            cities.push(cityJson);
        });

        return cities;
    });

    console.dir(citiesData);
}