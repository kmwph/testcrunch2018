/// <reference types="Cypress" />
import {
  todoFilters,
} from '../../src/constants';

context('Mocked', function () {
  const todoName = `Cypress ${Cypress.moment().format('YY-MM-DD x')}`;

  beforeEach(function () {
    cy.mockGetTodos();
  });

  context('Create', function () {
    beforeEach(function () {
      const response = {
        success: 'true',
        message: 'todo added successfully',
        data: {
          id: 'ld8i5cm00cb',
          name: todoName,
          finished: false,
        },
      };

      cy.mockPostTodo({ response });
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
      cy.mockPostTodo({ status: 500 });

      cy
        .visit('')
        .createTodo(todoName);

      cy
        .get('[data-cy="alert"]')
        .should('have.length', 1)
        .and('contain', 'Error during create todo');
    });
  });

  context('Data displayed correctly', function () {
    beforeEach(function () {
      cy
        .fixture('getTodos')
        .then((todos) => {
          cy.wrap({
            all: todos.data,
            active: todos.data.filter(i => !i.finished),
            completed: todos.data.filter(i => i.finished),
          })
            .as('todos');
        });
    });

    const categoryKeys = Object.values(todoFilters);
    categoryKeys.forEach((category) => {
      it(`Category [${category}] is displayed correctly`, function () {
        cy
          .visit(`#/todo?show=${category}`)
          .get('[data-cy="todo-item__name"]')
          .then((elements) => {
            const actualTodoNames = elements.toArray().map(i => i.innerText);
            const expectedTodoNames = this.todos[category].map(i => i.name);

            cy.expect(actualTodoNames).to.deep.equal(expectedTodoNames);
          });
      });
    });
  });
});
