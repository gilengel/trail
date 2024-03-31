import DropZone from './DropZone.vue'
import TripUpload from './TripUpload.vue'
import { mockFile } from './__tests__/util'

describe('Component', () => {
  describe('TripUpload', () => {
    it('should render the trip upload element', () => {
      cy.mount(TripUpload)
      cy.get('[data-cy="upload-header"]').should('exist')
    })

    it('should show a success message if files were changed and uploaded', () => {
      cy.intercept('POST', '/api/routes/gpx', {
        statusCode: 200
      })

      cy.mount(TripUpload).then(({ wrapper, component }) => {
        const childWrapper = wrapper.getComponent(DropZone)
        childWrapper.vm.$emit('onFilesChanged', [mockFile('gpx', 1000)])

        cy.get('[data-cy=status-msg]').should('exist').and('have.text', ':)')
      })
    })

    it("should show an error message if files couldn't be uploaded", () => {
      cy.intercept('POST', '/api/routes/gpx', {
        statusCode: 300
      })

      cy.mount(TripUpload).then(({ wrapper, component }) => {
        const childWrapper = wrapper.getComponent(DropZone)
        childWrapper.vm.$emit('onFilesChanged', [mockFile('gpx', 1000)])

        cy.get('[data-cy=status-msg]').should('exist').and('have.text', ':/')
      })
    })
  })
})
