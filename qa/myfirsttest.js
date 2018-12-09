/*
    assert(value[, message])
    assert.deepStrictEqual(actual, expected[, message])
    assert.doesNotThrow(function[, error][, message])
*/
const assert = require("assert");
const BASE_URL = `http://localhost:4000`;

const {Builder, By, Key, until} = require('selenium-webdriver');

let driver = null;

(async function example() {
  driver = await new Builder().forBrowser('chrome').build();
  try {
    // await getGoogleAndSearchSelenium(driver);
    await getIndexPage_assertIsOK(driver);
  } finally {
    await driver.quit();
  }
})();


async function getGoogleAndSearchSelenium() {
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
}

async function getIndexPage_assertIsOK(driver) {
    await driver.get(`${BASE_URL}/`);
    let navItems = await driver.findElement(By.className("nav-link"));
    console.log(navItems);   
}
