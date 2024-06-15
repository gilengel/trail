import TIcon from './TIcon.vue'

describe('Component', () => {
  describe('TIcon', () => {
    it('should render the icon', () => {
      cy.mount(TIcon as any)
      cy.get('[data-cy="t-icon"]').should('exist')
    })
  })
})
