/* eslint-disable no-undef */

describe('Navigation', () => {
  it('should display home', () => {
    // cy.visit() used to visit a remote url
    // learn more about it here: https://docs.cypress.io/api/commands/visit#Syntax
    cy.visit('/')

    // cy.get() command Gets one or more DOM elements by selector or alias
    // learn more about Cypress commands/api here: https://docs.cypress.io/api/table-of-contents
    cy.get('#app').should('be.visible')
  })

  it('should show a single route detail', () => {
    cy.fixture('activity_11982912017.gpx', 'binary')
      .then((file) => Cypress.Blob.binaryStringToBlob(file))
      .then((blob) => {
        const formData = new FormData()
        formData.append('name', 'Test Route')
        formData.append('files', blob, 'activity_11982912017.gpx')

        cy.request({
          url: 'http://localhost:3000/routes/gpx',
          method: 'POST',
          headers: {
            'content-type': 'multipart/form-data'
          },
          body: formData
        })

        cy.visit('/')
        cy.get('[data-cy=trip-entry').first().click()
        cy.url().should('include', '/route/')
      })
  })

  it('should display the about page', () => {
    // cy.visit() used to visit a remote url
    // learn more about it here: https://docs.cypress.io/api/commands/visit#Syntax
    cy.visit('/about')

    // cy.get() command Gets one or more DOM elements by selector or alias
    // learn more about Cypress commands/api here: https://docs.cypress.io/api/table-of-contents
    cy.get('.about').should('be.visible')
  })
})
