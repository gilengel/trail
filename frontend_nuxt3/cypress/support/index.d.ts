import { RouteStore } from '../../src/stores/route'
import { ImageStore } from '../../src/stores/image'

declare global {
  namespace Cypress {
    interface Chainable {
      getRouteStore(): RouteStore
      getImageStore(): ImageStore
    }
  }
}
