import TToolbar from '@/components/toolbar/TToolbar.vue'

describe('Component', () => {
  describe('Toolbar', () => {
    it('should render a toolbar', () => {
      cy.mount(TToolbar as any)
      cy.get('[data-cy="ttoolbar"]').should('exist')
    })
  })
})
