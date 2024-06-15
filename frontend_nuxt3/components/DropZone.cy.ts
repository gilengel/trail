import { mockFile } from './__tests__/util'
import DropZone from '@/components//DropZone.vue'

describe('Component', () => {
  describe('DropZone', () => {
    beforeEach(() => {
      cy.mount(DropZone as any, {
        props: {
          allowedFileExtensions: ['gpx']
        }
      })
    })

    it('should display "Release to drop files here." if the user is dragging a file over', () => {
      cy.get('[data-cy="drop-zone"]').trigger('dragover')
      cy.get('[data-cy=release-msg]').should('exist')
    })

    it('should display "Drop files here or <u>click here</u> to upload." if the user is dragging out of the element', () => {
      cy.get('[data-cy="drop-zone"]').trigger('dragover')
      cy.get('[data-cy=release-msg]').should('exist')
      cy.get('[data-cy="drop-zone"]').trigger('dragleave')
      cy.get('[data-cy=release-msg]').should('not.exist')

      /*
      cy.intercept(
        {
          method: 'POST', // Route all GET requests
          url: 'http://localhost:3000/routes/gpx' // that have a URL that matches '/users/*'
        },
        [] // and force the response to be: []
      )
      */
    })

    it('should display "File has wrong type." if the dropped file is of an unallowed type', () => {
      const dataTransfer = new DataTransfer()

      dataTransfer.items.add(mockFile('.txt', 1000))
      cy.get('[data-cy="drop-zone"]').trigger('drop', { dataTransfer })
      cy.get('[data-cy=wrong-file-extension]').should('exist')
    })

    it('should hide "File has wrong type." after timeout', () => {
      const dataTransfer = new DataTransfer()

      dataTransfer.items.add(mockFile('.txt', 1000))
      cy.get('[data-cy="drop-zone"]').trigger('drop', { dataTransfer })
      cy.get('[data-cy=wrong-file-extension]').should('exist')
      cy.wait(3001)
      cy.get('[data-cy=wrong-file-extension]').should('not.exist')
    })

    it('should display the dropped file(s)', () => {
      const dataTransfer = new DataTransfer()

      dataTransfer.items.add(mockFile('.gpx', 1000))
      cy.get('[data-cy="drop-zone"]').trigger('drop', { dataTransfer })
      cy.get('[data-cy=preview-container]').should('exist')
    })

    it('should remove a dropped file if clicked on the trash button', () => {
      const dataTransfer = new DataTransfer()

      dataTransfer.items.add(mockFile('.gpx', 1000))
      cy.get('[data-cy="drop-zone"]').trigger('drop', { dataTransfer })

      cy.get('[data-cy="delete-btn"]').click()
      cy.get('[data-cy=preview-container]').should('not.exist')
    })
  })
})
