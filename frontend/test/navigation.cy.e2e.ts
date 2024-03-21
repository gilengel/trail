/* eslint-disable no-undef */

describe('Navigation', () => {
  it('should display empty state message', () => {
    // cy.visit() used to visit a remote url
    // learn more about it here: https://docs.cypress.io/api/commands/visit#Syntax
    cy.visit('http://localhost:8081')

    // cy.get() command Gets one or more DOM elements by selector or alias
    // learn more about Cypress commands/api here: https://docs.cypress.io/api/table-of-contents
    cy.get('.empty-state-message')
      .contains('Nothing left in the list. Add a new todo in the input above.')
      .should('be.visible')
  })
})
