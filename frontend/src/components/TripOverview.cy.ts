import TripOverview from './TripOverview.vue'

describe('Component', () => {
  describe('With existing trips', () => {
    beforeEach(() => {
      ;(cy.getRouteStore() as any).as('store')
    })

    it('should render the images of a trip', function () {
      cy.mount(TripOverview as any)
      cy.get('h1').should('exist').and('have.text', 'Trip Overview')
    })

    it('should emit a signal after a trip was selected', function () {
      this.store.routesWithoutSegments.push({
        id: 42,
        name: 'intercepted route',
        segments: [
          {
            id: 1,
            name: 'intercepted route',
            coordinates: [
              [47.387563828378916, 10.939971758052707, 1127.800048828125],
              [47.38756508566439, 10.939996987581253, 1128],
              [47.38756240345538, 10.940024564042687, 1128.199951171875],
              [47.387563828378916, 10.939971758052707, 1127.800048828125]
            ]
          }
        ]
      })

      cy.mount(TripOverview as any).then(({ wrapper }) => {
        cy.get('[data-cy="trip-entry"]').click()
        cy.wait(100).then(() => {
          const emitted = wrapper.emitted('selectedTripChanged')
          expect(emitted?.length).to.be.equal(1)

          const id = emitted as unknown[][]
          expect(id[0][0]).to.be.equal(42)
        })
      })
    })

    it('should render a message that no trips exist', function () {
      this.store.routesWithoutSegments = []
      cy.mount(TripOverview as any)
      cy.get('[data-cy=error-empty-text]').should('exist')
    })

    it('should render a message if there was a network error', function () {
      this.store.networkError = true

      cy.mount(TripOverview as any)
      cy.get('[data-cy=error-network-text]').should('exist')
    })
  })
})
