const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require('fs');
const path = require('path');
const { getEnvironmentUrl } = require("../config.js");

async function initializeChrome() {
  let options = new chrome.Options();

  // Disable browser notifications
  options.addArguments("--disable-notifications");

  return await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
}

async function goTo(driver, page) {
  await driver.get(page);
}

async function acceptCookies(driver) {
  const xpath =
    "//button[contains(text(),'Accept') or contains(text(),'I agree')]";

  for (let i = 0; i < 10; i++) {
    try {
      const acceptButton = await driver.findElement(By.xpath(xpath));
      await acceptButton.click();
      console.log("✅ Cookies accepted!");
      return;
    } catch (err) {
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  console.log(
    "⚠️ No cookies popup found after multiple attempts, continuing..."
  );
}

async function login(driver, username, password) {
  try {
    // Wait for email field to be present
    const email = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Enter Account Email or Phone...']")),
      10000
    );
    await email.sendKeys(username);

    // Wait for password field
    const passwordField = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Enter Password']")),
      10000
    );
    await passwordField.sendKeys(password);

    // Wait for and click login button
    const loginButton = await driver.wait(
      until.elementLocated(By.xpath("//span[normalize-space()='Sign In Securely']")),
      10000
    );
    await loginButton.click();
    
    console.log("✅ Login credentials submitted");
  } catch (error) {
    console.error("❌ Login failed:", error.message);
    throw error;
  }
}

// Wait for element with custom timeout
async function waitForElement(driver, locator, timeout = 10000) {
  return await driver.wait(until.elementLocated(locator), timeout);
}

// Click element with wait
async function clickElement(driver, locator, timeout = 10000) {
  const element = await waitForElement(driver, locator, timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await element.click();
}

// Type text with wait
async function typeText(driver, locator, text, timeout = 10000) {
  const element = await waitForElement(driver, locator, timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await element.clear();
  await element.sendKeys(text);
}

// Take screenshot on failure
async function takeScreenshot(driver, filename) {
  try {
    const screenshotDir = './screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const screenshot = await driver.takeScreenshot();
    const filepath = path.join(screenshotDir, `${filename}.png`);
    fs.writeFileSync(filepath, screenshot, 'base64');
    console.log(`📸 Screenshot saved: ${filename}.png`);
  } catch (error) {
    console.error("Failed to take screenshot:", error.message);
  }
}

// Expand sidebar (only if collapsed)
async function expandSidebar(driver, timeout = 10000) {
  try {
    // Check if "Tasks" text is visible (only visible when sidebar is expanded)
    const tasksButton = await driver.findElements(
      By.xpath("//*[@id='sidebar-container']/side-navigation/div/div[1]/ul[1]/li[1]/my-tasks-button/a/span[2]")
    );
    
    // Check if tasks button exists and is displayed
    const isExpanded = tasksButton.length > 0 && await tasksButton[0].isDisplayed();
    
    if (!isExpanded) {
      // Sidebar is collapsed, expand it
      const sidebarArrow = await driver.wait(
        until.elementLocated(By.xpath("//div[@class='menu-arrow-button tooltipstered']//i[@class='icon icon-chevron-right']")),
        timeout
      );
      await driver.wait(until.elementIsVisible(sidebarArrow), timeout);
      await sidebarArrow.click();
      console.log("✅ Sidebar expanded");
      
      // Wait a bit for the animation to complete
      await new Promise((res) => setTimeout(res, 500));
    } else {
      console.log("ℹ️ Sidebar is already expanded, skipping...");
    }
  } catch (error) {
    console.error("❌ Failed to check/expand sidebar:", error.message);
    throw error;
  }
}

// Core test flow - login and prepare
async function testCore(driver, username, password, env = 'prod') {
  try {
    console.log("🚀 Starting test setup...");
    console.log(`🌍 Environment: ${env.toUpperCase()}`);
    
    await driver.manage().window().maximize();
    
    // Get environment URL
    const url = getEnvironmentUrl(env);
    
    console.log("🌐 Navigating to login page...");
    await goTo(driver, url);
    
    console.log("🔐 Logging in...");
    await login(driver, username, password);
    
    console.log("🍪 Handling cookies...");
    await acceptCookies(driver);
    
    console.log("⏳ Waiting for homepage...");
    const homepageTitle = await driver.wait(
      until.elementLocated(By.xpath("//h1[normalize-space()='Homepage']")),
      10000
    );
    await driver.wait(until.elementIsVisible(homepageTitle), 10000);
    
    console.log("✅ Successfully landed on Homepage!");
    
    console.log("📂 Checking sidebar...");
    await expandSidebar(driver);
    
    console.log("✅ Core setup complete!");
    
  } catch (error) {
    console.error("❌ Core setup failed:", error.message);
    await takeScreenshot(driver, `setup-failure-${Date.now()}`);
    throw error;
  }
}

// Generate GUID
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  initializeChrome,
  goTo,
  By,
  Key,
  until,
  acceptCookies,
  login,
  waitForElement,
  clickElement,
  typeText,
  takeScreenshot,
  expandSidebar,
  testCore,
  generateGuid,
};