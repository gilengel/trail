import SingleLineText from './SingleLineText.vue'

describe('Component', () => {
  describe('SingleLineText', () => {
    it('should show a supporting label if provided as property', function () {
      cy.mount(SingleLineText as any, { props: { supportText: 'SupportText' } }).then(() => {
        cy.get('[data-cy="tlabel"]').should('exist').and('contain.text', 'SupportText')
      })
    })

    it('should be highlighted if focused', () => {
      cy.mount(SingleLineText as any)
      cy.get('[data-cy="singleline-text-container"]').should('not.have.class', 'focused')
      cy.get('[data-cy="singleline-text"]').focus()
      cy.get('[data-cy="singleline-text-container"]').should('have.class', 'focused')
    })

    it('should not be highlighted if focused lost', () => {
      cy.mount(SingleLineText as any)
      cy.get('[data-cy="singleline-text"]').focus()
      cy.get('[data-cy="singleline-text-container"]').should('have.class', 'focused')
      cy.get('[data-cy="singleline-text"]').blur()
      cy.get('[data-cy="singleline-text-container"]').should('not.have.class', 'focused')
    })

    it('should emit a valueChanged signal after the value was changed', function () {
      cy.mount(SingleLineText as any).then(({ wrapper }) => {
        cy.get('[data-cy="singleline-text"]').type('UnimportantText')
        cy.wait(100).then(() => {
          const emitted = wrapper.emitted('valueChanged')
          expect(emitted?.length).to.be.equal(15)
        })
      })
    })
  })
})
