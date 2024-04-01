import TripAspects from './TripAspects.vue'

describe('Component', () => {
  describe('TripAspects', () => {
    it('should render the loop indicator if prop is set to true', () => {
      cy.mount(TripAspects, { props: { tripLength: 0, tripIsLoop: true } })
      cy.get('[data-cy="trip-loop-indicator"]').should('exist')
    })

    it('should not render the loop indicator if prop is set to false', () => {
      cy.mount(TripAspects, { props: { tripLength: 0, tripIsLoop: false } })
      cy.get('[data-cy="trip-loop-indicator"]').should('not.exist')
    })
  })
})
