const { By, until } = require("selenium-webdriver");

// Generate GUID
function generateGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Open People app
async function openPeopleApp(driver) {
  try {
    console.log("👥 Opening People app...");

    const peopleLink = await driver.wait(
      until.elementLocated(By.xpath("//span[normalize-space()='People']")),
      10000
    );
    await driver.wait(until.elementIsVisible(peopleLink), 10000);
    await peopleLink.click();
    console.log("✅ People app opened!");

    // Verify we are on People app screen
    console.log("🔍 Verifying People app screen...");
    const peopleItem = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//a[@ng-show='!menuItem.SubMenus.length'][normalize-space()='People']"
        )
      ),
      10000
    );
    await driver.wait(until.elementIsVisible(peopleItem), 10000);
    console.log("✅ People app screen verified!");
  } catch (error) {
    console.error("❌ Failed to open People app:", error.message);
    throw error;
  }
}

// Open Positions
async function openPositions(driver) {
  try {
    console.log("💼 Opening Positions...");

    const positionsLink = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//a[@ng-show='!menuItem.SubMenus.length'][normalize-space()='Positions']"
        )
      ),
      10000
    );
    await driver.wait(until.elementIsVisible(positionsLink), 10000);
    await positionsLink.click();
    console.log("✅ Positions opened!");

    // Verify we are on Positions screen
    console.log("🔍 Verifying Positions screen...");
    const positionTitleHeader = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//th[@data-field='xPositionTitle']//span[@class='k-header-text'][normalize-space()='Position Title']"
        )
      ),
      10000
    );
    await driver.wait(until.elementIsVisible(positionTitleHeader), 10000);
    console.log("✅ Positions screen verified!");
  } catch (error) {
    console.error("❌ Failed to open Positions:", error.message);
    throw error;
  }
}

// Add position with GUID and verify
async function addPositionFlyout(driver, expandSidebar) {
  try {
    // Generate GUID
    const guid = generateGuid();
    const positionTitle = `PositionTitle+${guid}`;
    const positionCode = `PositionCode+${guid}`;

    console.log(`📝 Generated position data:`);
    console.log(`   Position Title: ${positionTitle}`);
    console.log(`   Position Code: ${positionCode}`);

    // Fill in Position Title
    console.log("✍️ Filling in Position Title...");
    const positionTitleField = await driver.wait(
      until.elementLocated(By.xpath("//input[@id='xPosition-xPositionTitle']")),
      10000
    );
    await driver.wait(until.elementIsVisible(positionTitleField), 10000);
    await positionTitleField.clear();
    await positionTitleField.sendKeys(positionTitle);
    console.log("✅ Position Title filled!");

    // Fill in Position Code
    console.log("✍️ Filling in Position Code...");
    const positionCodeField = await driver.wait(
      until.elementLocated(By.xpath("//input[@id='xPosition-xPositionCode']")),
      10000
    );
    await driver.wait(until.elementIsVisible(positionCodeField), 10000);
    await positionCodeField.clear();
    await positionCodeField.sendKeys(positionCode);
    console.log("✅ Position Code filled!");

    // Click Save button
    console.log("💾 Clicking Save button...");
    const saveButton = await driver.findElement(
      By.xpath(
        "//span[@class='btn-label ng-scope ng-binding'][normalize-space()='Save']"
      )
    );
    await saveButton.click();
    console.log("✅ Save button clicked!");

    // Wait for position to be saved
    await new Promise((res) => setTimeout(res, 2000));
    console.log("✅ Position saved successfully!");

    // Verify position was added
    console.log("🔍 Verifying position was added...");
    await expandSidebar(driver);
    await openPeopleApp(driver);
    await openPositions(driver);

    // Search for position in grid
    console.log(`🔎 Searching for: ${positionTitle}`);
    const searchField = await driver.wait(
      until.elementLocated(By.xpath("//input[@placeholder='Position Title']")),
      10000
    );
    await driver.wait(until.elementIsVisible(searchField), 10000);
    await searchField.click();
    await searchField.clear();
    await searchField.sendKeys(positionTitle);

    // Wait for grid to filter
    await new Promise((res) => setTimeout(res, 1500));

    // Verify position appears in grid
    const positionInGrid = await driver.wait(
      until.elementLocated(
        By.xpath(`//a[normalize-space()='${positionTitle}']`)
      ),
      10000
    );
    await driver.wait(until.elementIsVisible(positionInGrid), 10000);
    console.log("✅ Position verified in grid!");

    return positionTitle;
  } catch (error) {
    console.error("❌ Failed to add position:", error.message);
    throw error;
  }
}

module.exports = {
  openPeopleApp,
  openPositions,
  addPositionFlyout,
};
