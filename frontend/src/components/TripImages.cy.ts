import TripImages from './TripImages.vue'

describe('Component', () => {
  describe('TripImages', () => {
    it('should render the images of a trip', () => {
      cy.mount(TripImages)
      cy.get('[data-cy="trip-images"]').should('exist')
    })
  })
})
