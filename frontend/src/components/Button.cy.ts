import Button from './Button.vue'

describe('Component', () => {
  describe('Button', () => {
    it('should render a button with the text "Hello Button"', () => {
      cy.mount(Button, { props: { title: 'Hello Button' } })
      cy.get('[data-cy="button-label"]').should('contain.text', 'Hello Button')
    })
  })
})
