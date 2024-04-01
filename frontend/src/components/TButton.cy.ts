import TButton from './TButton.vue'

describe('Component', () => {
  describe('Button', () => {
    it('should render a button with the text "Hello Button"', () => {
      cy.mount(TButton, { props: { label: 'Hello Button' } })
      cy.get('[data-cy="button-label"]').should('contain.text', 'Hello Button')
    })
  })
})
