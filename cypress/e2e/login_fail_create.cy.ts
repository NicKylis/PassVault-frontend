describe("Logs In And Fails To Create A Password (Missing Parameters)", () => {
  it("Logs In And Fails To Create A Password (Missing Parameters)", () => {
    cy.visit("/login");
    const email = Cypress.env("TEST_EMAIL");
    const password = Cypress.env("TEST_PASSWORD");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains("button", /login/i).click();

    cy.location("pathname").should("eq", "/");

    // Open add password modal
    cy.contains("Add New Password").click();

    cy.get('[data-testid="new-password-modal"]', { timeout: 10000 })
      .should("be.visible")
      .invoke("css", "pointer-events")
      .should("not.equal", "none");

    // Fill form fields
    cy.get('[data-testid="title-input"]').type("Test Site");
    cy.get('[data-testid="username-input"]').type("user@test.com");
    // Skips the addition of Password value

    // Submit
    cy.get('[data-testid="save-password-btn"]').click();

    // User is informed that the password they entered (void) is invalid
    cy.get('[data-slot="form-message"]')
      .should("be.visible")
      .and("contain.text", "Password must be at least 6 characters");
  });
});
