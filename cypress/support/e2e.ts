// You can add global before/beforeEach hooks here
Cypress.on("uncaught:exception", () => {
  // returning false here prevents Cypress from failing the test
  return false;
});

beforeEach(() => {
  // clear cookies and local storage
  cy.clearCookies();
  cy.clearLocalStorage();

  // clear session storage
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
  // Global network intercepts
  cy.intercept("GET", "**/api/passwords").as("getPasswords");
  cy.intercept("POST", "**/login").as("loginRequest");
  cy.intercept("POST", "**/api/passwords").as("createPassword");
});
