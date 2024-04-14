import TripImages from './TripImages.vue'

describe('Component', () => {
  beforeEach(() => {
    ;(cy.getImageStore() as any).as('store')
  })
  describe('TripImages', () => {
    it('should render the images of a segment', function () {
      cy.stub(this.store, 'getImagesNearRouteSegment').resolves([
        {
          id: 'aeb50f69-189d-437a-aba6-14f69400b37b',
          timestamp: new Date(),
          name: 'image',
          coordinates: [0, 0],
          url: 'irrelevant'
        }
      ])

      cy.mount(TripImages as any)
      cy.get('[data-cy="trip-images"]').should('exist')
      cy.get('[data-cy="single-image"]').should('exist')
    })
  })
})
