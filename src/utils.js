const { Builder, Browser } = require("selenium-webdriver");

async function initializeChrome() {
  // Create a new Chrome browser instance
  return await new Builder().forBrowser(Browser.CHROME).build();
}

async function goTo(driver, page) {
  // Open Google homepage
  await driver.get(page);
}

module.exports = {
  initializeChrome,
  goTo,
};
