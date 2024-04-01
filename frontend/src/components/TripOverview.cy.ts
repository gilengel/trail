import TripOverview from './TripOverview.vue'

describe('Component', () => {
  beforeEach(() => {
    cy.getStore().as('store')
  })
  describe('TripOverview', () => {
    it('should render the images of a trip', function () {
      cy.stub(this.store, 'getRoutes').returns([
        {
          id: 1,
          name: 'Trip 1'
        }
      ])

      cy.mount(TripOverview)
      cy.get('[data-cy="trip-overview-h"]').should('exist')
    })

    it('should emit a signal after a trip was selected', function () {
      cy.stub(this.store, 'getRoutes').returns([
        {
          id: 42,
          name: 'Trip 2'
        }
      ])

      cy.mount(TripOverview).then(({ wrapper }) => {
        cy.get('[data-cy="trip-entry"]').click()
        cy.wait(100).then(() => {
          const emitted = wrapper.emitted('selectedTripChanged')
          expect(emitted?.length).to.be.equal(1)

          const id = emitted as unknown[][]
          expect(id[0][0]).to.be.equal(42)
        })
      })
    })

    /*
    it("should show an error if the backend couldn't be reached", () => {
      cy.intercept('GET', '/api/routes', {
        statusCode: 404
      })

      cy.mount(TripOverview)
      cy.get('[data-cy=error-empty-text').should('not.exist')
      cy.get('[data-cy=error-network-text').should('exist')
    })
    */
  })
})
