import { LeafletSegment } from '@/stores/route/types'
import TMap from './TMap.vue'
import L from 'leaflet'

describe('Component', () => {
  describe('Map', () => {
    it('should render the map properly on start', () => {
      cy.mount(TMap as any)
      cy.get('[data-cy="map-container"]').should('have.class', 'leaflet-container')
    })

    it('should pan to new location', () => {
      cy.mount(TMap as any).then(({ wrapper }) => {
        wrapper.vm.panTo(new L.LatLng(10, 10))

        cy.get('.leaflet-map-pane')
          .then(($el) => {
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(1, 0, 0, 1, 3660, -659)')
      })
    })

    it('should fit view to bounds', () => {
      cy.mount(TMap as any).then(({ wrapper }) => {
        const southWest = L.latLng(30.712, -74.227)
        const northEast = L.latLng(90.774, -74.125)
        const bounds = L.latLngBounds(southWest, northEast)

        wrapper.vm.fitBounds(bounds)

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
      cy.mount(TMap as any).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227)
        const end = L.latLng(90.774, -74.125)

        const segment = new LeafletSegment(0, 'segment', [start, end], 'rgb(255, 0, 0)')

        wrapper.vm.zoomToSegment(segment)

        cy.get('.leaflet-zoom-animated')
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(0.0625, 0, 0, 0.0625, -6788, -1919)')
      })
    })

    it('should zoom to segment with a route containing only one segment', () => {
      cy.mount(TMap as any).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227)
        const end = L.latLng(90.774, -74.125)

        const segment = new LeafletSegment(0, 'segment', [start, end], 'rgb(255, 0, 0)')

        wrapper.vm.zoomToSegments([segment])

        cy.get('.leaflet-zoom-animated')
          .first()
          .then(($el) => {
            console.log(window.getComputedStyle($el[0]))
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(0.0625, 0, 0, 0.0625, -6788, -1919)')
      })
    })

    it('should zoom to segments', () => {
      cy.mount(TMap as any).then(({ wrapper }) => {
        const segments: LeafletSegment[] = []
        const coordinates = [
          [L.latLng(69.790853, 30.794443), L.latLng(29.07997, 7.508152)],
          [L.latLng(29.07997, 7.508152), L.latLng(7.94894, 0.074356)]
        ]

        for (let i = 0; i < coordinates.length; i++) {
          segments.push(new LeafletSegment(i, `segment_${i}`, coordinates[i], 'rgb(255, 0, 0)'))
        }

        wrapper.vm.zoomToSegments(segments)

        cy.get('.leaflet-zoom-animated')
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(0.0625, 0, 0, 0.0625, -2965, -490)')
      })
    })

    it('should not zoom if segments are empty', () => {
      cy.mount(TMap as any).then(({ wrapper }) => {
        wrapper.vm.zoomToSegments([])

        cy.get('.leaflet-zoom-animated')
          .first()
          .then(($el) => {
            return window.getComputedStyle($el[0])
          })
          .invoke('getPropertyValue', 'transform')
          .should('equal', 'matrix(1, 0, 0, 1, 0, 0)')
      })
    })

    it('should add an element to the map', () => {
      cy.mount(TMap as any).then(({ wrapper }) => {
        const start = L.latLng(30.712, -74.227)

        wrapper.vm.add(new L.Marker(start))

        cy.get('.leaflet-marker-pane > img').should('have.length', 1)
      })
    })
  })
})
