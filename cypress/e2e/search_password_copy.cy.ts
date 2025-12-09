describe("Logs In and Searches for a New Password", () => {
  it("Logs In and Searches for a New Password", () => {
    cy.visit("/login");
    const email = Cypress.env("TEST_EMAIL");
    const password = Cypress.env("TEST_PASSWORD");
    cy.get('input[type="email"]', { timeout: 10000 }).should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains("button", /login/i).click();
    cy.location("pathname").should("eq", "/");
    // Navigate to View All Passwords
    cy.wait("@getPasswords");
    // Use searchbar to look for a password
    const searchTerm = "Test1";
    cy.get('input[aria-label="Search passwords"]').type(searchTerm);
    cy.get('input[aria-label="Search passwords"]').should(
      "have.value",
      searchTerm
    );
    // Copy password of first entry
    cy.get('[data-testid="password-entry"]')
      .first()
      .within(() => {
        cy.get('[data-testid="copy-password-btn"]').click();
      });
  });
});
