import TripDetails from './TripDetails.vue'

describe('Component', () => {
  describe('TripDetails', () => {
    it('should render the trip details', () => {
      cy.mount(TripDetails, { props: { routeId: 0 } })
      cy.get('[data-cy="trip-details"]').should('exist')
    })

    it('should show the loop icon and text if the displayed trip is a loop', () => {
      cy.intercept('GET', '/api/routes/1', {
        statusCode: 200,
        body: {
          id: '1',
          name: 'Ehrwald Hiking',
          segments: [
            {
              id: 1,
              name: 'Ehrwald Hiking',
              coordinates: [
                [47.387563828378916, 10.939971758052707, 1127.800048828125],
                [47.38756508566439, 10.939996987581253, 1128],
                [47.38756240345538, 10.940024564042687, 1128.199951171875],
                [47.387563828378916, 10.939971758052707, 1127.800048828125]
              ]
            }
          ]
        }
      })

      cy.mount(TripDetails, { props: { routeId: 1 } })
      cy.get('[data-cy="trip-loop-indicator"]').should('exist')
    })

    it('should zoom to the segment the user clicked on', () => {
      cy.intercept('GET', '/api/routes/1', {
        statusCode: 200,
        body: {
          id: '1',
          name: 'Ehrwald Hiking',
          segments: [
            {
              id: 1,
              name: 'Ehrwald Hiking',
              coordinates: [
                [47.387563828378916, 10.939971758052707, 1127.800048828125],
                [47.38756508566439, 10.939996987581253, 1128],
                [47.38756240345538, 10.940024564042687, 1128.199951171875],
                [47.387563828378916, 10.939971758052707, 1127.800048828125]
              ]
            }
          ]
        }
      })

      let zoomed = false
      cy.mount(TripDetails, {
        global: {
          stubs: {
            Map: {
              methods: {
                add: () => {},
                zoomToSegment: () => {
                  console.log('Kuuhaugen')
                  zoomed = true

                  expect(zoomed).to.be.true
                }
              },
              expose: ['add', 'zoomToSegment']
            }
          }
        },
        props: { routeId: 1 }
      })
      cy.get('[data-cy="trip-segment"]').click()
    })
  })
})
