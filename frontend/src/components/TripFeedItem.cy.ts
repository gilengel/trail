import { LeafletSegment } from '@/stores/route/types'
import TripFeedItem from './TripFeedItem.vue'
import L from 'leaflet'

describe('Component', () => {
  describe('TripFeedItem', () => {
    beforeEach(() => {
      ;(cy.getImageStore() as any).as('store')
    })
    it('should render a trip feed item', function () {
      cy.stub(this.store, 'getImagesNearRouteSegment').resolves([
        {
          id: 'aeb50f69-189d-437a-aba6-14f69400b37b',
          timestamp: new Date(),
          name: 'image',
          coordinates: [0, 0],
          url: 'irrelevant'
        }
      ])

      const start = L.latLng(30.712, -74.227)
      const end = L.latLng(90.774, -74.125)

      const segment = new LeafletSegment(0, 'segment', [start, end], 'rgb(255, 0, 0)')

      cy.mount(TripFeedItem as any, { props: { segment } })
      cy.get('[data-cy="trip-feed-item"]').should('exist')
    })
  })
})
