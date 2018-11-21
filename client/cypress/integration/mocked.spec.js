/// <reference types="Cypress" />

context('Mocked', function () {
  const todoName = `Cypress ${Cypress.moment().format('YY-MM-DD x')}`;
  const apiUrl = Cypress.env('apiUrl');

  beforeEach(function () {
    cy
      .server()
      .route({
        method: 'GET',
        url: apiUrl,
        response: 'fx:getTodos',
      });
  });

  context('Create', function () {
    beforeEach(function () {
      const postResponse = {
        success: 'true',
        message: 'todo added successfully',
        data: {
          id: 'ld8i5cm00cb',
          name: todoName,
          finished: false,
        },
      };

      cy
        .route({
          method: 'POST',
          url: apiUrl,
          response: postResponse,
          status: 201,
        })
        .as('postTodo');
    });

    it('Create todo => todo added to the list', function () {
      cy
        .visit('')
        .createTodo(todoName);

      cy
        .get(`[data-cy="todo-item"][data-cy-name="${todoName}"]`)
        .should('have.length', 1)
        .and('contain', todoName);
    });

    it('Create todo => correct request sent', function () {
      cy
        .visit('')
        .createTodo(todoName);

      cy
        .wait('@postTodo')
        .then((xhr) => {
          expect(xhr.request.body).to.deep.equal({
            name: todoName,
          });
        });
    });
  });

  context('Errors', function () {
    it('Create todo error => alert displayed', function () {
      cy
        .route({
          method: 'POST',
          url: apiUrl,
          response: {},
          status: 500,
        })
        .as('postTodoError');

      cy
        .visit('')
        .createTodo(todoName);

      cy
        .get('[data-cy="alert"]')
        .should('have.length', 1)
        .and('contain', 'Error during create todo');
    });
  });
});
