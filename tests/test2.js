const {
  initializeChrome,
  testCore,
  takeScreenshot,
  expandSidebar,
} = require("../src/utils.js");

const {
  openPeopleApp,
  openPositions,
  addPositionFlyout,
} = require("../src/peopleapp.js");

const {
  clickAddButton,
} = require("../src/grid.js");

async function test1() {
  let driver;
  
  try {
    driver = await initializeChrome();
    
    // Run core setup with credentials
    await testCore(driver, "hr2admin222@mail.com", "Password123!!", "stg");
    
    // Open People app
    await openPeopleApp(driver);
    
    // Open Positions
    await openPositions(driver);
    
    // Click Add button
    await clickAddButton(driver);
    
    // Add position (verification included inside)
    await addPositionFlyout(driver, expandSidebar);
    
    console.log("✅ Test1 completed successfully!");
    
  } catch (error) {
    console.error("❌ Test1 failed:", error.message);
    
    if (driver) {
      await takeScreenshot(driver, `test1-failure-${Date.now()}`);
    }
    process.exit(1);
  }
}

// Run test1
test1();