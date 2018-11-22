const apiUrl = Cypress.env('apiUrl');

Cypress.Commands.add('mockGetTodos', (options = {}) => {
  cy
    .server()
    .route({
      method: 'GET',
      url: apiUrl,
      response: 'fx:getTodos',
      ...options,
    })
    .as('getTodos');
});

Cypress.Commands.add('mockPostTodo', (options = {}) => {
  cy
    .server()
    .route({
      method: 'POST',
      url: apiUrl,
      response: {},
      status: 201,
      ...options,
    })
    .as('postTodo');
});
