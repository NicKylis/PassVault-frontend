describe("Login and Add Password (intercepted APIs)", () => {
  beforeEach(() => {
    // Prevent the app from ever calling real backend APIs.
    cy.intercept("GET", "**/api/passwords", {
      statusCode: 200,
      body: { owned: [], shared: [] },
    }).as("getPasswords");

    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: {
        token: "fake-token-123",
        user: { id: "u1", name: "Test User", email: "test@example.com" },
      },
    }).as("loginRequest");

    cy.intercept("POST", "**/api/passwords", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: "new-1",
          title: req.body.title,
          username: req.body.username,
          password: req.body.password,
          website: req.body.website,
          category: req.body.category,
          notes: req.body.notes || "",
          favorite: false,
          passwordStrength: req.body.passwordStrength || "Good",
        },
      });
    }).as("createPassword");
  });

  it("logs in and adds a password", () => {
    cy.visit("/login");

    cy.get('input[type="email"]').type("test@example.com");
    cy.get('input[type="password"]').type("password123");
    cy.contains("button", /login/i).click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

    // Dashboard loads successfully because GET /api/passwords was stubbed
    cy.wait("@getPasswords");

    cy.location("pathname").should("eq", "/");

    // Open add password modal
    cy.contains("Add New Password").click();

    cy.get('[data-testid="new-password-modal"]', { timeout: 10000 })
      .should("be.visible")
      // Fix Cypress failing on body's pointer-events
      .invoke("css", "pointer-events")
      .should("not.equal", "none");

    // Fill form fields
    cy.get('[data-testid="title-input"]').type("Test Site");
    cy.get('[data-testid="username-input"]').type("user@test.com");
    cy.get('[data-testid="password-input"]').type("Abcd1234!");

    // Submit
    cy.get('[data-testid="save-password-btn"]').click();

    cy.wait("@createPassword").its("response.statusCode").should("eq", 200);
  });
  

it("Logs In And Fails To Create A Password (Missing Parameters", () => {
  cy.visit("/login");
  cy.get('input[type="email"]').type("test@example.com");
  cy.get('input[type="password"]').type("password123");
  cy.contains("button", /login/i).click();

  // cy.wait("@loginRequest").its("response.statusCode").should("eq", 200);

  // cy.wait("@getPasswords");

  cy.location("pathname").should("eq", "/");

  // Open add password modal
  cy.contains("Add New Password").click();

  cy.get('[data-testid="new-password-modal"]', { timeout: 10000 })
    .should("be.visible")
    // Fix Cypress failing on body's pointer-events
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
    .should('be.visible')
    .and('contain.text', 'Password must be at least 6 characters');

});
});