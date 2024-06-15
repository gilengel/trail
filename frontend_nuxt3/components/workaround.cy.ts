// @ts-ignore
const allFilesGlobExcludingCypress: Record<string, () => Promise<unknown>> = import.meta.glob([
  './**/*.{ts,vue}',
  '!./**/*.cy.ts'
])

describe('CoverageWorkaround', () => {
  it(
    'should import all files to make coverage report complete',
    { defaultCommandTimeout: 60000 },
    async () => {
      const isCoverageEnabled = Cypress.env('coverage')
      if (!isCoverageEnabled) {
        return
      }
      for (const file in allFilesGlobExcludingCypress) {
        await allFilesGlobExcludingCypress[file]()
      }
    }
  )
})
