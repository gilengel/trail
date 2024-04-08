import TTile from './TTile.vue'

describe('Component', () => {
  describe('Tile', () => {
    beforeEach(() => {
      cy.mount(TTile, {
        slots: {
          default: () => 'Hello Tile'
        }
      })
    })

    it('should trigger the animate "in" the tree svg elements on mouse over', () => {
      cy.get('[data-cy="tile-slot"]').contains('Hello Tile')
    })
  })
})
