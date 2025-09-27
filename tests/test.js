const { initializeChrome, goTo } = require("../src/utils.js");
async function test() {
  let driver = await initializeChrome();
  await goTo(driver, "https://www.google.com");
}

test();
