import TButton from './TButton.vue'

describe('Component', () => {
  describe('Button', () => {
    it('should render a button with the text "Hello Button"', () => {
      cy.mount(TButton as any, { props: { label: 'Hello Button' } })
      cy.get('[data-cy="button-label"]').should('contain.text', 'Hello Button')
    })

    it('should render the child element into the slot', () => {
      cy.mount(TButton as any, {
        props: { label: 'Hello Button' },
        slots: {
          default: '<h1>Test</h1>'
        }
      })
      cy.get('h1').should('exist').and('contain.text', 'Test')
    })
  })
})
