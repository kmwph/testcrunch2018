/// <reference types="Cypress" />

context('Mocked', function () {
  const todoName = `Cypress ${Cypress.moment().format('YY-MM-DD x')}`;

  beforeEach(function () {
    const apiUrl = Cypress.env('apiUrl');

    cy
      .server()
      .route({
        method: 'GET',
        url: apiUrl,
        response: 'fx:getTodos',
      });

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
      .get('[data-cy="create-input"]')
      .type(todoName)
      .type('{enter}');

    cy
      .get(`[data-cy="todo-item"][data-cy-name="${todoName}"]`)
      .should('have.length', 1)
      .and('contain', todoName);
  });

  it('Create todo => correct request sent', function () {
    cy
      .visit('')
      .get('[data-cy="create-input"]')
      .type(todoName)
      .type('{enter}');

    cy
      .wait('@postTodo')
      .then((xhr) => {
        expect(xhr.request.body).to.deep.equal({
          name: todoName,
        });
      });
  });
});
