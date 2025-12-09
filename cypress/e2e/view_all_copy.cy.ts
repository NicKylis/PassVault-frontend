describe("Logs In Navigates To View All Passwords And Copy", () => {
  it("Logs In Navigates To View All Passwords And Copy", () => {
    cy.visit("/login");
    const email = Cypress.env("TEST_EMAIL");
    const password = Cypress.env("TEST_PASSWORD");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains("button", /login/i).click();
    cy.location("pathname").should("eq", "/");

    // Navigate to View All Passwords
    cy.contains("View All").click();
    cy.location("pathname").should("eq", "/view-all");
    cy.wait("@getPasswords");

    // Copy password of first entry
    cy.get('[data-testid="password-entry"]')
      .first()
      .within(() => {
        cy.get('[data-testid="copy-password-btn"]').click();
      });
  });
});
