export const mockFile = (type: string, sizeInBytes: number): File => {
  const fileName = (Math.random() * 1000).toString().replace('.', '') + type.toLowerCase()
  const file = new File([''], fileName)
  Object.defineProperty(file, 'size', { value: sizeInBytes })
  return file
}
