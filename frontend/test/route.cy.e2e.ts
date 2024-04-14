/* eslint-disable no-undef */

describe('Route', () => {
  it('create a new route', () => {
    cy.visit('/')
    cy.get('[data-cy=singleline-text]').type('Zugspitze')
    cy.get('[data-cy=drop-zone]').selectFile('cypress/fixtures/activity_11982912017.gpx', {
      action: 'drag-drop'
    })

    cy.get('[data-cy=upload-btn]').click()
    cy.reload() // TODO Currently necessary as the upload process does not updates the list of available routes
    cy.get('[data-cy=trip-entry').contains('Zugspitze').click()

    cy.get('[data-cy=button-edit]').click()
    cy.get('[data-cy=drop-zone]').selectFile(
      [
        'cypress/fixtures/images/20230909_102937.jpg',
        'cypress/fixtures/images/20230909_102954.jpg',
        'cypress/fixtures/images/20230909_105445.jpg',
        'cypress/fixtures/images/20230909_105508.jpg',
        'cypress/fixtures/images/20230909_105615.jpg',
        'cypress/fixtures/images/20230909_110041.jpg'
      ],
      {
        action: 'drag-drop'
      }
    )
    cy.get('[data-cy=button-save]').click()
  })
})
