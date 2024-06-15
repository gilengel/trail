import AnimatedButton from './AnimatedButton.vue'

describe('Component', () => {
  describe('AnimatedButton', () => {
    beforeEach(() => {
      cy.mount(AnimatedButton as any)
    })

    it('should trigger the animate "in" the tree svg elements on mouse over', () => {
      cy.get('[data-cy="animated-btn"]').trigger('mouseover')
      cy.get('[data-cy=svg-tree]').should('have.class', 'out')
    })

    it('should trigger the animate "in" the tree svg elements on focus in', () => {
      cy.get('[data-cy="animated-btn"]').trigger('focusin')
      cy.get('[data-cy=svg-tree]').should('have.class', 'out')
    })

    it('should trigger the animate "out" the tree svg elements on mouse leave', () => {
      cy.get('[data-cy="animated-btn"]').trigger('mouseleave')
      cy.get('[data-cy=svg-tree]').should('have.class', 'in')
    })

    it('should trigger the animate "out" the tree svg elements on focus out', () => {
      cy.get('[data-cy="animated-btn"]').trigger('focusout')
      cy.get('[data-cy=svg-tree]').should('have.class', 'in')
    })
    /*
    it('should do nothing if clicked on "Upload" if no file was selected to be uploaded', () => {
      cy.get('[data-test=upload-btn]').click()
    })

    it('should update a file', () => {
      cy.intercept(
        {
          method: 'POST', // Route all GET requests
          url: 'http://localhost:3000/routes/gpx' // that have a URL that matches '/users/*'
        },
        [] // and force the response to be: []
      )

      cy.get('input[type=file]').selectFile('src/components/__tests__/data/short.gpx')
      cy.get('[data-test=upload-btn]').click()
    })
    */
  })
})
