import TripUpload from './TripUpload.vue'

describe('Component', () => {
  describe('TripUpload', () => {
    beforeEach(() => {
      cy.mount(TripUpload)
    })
    it('should mount with greeting', () => {
      cy.contains('Upload Trip')
    })

    it('should do nothing if clicked on "Upload" if no file was selected to be uploaded', () => {
      cy.get('[data-test=upload-btn]').click()
    })

    it('should update a file', () => {
      cy.get('input[type=file]').selectFile('src/components/__tests__/data/short.gpx')
      cy.get('[data-test=upload-btn]').click()
    })
  })
})
