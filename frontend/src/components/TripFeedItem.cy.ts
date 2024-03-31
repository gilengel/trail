import TripFeedItem from './TripFeedItem.vue'

describe('Component', () => {
  describe('TripFeedItem', () => {
    it('should render a trip feed item', () => {
      cy.mount(TripFeedItem)
      cy.get('[data-cy="trip-feed-item"]').should('exist')
    })
  })
})
