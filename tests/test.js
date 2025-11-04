const {
  initializeChrome,
  testCore,
  takeScreenshot,
  expandSidebar,
} = require("../src/utils.js");

const {
  openPeopleApp,
} = require("../src/peopleapp.js");

const {
  clickAddButton,
  verifyInGrid,
} = require("../src/grid.js");

const {
  verifyAddEmployeeFlyout,
  addOnboardingChecklist,
  addPrehireChecklist,
  addNoAutoAssignment,
  verifyEmployeeAdded,
} = require("../src/addemployee.js");

async function test1() {
  let driver;
  
  try {
    driver = await initializeChrome();
    
    await testCore(driver, "hr2admin222@mail.com", "Password123!!", "stg");
    await openPeopleApp(driver);
    await clickAddButton(driver);
    await verifyAddEmployeeFlyout(driver);
    
    const firstName = await addOnboardingChecklist(driver);
    
    // Verify employee was added
    await verifyEmployeeAdded(driver, firstName, expandSidebar, openPeopleApp, verifyInGrid);
    
    console.log("✅ Test1 completed successfully!");
    
  } catch (error) {
    console.error("❌ Test1 failed:", error.message);
    
    if (driver) {
      await takeScreenshot(driver, `test1-failure-${Date.now()}`);
    }
    process.exit(1);
  }
}

async function test2() {
  let driver;
  
  try {
    driver = await initializeChrome();
    
    await testCore(driver, "hr2admin222@mail.com", "Password123!!", "stg");
    await openPeopleApp(driver);
    await clickAddButton(driver);
    await verifyAddEmployeeFlyout(driver);
    
    const firstName = await addPrehireChecklist(driver);
    
    // Verify employee was added
    await verifyEmployeeAdded(driver, firstName, expandSidebar, openPeopleApp, verifyInGrid);
    
    console.log("✅ Test2 completed successfully!");
    
  } catch (error) {
    console.error("❌ Test2 failed:", error.message);
    
    if (driver) {
      await takeScreenshot(driver, `test2-failure-${Date.now()}`);
    }
    process.exit(1);
  }
}

async function test3() {
  let driver;
  
  try {
    driver = await initializeChrome();
    
    await testCore(driver, "hr2admin222@mail.com", "Password123!!", "stg");
    await openPeopleApp(driver);
    await clickAddButton(driver);
    await verifyAddEmployeeFlyout(driver);
    
    const firstName = await addNoAutoAssignment(driver);
    
    // Verify employee was added
    await verifyEmployeeAdded(driver, firstName, expandSidebar, openPeopleApp, verifyInGrid);
    
    console.log("✅ Test3 completed successfully!");
    
  } catch (error) {
    console.error("❌ Test3 failed:", error.message);
    
    if (driver) {
      await takeScreenshot(driver, `test3-failure-${Date.now()}`);
    }
    process.exit(1);
  }
}

// Run test1
test1();

// Run test2
// test2();

// Run test3
// test3();