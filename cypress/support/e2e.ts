import "./commands";

// You can add global before/beforeEach hooks here
Cypress.on("uncaught:exception", () => {
  // returning false here prevents Cypress from failing the test
  return false;
});
