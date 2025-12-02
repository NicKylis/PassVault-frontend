// Custom Cypress commands

Cypress.Commands.add("loginViaApi", (email: string, password: string) => {
  return cy.request("POST", "/login", { email, password }).then((resp) => {
    if (resp.status === 200 && resp.body?.token) {
      window.localStorage.setItem("token", resp.body.token);
      window.localStorage.setItem("user", JSON.stringify(resp.body.user || {}));
      cy.wrap(resp.body);
    }
  });
});

// Simple helper for filling the new password modal
Cypress.Commands.add("fillNewPassword", (payload: any) => {
  if (payload.title)
    cy.get('[data-testid="title-input"]').clear().type(payload.title);
  if (payload.website)
    cy.get('[data-testid="website-input"]').clear().type(payload.website);
  if (payload.username)
    cy.get('[data-testid="username-input"]').clear().type(payload.username);
  if (payload.password)
    cy.get('[data-testid="password-input"]').clear().type(payload.password);
  if (payload.notes)
    cy.get('[data-testid="notes-input"]').clear().type(payload.notes);
});
