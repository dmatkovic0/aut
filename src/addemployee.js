const { By, until } = require("selenium-webdriver");

// Generate GUID
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Verify Add Employee flyout is opened
async function verifyAddEmployeeFlyout(driver, timeout = 10000) {
  try {
    console.log("🔍 Verifying Add Employee flyout...");
    const flyoutHeader = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='objects-add-edit-details-flyout']/div/div[1]/header/div[1]/div/div[1]/div/h2/span/span")),
      timeout
    );
    await driver.wait(until.elementIsVisible(flyoutHeader), timeout);
    console.log("✅ Add Employee flyout verified!");
    return true;
  } catch (error) {
    console.error("❌ Failed to verify Add Employee flyout:", error.message);
    throw error;
  }
}

// Add employee with onboarding checklist
async function addOnboardingChecklist(driver) {
  try {
    // Generate GUID inside the function
    const guid = generateGuid();
    const firstName = `FirstName+${guid}`;
    const lastName = `LastName+${guid}`;
    const email = `${guid}@mail.com`;
    
    console.log(`📝 Generated employee data:`);
    console.log(`   First name: ${firstName}`);
    console.log(`   Last name: ${lastName}`);
    console.log(`   Email: ${email}`);
    
    // Fill in first name
    console.log("✍️ Filling in first name...");
    const firstNameField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xFirstName']")),
      10000
    );
    await driver.wait(until.elementIsVisible(firstNameField), 10000);
    await firstNameField.clear();
    await firstNameField.sendKeys(firstName);
    console.log("✅ First name filled!");
    
    // Fill in last name
    console.log("✍️ Filling in last name...");
    const lastNameField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xLastName']")),
      10000
    );
    await driver.wait(until.elementIsVisible(lastNameField), 10000);
    await lastNameField.clear();
    await lastNameField.sendKeys(lastName);
    console.log("✅ Last name filled!");
    
    // Fill in email
    console.log("✍️ Filling in email...");
    const emailField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xEmail']")),
      10000
    );
    await driver.wait(until.elementIsVisible(emailField), 10000);
    await emailField.clear();
    await emailField.sendKeys(email);
    console.log("✅ Email filled!");
    
    // Fill in start date
    console.log("📅 Opening start date picker...");
    const startDateField = await driver.findElement(By.xpath("//*[@id='xEmployee-xStartDate']"));
    await startDateField.click();
    
    // Get today's date in MM/DD/YYYY format
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const todayFormatted = `${month}/${day}/${year}`;
    console.log(`📅 Today's date: ${todayFormatted}`);
    
    // Type today's date
    console.log("✍️ Filling in start date...");
    await startDateField.clear();
    await startDateField.sendKeys(todayFormatted);
    console.log("✅ Start date filled!");
    
    // Select Department
    console.log("🏢 Opening department dropdown...");
    const departmentButton = await driver.findElement(By.xpath("//*[@id='xEmployee-xDepartmentLookup']//button[@class='btn dropdown-toggle ellipsis btn-dropdown-menu aut-dropdown-optionList']"));
    await departmentButton.click();
    console.log("✅ Department dropdown opened!");
    
    await new Promise((res) => setTimeout(res, 1500));
    
    console.log("✍️ Selecting department...");
    const departmentOptions = await driver.findElements(
      By.xpath("//*[@id='xEmployee-xDepartmentLookup']//ul[@class='dropdown-menu content-scroll']//li[@ng-repeat='item in data']//a")
    );
    console.log(`Found ${departmentOptions.length} department options`);
    await driver.executeScript("arguments[0].click();", departmentOptions[1]);
    console.log("✅ Department selected!");
    
    await new Promise((res) => setTimeout(res, 500));
    
    // Select Position
    console.log("💼 Opening position dropdown...");
    const positionButton = await driver.findElement(By.xpath("//*[@id='xEmployee-xPositionLookup']//button[@class='btn dropdown-toggle ellipsis btn-dropdown-menu aut-dropdown-optionList']"));
    await positionButton.click();
    console.log("✅ Position dropdown opened!");
    
    await new Promise((res) => setTimeout(res, 1500));
    
    console.log("✍️ Selecting position...");
    const positionOptions = await driver.findElements(
      By.xpath("//*[@id='xEmployee-xPositionLookup']//ul[@class='dropdown-menu content-scroll']//li[@ng-repeat='item in data']//a")
    );
    console.log(`Found ${positionOptions.length} position options`);
    await driver.executeScript("arguments[0].click();", positionOptions[1]);
    console.log("✅ Position selected!");
    
    await new Promise((res) => setTimeout(res, 500));
    
    // Select Location
    console.log("📍 Opening location dropdown...");
    const locationButton = await driver.findElement(By.xpath("//*[@id='xEmployee-xLocationLookup']//button[@class='btn dropdown-toggle ellipsis btn-dropdown-menu aut-dropdown-optionList']"));
    await locationButton.click();
    console.log("✅ Location dropdown opened!");
    
    await new Promise((res) => setTimeout(res, 1500));
    
    console.log("✍️ Selecting location...");
    const locationOptions = await driver.findElements(
      By.xpath("//*[@id='xEmployee-xLocationLookup']//ul[@class='dropdown-menu content-scroll']//li[@ng-repeat='item in data']//a")
    );
    console.log(`Found ${locationOptions.length} location options`);
    await driver.executeScript("arguments[0].click();", locationOptions[1]);
    console.log("✅ Location selected!");
    
    // Click Save button
    console.log("💾 Clicking Save button...");
    const saveButton = await driver.findElement(By.xpath("//button[@class='btn aut-button-save btn-primary ng-scope']"));
    await saveButton.click();
    console.log("✅ Save button clicked!");
    
    // Wait for employee to be saved - increased wait time
    await new Promise((res) => setTimeout(res, 8000));
    console.log("✅ Employee saved successfully!");
    
    return firstName; // Return firstName for verification
    
  } catch (error) {
    console.error("❌ Failed to add employee:", error.message);
    throw error;
  }
}

// Add employee with prehire checklist
async function addPrehireChecklist(driver) {
  try {
    // Generate GUID inside the function
    const guid = generateGuid();
    const firstName = `FirstName+${guid}`;
    const lastName = `LastName+${guid}`;
    const email = `${guid}@mail.com`;
    
    console.log(`📝 Generated employee data:`);
    console.log(`   First name: ${firstName}`);
    console.log(`   Last name: ${lastName}`);
    console.log(`   Email: ${email}`);
    
    // Fill in first name
    console.log("✍️ Filling in first name...");
    const firstNameField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xFirstName']")),
      10000
    );
    await driver.wait(until.elementIsVisible(firstNameField), 10000);
    await firstNameField.clear();
    await firstNameField.sendKeys(firstName);
    console.log("✅ First name filled!");
    
    // Fill in last name
    console.log("✍️ Filling in last name...");
    const lastNameField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xLastName']")),
      10000
    );
    await driver.wait(until.elementIsVisible(lastNameField), 10000);
    await lastNameField.clear();
    await lastNameField.sendKeys(lastName);
    console.log("✅ Last name filled!");
    
    // Fill in email
    console.log("✍️ Filling in email...");
    const emailField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xEmail']")),
      10000
    );
    await driver.wait(until.elementIsVisible(emailField), 10000);
    await emailField.clear();
    await emailField.sendKeys(email);
    console.log("✅ Email filled!");
    
    // Click Pre-hire Checklist button
    console.log("📋 Clicking Pre-hire Checklist...");
    const prehireChecklistButton = await driver.wait(
      until.elementLocated(By.xpath("//label[normalize-space()='Pre-hire Checklist']")),
      10000
    );
    await driver.wait(until.elementIsVisible(prehireChecklistButton), 10000);
    await prehireChecklistButton.click();
    console.log("✅ Pre-hire Checklist selected!");
    
    // Wait a bit after selecting checklist
    await new Promise((res) => setTimeout(res, 500));
    
    // Click Save button
    console.log("💾 Clicking Save button...");
    const saveButton = await driver.findElement(By.xpath("//button[@class='btn aut-button-save btn-primary ng-scope']"));
    await saveButton.click();
    console.log("✅ Save button clicked!");
    
    // Wait for employee to be saved - increased wait time
    await new Promise((res) => setTimeout(res, 8000));
    console.log("✅ Employee with Pre-hire Checklist saved successfully!");
    
    return firstName; // Return firstName for verification
    
  } catch (error) {
    console.error("❌ Failed to add employee with Pre-hire Checklist:", error.message);
    throw error;
  }
}

// Add employee with no auto assignment
async function addNoAutoAssignment(driver) {
  try {
    // Generate GUID inside the function
    const guid = generateGuid();
    const firstName = `FirstName+${guid}`;
    const lastName = `LastName+${guid}`;
    const email = `${guid}@mail.com`;
    
    console.log(`📝 Generated employee data:`);
    console.log(`   First name: ${firstName}`);
    console.log(`   Last name: ${lastName}`);
    console.log(`   Email: ${email}`);
    
    // Fill in first name
    console.log("✍️ Filling in first name...");
    const firstNameField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xFirstName']")),
      10000
    );
    await driver.wait(until.elementIsVisible(firstNameField), 10000);
    await firstNameField.clear();
    await firstNameField.sendKeys(firstName);
    console.log("✅ First name filled!");
    
    // Fill in last name
    console.log("✍️ Filling in last name...");
    const lastNameField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xLastName']")),
      10000
    );
    await driver.wait(until.elementIsVisible(lastNameField), 10000);
    await lastNameField.clear();
    await lastNameField.sendKeys(lastName);
    console.log("✅ Last name filled!");
    
    // Fill in email
    console.log("✍️ Filling in email...");
    const emailField = await driver.wait(
      until.elementLocated(By.xpath("//*[@id='xEmployee-xEmail']")),
      10000
    );
    await driver.wait(until.elementIsVisible(emailField), 10000);
    await emailField.clear();
    await emailField.sendKeys(email);
    console.log("✅ Email filled!");
    
    // Click No Auto Assignment
    console.log("🚫 Clicking No Auto Assignment...");
    const noAutoAssignmentButton = await driver.wait(
      until.elementLocated(By.xpath("//label[normalize-space()='No Auto Assignment']")),
      10000
    );
    await driver.wait(until.elementIsVisible(noAutoAssignmentButton), 10000);
    await noAutoAssignmentButton.click();
    console.log("✅ No Auto Assignment selected!");
    
    // Wait a bit after selecting option
    await new Promise((res) => setTimeout(res, 500));
    
    // Click Save button
    console.log("💾 Clicking Save button...");
    const saveButton = await driver.findElement(By.xpath("//button[@class='btn aut-button-save btn-primary ng-scope']"));
    await saveButton.click();
    console.log("✅ Save button clicked!");
    
    // Wait for employee to be saved - increased wait time
    await new Promise((res) => setTimeout(res, 8000));
    console.log("✅ Employee with No Auto Assignment saved successfully!");
    
    return firstName; // Return firstName for verification
    
  } catch (error) {
    console.error("❌ Failed to add employee with No Auto Assignment:", error.message);
    throw error;
  }
}

// Verify employee was added to grid
async function verifyEmployeeAdded(driver, firstName, expandSidebar, openPeopleApp, verifyInGrid) {
  try {
    console.log("🔍 Verifying employee was added...");
    
    // Expand sidebar and open People app again
    await expandSidebar(driver);
    await openPeopleApp(driver);
    
    // Verify employee in grid
    await verifyInGrid(
      driver,
      "//input[@placeholder='First Name']",
      firstName,
      `//a[normalize-space()='${firstName}']`
    );
    
    console.log("✅ Employee verified successfully in grid!");
    return true;
  } catch (error) {
    console.error("❌ Failed to verify employee in grid:", error.message);
    throw error;
  }
}

module.exports = {
  verifyAddEmployeeFlyout,
  addOnboardingChecklist,
  addPrehireChecklist,
  addNoAutoAssignment,
  verifyEmployeeAdded,
};