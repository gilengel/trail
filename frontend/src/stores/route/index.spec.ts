import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, expect, vi, type MockedFunction } from 'vitest'
import { useRouteStore } from './index'
import * as L from 'leaflet'

import axios from 'axios'
import { LeafletRoute, LeafletSegment } from './types'
import { mockFile } from '@/components/__tests__/util'

vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn()
        },
        response: {
          use: vi.fn(),
          eject: vi.fn()
        }
      }
    }
  }
})

const route = {
  id: 0,
  name: 'single route',
  description: 'some description',

  segments: [
    {
      name: 'single route segment',
      coordinates: [
        [47.387563828378916, 10.939971758052707],
        [47.38756508566439, 10.939996987581253],
        [47.38756240345538, 10.940024564042687],
        [47.387563828378916, 10.939971758052707]
      ]
    }
  ]
}

const expected = new LeafletRoute(
  route.id,
  route.name,
  [
    new LeafletSegment(
      0,
      route.segments[0].name,
      [
        L.latLng(47.387563828378916, 10.939971758052707),
        L.latLng(47.38756508566439, 10.939996987581253),
        L.latLng(47.38756240345538, 10.940024564042687),
        L.latLng(47.387563828378916, 10.939971758052707)
      ],
      ''
    )
  ],
  route.description
)

describe('Route Store', () => {
  beforeEach(() => {
    const get = axios.get as MockedFunction<typeof axios.get>
    get.mockReset()

    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('should contact the backend to receive a list of routes', async () => {
    const routeStore = useRouteStore()

    const get = axios.get as MockedFunction<typeof axios.get>
    get.mockResolvedValue({
      data: []
    })

    const routes = await routeStore.getRoutes()

    expect(routes).to.be.toStrictEqual([])
  })

  it('should store that there was a network error if the backend call to receive all routes was unsuccessful', async () => {
    const routeStore = useRouteStore()

    const get = axios.get as MockedFunction<typeof axios.get>
    get.mockRejectedValue({})

    await expect(() => routeStore.getRoutes()).rejects.toThrow()
  })

  it('should store that there was a network error if the backend call to receive one route was unsuccessful', async () => {
    const routeStore = useRouteStore()

    const get = axios.get as MockedFunction<typeof axios.get>
    get.mockRejectedValue({})

    await expect(() => routeStore.getRoute(0)).rejects.toThrow()
  })

  it('should contact the backend to receive a single route', async () => {
    const routeStore = useRouteStore()

    const get = axios.get as MockedFunction<typeof axios.get>
    get.mockResolvedValue({
      data: route
    })

    const routes = await routeStore.getRoute(0)

    expect(routes.id).to.be.eq(expected.id)
    expect(routes.name).to.be.eq(expected.name)
    expect(routes.description).to.be.eq(expected.description)
    expect(routes.segments[0].coordinates).to.be.toStrictEqual(expected.segments[0].coordinates)
  })

  it('should return a cached route if requested multiple times', async () => {
    const routeStore = useRouteStore()

    const spy = vi.spyOn(axios, 'get')

    const get = axios.get as MockedFunction<typeof axios.get>
    get.mockResolvedValue({
      data: route
    })

    const routes = await routeStore.getRoute(0)
    await routeStore.getRoute(0)

    expect(routes.id).to.be.eq(expected.id)
    expect(routes.name).to.be.eq(expected.name)
    expect(routes.description).to.be.eq(expected.description)
    expect(routes.segments[0].coordinates).to.be.toStrictEqual(expected.segments[0].coordinates)

    expect(spy).toBeCalledTimes(1)
  })

  it('should contact the backend to persist changes made to the route and return the changed route', async () => {
    const routeStore = useRouteStore()

    const patch = axios.patch as MockedFunction<typeof axios.patch>
    patch.mockResolvedValue({})

    const spy = vi.spyOn(axios, 'patch')

    await routeStore.updateRoute(expected)
    expect(spy).toBeCalledTimes(1)
  })

  it('should contact the backend to store a new route', async () => {
    const routeStore = useRouteStore()

    const post = axios.post as MockedFunction<typeof axios.post>
    post.mockResolvedValue({})

    const spy = vi.spyOn(axios, 'post')

    await routeStore.addRoute('new route', [mockFile('gpx', 1000)])
    expect(spy).toBeCalledTimes(1)
  })
})
