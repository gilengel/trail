import Tile from './Tile.vue'

describe('Component', () => {
  describe('Tile', () => {
    beforeEach(() => {
      cy.mount(Tile, {
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
