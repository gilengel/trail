import { type LeafletSegment } from './map'
import Map from './Map.vue'
import L from 'leaflet'

describe('Component', () => {
  describe('Map', () => {
    it('should render the map properly on start', () => {
      cy.mount(Map)
      cy.get('[data-cy="map-container"]').should('have.class', 'leaflet-container')
    })

    it('should pan to new location', () => {
      cy.mount(Map).then(({ wrapper }) => {
        console.log(wrapper.vm.panTo(new L.LatLng(10, 10)))

        cy.get('.leaflet-map-pane')
          .then(($el) => {
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(1, 0, 0, 1, 3660, -659)')
      })
    })

    it('should fit view to bounds', () => {
      cy.mount(Map).then(({ wrapper }) => {
        const southWest = L.latLng(30.712, -74.227)
        const northEast = L.latLng(90.774, -74.125)
        const bounds = L.latLngBounds(southWest, northEast)

        console.log(wrapper.vm.fitBounds(bounds))

        cy.get('.leaflet-zoom-animated')
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(0.0625, 0, 0, 0.0625, 703, 467)')
      })
    })

    it('should zoom to segment', () => {
      cy.mount(Map).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227)
        const end = L.latLng(90.774, -74.125)

        const route = new L.Polyline([start, end])

        const segment: LeafletSegment = {
          id: 0,
          name: 'segment',
          color: 'rgb(255, 0, 0)',
          start: new L.Marker(start),
          end: new L.Marker(end),
          route,
          length: 0
        }

        wrapper.vm.zoomToSegment(segment)

        cy.get('.leaflet-zoom-animated')
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(0.0625, 0, 0, 0.0625, 703, 467)')
      })
    })

    it('should add an element to the map', () => {
      cy.mount(Map).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227)

        wrapper.vm.add(new L.Marker(start))

        cy.get('.leaflet-marker-pane > img').should('have.length', 1)
      })
    })
  })
})
