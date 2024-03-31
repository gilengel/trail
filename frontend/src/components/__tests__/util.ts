export const mockFile = (type: string, size: number): File => {
  const fileName = (Math.random() * 1000).toString().replace('.', '') + type.toLowerCase()
  const file = new File([''], fileName)
  Object.defineProperty(file, 'size', { value: size })
  return file
}
