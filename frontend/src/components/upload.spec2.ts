import { describe, test, vi } from 'vitest'
import axios from 'axios'
import { uploadTrips } from './upload'

vi.mock('axios')

export function mockFile() {
  const blob = new Blob([''], { type: 'application/gpx+xml' })
  const file = <File>blob
  
  return file;
}


describe('upload', () => {
  const getMockTripFiles = () => {

    const file = mockFile();
    const files = [file, file]

    const fileList: FileList = Object.create(files)
    for (let i = 0; i < files.length; i++) {
      fileList[i] = files[i]
    }
    Object.defineProperty(fileList, 'length', { value: files.length })
    return fileList
  }

  test('makes a POST request to upload a gpx trip', async () => {
    vi.mocked(axios.post).mockResolvedValue({})

    const files = getMockTripFiles()

    uploadTrips(files)
  })
})
