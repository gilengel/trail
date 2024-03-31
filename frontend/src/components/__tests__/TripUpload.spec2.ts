import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import TripUpload from '../TripUpload.vue'

function mockFile() {
  const blob = new Blob([''], { type: 'application/gpx+xml' })
  const file = <File>blob
  
  return file;
}

describe('TripUpload', () => {
  it('renders properly', () => {
    const wrapper = mount(TripUpload, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Upload Trip')
  })
})

describe('TripUpload', () => {
    it('uploads a trip', async () => {
      //vi.mocked(axios.post).mockResolvedValue({})

      const wrapper = mount(TripUpload, { props: { msg: 'Hello Vitest' } })
      expect(wrapper.text()).toContain('Upload Trip')

      const input = wrapper.get('[data-test="gpx-file-input"]');
      Object.defineProperty(input.element, 'files', {
        value: [mockFile()],
        writable: false,
    });  

      await wrapper.get('[data-test="upload-btn"]').trigger('click')
    })
  })
  