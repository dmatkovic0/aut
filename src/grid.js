const { By, until } = require("selenium-webdriver");

// Click Add button (+ button)
async function clickAddButton(driver, timeout = 10000) {
  try {
    console.log("➕ Clicking Add button...");
    const addButton = await driver.wait(
      until.elementLocated(By.xpath("//a[@class='aut-button-add']//i[@class='icon']")),
      timeout
    );
    await driver.wait(until.elementIsVisible(addButton), timeout);
    await addButton.click();
    console.log("✅ Add button clicked!");
  } catch (error) {
    console.error("❌ Failed to click Add button:", error.message);
    throw error;
  }
}

// Verify item in grid by searching and finding it
async function verifyInGrid(driver, searchFieldXpath, searchValue, gridItemXpath, timeout = 10000) {
  try {
    console.log(`🔍 Verifying in grid: ${searchValue}`);
    
    // Click on search field
    const searchField = await driver.wait(
      until.elementLocated(By.xpath(searchFieldXpath)),
      timeout
    );
    await driver.wait(until.elementIsVisible(searchField), timeout);
    await searchField.click();
    
    // Clear and type the search value
    await searchField.clear();
    await searchField.sendKeys(searchValue);
    console.log(`✍️ Searching for: ${searchValue}`);
    
    // Wait for grid to filter
    await new Promise((res) => setTimeout(res, 1500));
    
    // Verify item appears in the grid
    const itemInGrid = await driver.wait(
      until.elementLocated(By.xpath(gridItemXpath)),
      timeout
    );
    await driver.wait(until.elementIsVisible(itemInGrid), timeout);
    console.log("✅ Item verified in grid!");
    
    return true;
  } catch (error) {
    console.error("❌ Failed to verify item in grid:", error.message);
    throw error;
  }
}

module.exports = {
  clickAddButton,
  verifyInGrid,
};