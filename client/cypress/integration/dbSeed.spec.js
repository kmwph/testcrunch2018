/// <reference types="Cypress" />

context('DB Seed', function () {
  const apiUrl = Cypress.env('apiUrl');

  beforeEach(function () {
    cy.request(apiUrl).then((response) => {
      const todos = response.body.data;

      todos.forEach((todo) => {
        cy.request('DELETE', `${apiUrl}/${todo.id}`);
      });
    });
  });

  it('Create todo', function () {
    const todoName = `Cypress ${Cypress.moment().format('YY-MM-DD x')}`;

    cy
      .visit('')
      .createTodo(todoName);

    cy
      .get(`[data-cy="todo-item"][data-cy-name="${todoName}"]`)
      .should('have.length', 1)
      .and('contain', todoName);
  });
});
