/// <reference types="Cypress" />

context('E2E', function () {
  it('Create todo', function () {
    const todoName = `Cypress ${Cypress.moment().format('YY-MM-DD x')}`;

    cy
      .visit('')
      .get('[data-cy="create-input"]')
      .type(todoName)
      .type('{enter}');

    cy
      .get(`[data-cy="todo-item"][data-cy-name="${todoName}"]`)
      .should('have.length', 1)
      .and('contain', todoName);
  });
});
