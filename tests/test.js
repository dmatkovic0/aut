const {
  initializeChrome,
  testCore,
  openPeopleApp,
  takeScreenshot,
  By,
  clickElement,
  until,
  waitForElement,
  typeText,
  generateGuid,
  expandSidebar,
} = require("../src/utils.js");

async function test1() {
  let driver;

  try {
    driver = await initializeChrome();

    // Run core setup with credentials
    await testCore(driver, "admin+dadotest@neogov.com", "Password123!!");

    // Open People app
    await openPeopleApp(driver);

    // Click Add Employee button
    console.log("➕ Clicking Add Employee button...");
    await clickElement(
      driver,
      By.xpath("//a[@class='aut-button-add']//i[@class='icon']")
    );
    console.log("✅ Add Employee button clicked!");

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
    await clickElement(driver, By.xpath("//*[@id='xEmployee-xStartDate']"));
    console.log("✅ Start date picker opened!");

    // Get today's date in MM/DD/YYYY format
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
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
    await clickElement(
      driver,
      By.xpath("//*[@id='xEmployee-xDepartmentLookup']/div/button")
    );
    console.log("✅ Department dropdown opened!");

    // Wait for dropdown options to appear
    await new Promise((res) => setTimeout(res, 1000));

    // Select second option using ng-repeat index
    console.log("✍️ Selecting department...");
    const secondOption = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//ul[@class='dropdown-menu content-scroll']//li[@ng-repeat='item in data'][1]//a"
        )
      ),
      10000
    );
    await driver.wait(until.elementIsVisible(secondOption), 10000);
    await secondOption.click();
    console.log("✅ Department selected!");

    // Click on position dropdown
    console.log("💼 Opening position dropdown...");
    await clickElement(
      driver,
      By.xpath("//*[@id='xEmployee-xPositionLookup']/div/button")
    );
    console.log("✅ Position dropdown opened!");

    // Wait for dropdown options to appear
    await new Promise((res) => setTimeout(res, 1000));

    // Select second option using JavaScript executor
    console.log("✍️ Selecting position...");
    const secondPositionOption = await driver.findElement(
      By.xpath("//a[@class='aut-button-123Option']")
    );
    await driver.executeScript("arguments[0].click();", secondPositionOption);
    console.log("✅ Position selected!");

    // Click on location dropdown
    console.log("📍 Opening location dropdown...");
    await clickElement(
      driver,
      By.xpath("//*[@id='xEmployee-xLocationLookup']/div/button")
    );
    console.log("✅ Location dropdown opened!");

    // Wait for dropdown options to appear
    await new Promise((res) => setTimeout(res, 1000));

    // Select first location option using JavaScript executor
    console.log("✍️ Selecting location...");
    const locationOption = await driver.findElement(
      By.xpath("//a[contains(@class, 'aut-button-101_construction_way')]")
    );
    await driver.executeScript("arguments[0].click();", locationOption);
    console.log("✅ Location selected!");

    // Click Save button
    console.log("💾 Clicking Save button...");
    await clickElement(
      driver,
      By.xpath("//button[@class='btn aut-button-save btn-primary ng-scope']")
    );
    console.log("✅ Save button clicked!");

    // Wait for employee to be saved
    await new Promise((res) => setTimeout(res, 2000));
    console.log("✅ Employee saved successfully!");

    // Verify employee was added successfully
    console.log("🔍 Verifying employee was added...");

    // Expand sidebar and open People app again
    await expandSidebar(driver);
    await openPeopleApp(driver);

    // Click on First Name search field
    console.log("🔎 Searching for newly added employee...");
    await clickElement(driver, By.xpath("//input[@placeholder='First Name']"));

    // Type the first name of the recently added employee
    await typeText(
      driver,
      By.xpath("//input[@placeholder='First Name']"),
      firstName
    );
    console.log(`✍️ Searching for: ${firstName}`);

    // Wait a bit for grid to filter
    await new Promise((res) => setTimeout(res, 1500));

    // Verify employee appears in the grid
    console.log("✅ Verifying employee in grid...");
    const employeeInGrid = await driver.wait(
      until.elementLocated(By.xpath(`//a[normalize-space()='${firstName}']`)),
      10000
    );
    await driver.wait(until.elementIsVisible(employeeInGrid), 10000);
    console.log("✅ Employee verified in grid! Employee added successfully!");

    console.log("✅ Test1 completed successfully!");
  } catch (error) {
    console.error("❌ Test1 failed:", error.message);

    if (driver) {
      await takeScreenshot(driver, `test1-failure-${Date.now()}`);
    }
    process.exit(1);
  }
}


test1();
