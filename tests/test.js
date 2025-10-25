const {
  initializeChrome,
  testCore,
  openPeopleApp,
  takeScreenshot,
  By,
  until,
  waitForElement,
  typeText,
  generateGuid,
  expandSidebar,
} = require("../src/utils.js");

const { clickAddButton, verifyInGrid } = require("../src/grid.js");

async function test1() {
  let driver;

  try {
    driver = await initializeChrome();

    // Run core setup with credentials
    await testCore(driver, "admin+dadotest@neogov.com", "Password123!!");

    // Open People app
    await openPeopleApp(driver);

    // Click Add Employee button using grid function
    await clickAddButton(driver);

    // Verify Add Employee flyout is opened
    console.log("🔍 Verifying Add Employee flyout...");
    const flyoutHeader = await waitForElement(
      driver,
      By.xpath(
        "//*[@id='objects-add-edit-details-flyout']/div/div[1]/header/div[1]/div/div[1]/div/h2/span/span"
      ),
      10000
    );
    await driver.wait(until.elementIsVisible(flyoutHeader), 10000);
    console.log("✅ Add Employee flyout verified!");

    // Generate unique first name
    const guid = generateGuid();
    const firstName = `FirstName+${guid}`;
    console.log(`📝 Generated first name: ${firstName}`);

    // Fill in first name
    console.log("✍️ Filling in first name...");
    await typeText(
      driver,
      By.xpath("//*[@id='xEmployee-xFirstName']"),
      firstName
    );
    console.log("✅ First name filled!");

    // Generate unique last name
    const lastName = `LastName+${guid}`;
    console.log(`📝 Generated last name: ${lastName}`);

    // Fill in last name
    console.log("✍️ Filling in last name...");
    await typeText(
      driver,
      By.xpath("//*[@id='xEmployee-xLastName']"),
      lastName
    );
    console.log("✅ Last name filled!");

    // Generate unique email
    const email = `${guid}@mail.com`;
    console.log(`📧 Generated email: ${email}`);

    // Fill in email
    console.log("✍️ Filling in email...");
    await typeText(driver, By.xpath("//*[@id='xEmployee-xEmail']"), email);
    console.log("✅ Email filled!");

    // Click on start date picker
    console.log("📅 Opening start date picker...");
    const startDateField = await driver.findElement(
      By.xpath("//*[@id='xEmployee-xStartDate']")
    );
    await startDateField.click();
    console.log("✅ Start date picker opened!");

    // Get today's date in MM/DD/YYYY format
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    const todayFormatted = `${month}/${day}/${year}`;
    console.log(`📅 Today's date: ${todayFormatted}`);

    // Type today's date
    console.log("✍️ Filling in start date...");
    await typeText(
      driver,
      By.xpath("//*[@id='xEmployee-xStartDate']"),
      todayFormatted
    );
    console.log("✅ Start date filled!");
    // Click on department dropdown
    console.log("🏢 Opening department dropdown...");
    const departmentButton = await driver.findElement(
      By.xpath(
        "//*[@id='xEmployee-xDepartmentLookup']//button[@class='btn dropdown-toggle ellipsis btn-dropdown-menu aut-dropdown-optionList']"
      )
    );
    await departmentButton.click();
    console.log("✅ Department dropdown opened!");

    // Wait for dropdown options to appear
    await new Promise((res) => setTimeout(res, 1500));

    // Select second option using JavaScript executor
    console.log("✍️ Selecting department...");
    const departmentOptions = await driver.findElements(
      By.xpath(
        "//*[@id='xEmployee-xDepartmentLookup']//ul[@class='dropdown-menu content-scroll']//li[@ng-repeat='item in data']//a"
      )
    );
    console.log(`Found ${departmentOptions.length} department options`);
    await driver.executeScript("arguments[0].click();", departmentOptions[1]);
    console.log("✅ Department selected!");

    // Wait for dropdown to close
    await new Promise((res) => setTimeout(res, 500));
    // Click on position dropdown
    console.log("💼 Opening position dropdown...");
    const positionButton = await driver.findElement(
      By.xpath(
        "//*[@id='xEmployee-xPositionLookup']//button[@class='btn dropdown-toggle ellipsis btn-dropdown-menu aut-dropdown-optionList']"
      )
    );
    await positionButton.click();
    console.log("✅ Position dropdown opened!");

    // Wait for dropdown options to appear
    await new Promise((res) => setTimeout(res, 1500));

    // Select second option using JavaScript executor
    console.log("✍️ Selecting position...");
    const positionOptions = await driver.findElements(
      By.xpath(
        "//*[@id='xEmployee-xPositionLookup']//ul[@class='dropdown-menu content-scroll']//li[@ng-repeat='item in data']//a"
      )
    );
    console.log(`Found ${positionOptions.length} position options`);
    await driver.executeScript("arguments[0].click();", positionOptions[1]);
    console.log("✅ Position selected!");

    // Wait for dropdown to close
    await new Promise((res) => setTimeout(res, 500));
    // Click on location dropdown
    console.log("📍 Opening location dropdown...");
    const locationButton = await driver.findElement(
      By.xpath(
        "//*[@id='xEmployee-xLocationLookup']//button[@class='btn dropdown-toggle ellipsis btn-dropdown-menu aut-dropdown-optionList']"
      )
    );
    await locationButton.click();
    console.log("✅ Location dropdown opened!");

    // Wait for dropdown options to appear
    await new Promise((res) => setTimeout(res, 1500));

    // Select second option using JavaScript executor
    console.log("✍️ Selecting location...");
    const locationOptions = await driver.findElements(
      By.xpath(
        "//*[@id='xEmployee-xLocationLookup']//ul[@class='dropdown-menu content-scroll']//li[@ng-repeat='item in data']//a"
      )
    );
    console.log(`Found ${locationOptions.length} location options`);
    await driver.executeScript("arguments[0].click();", locationOptions[1]);
    console.log("✅ Location selected!");

    // Click Save button
    console.log("💾 Clicking Save button...");
    const saveButton = await driver.findElement(
      By.xpath("//button[@class='btn aut-button-save btn-primary ng-scope']")
    );
    await saveButton.click();
    console.log("✅ Save button clicked!");

    // Wait for employee to be saved
    await new Promise((res) => setTimeout(res, 2000));
    console.log("✅ Employee saved successfully!");

    // Verify employee was added successfully using grid function
    await expandSidebar(driver);
    await openPeopleApp(driver);
    await verifyInGrid(
      driver,
      "//input[@placeholder='First Name']", // Search field xpath
      firstName, // Search value
      `//a[normalize-space()='${firstName}']` // Grid item xpath
    );

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
