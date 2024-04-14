import { describe, expect } from 'vitest'
import { LeafletRoute, LeafletSegment } from './types'
import L from 'leaflet'

const route = new LeafletRoute(
  0,
  'single route',
  [
    new LeafletSegment(
      0,
      'single segment',
      [
        L.latLng(47.387563828378916, 10.939971758052707),
        L.latLng(47.38756508566439, 10.939996987581253),
        L.latLng(47.38756240345538, 10.940024564042687),
        L.latLng(27.387563828378916, 10.939971758052707)
      ],
      'rgb(255, 255, 255)',
      'some segment description'
    )
  ],
  'some description'
)

const emptyRoute = new LeafletRoute(0, 'single route', [], 'some description')
const emptySegment = new LeafletSegment(0, '', [], '', '')

describe('LeafletRoute', () => {
  it('should set the description if the setter is used', () => {
    expect(route.description).not.to.be.eq('new description')

    route.description = 'new description'

    expect(route.description).to.be.eq('new description')
  })

  it('should set the name if the setter is used', () => {
    expect(route.name).not.to.be.eq('new name')

    route.name = 'new name'

    expect(route.name).to.be.eq('new name')
  })

  it('should get the start coordinate', () => {
    expect(route.start).to.be.toStrictEqual(L.latLng(47.387563828378916, 10.939971758052707))
  })

  it('should return undefined for the start getter if the route has no coordinates', () => {
    expect(emptyRoute.start).to.be.undefined
  })

  it('should get the end coordinate', () => {
    expect(route.end).to.be.toStrictEqual(L.latLng(27.387563828378916, 10.939971758052707))
  })

  it('should return undefined for the end getter if the route has no coordinates', () => {
    expect(emptyRoute.end).to.be.undefined
  })
})

describe('LeafletSegment', () => {
  it('should get the id', () => {
    expect(route.segments[0].id).to.be.eq(0)
  })

  it('should get the name', () => {
    expect(route.segments[0].name).to.be.eq('single segment')
  })

  it('should get the description', () => {
    expect(route.segments[0].description).to.be.eq('some segment description')
  })

  it('should get the color', () => {
    expect(route.segments[0].color).to.be.eq('rgb(255, 255, 255)')
  })

  it('should set the description if the setter is used', () => {
    emptySegment.description = 'new description'

    expect(emptySegment.description).to.be.eq('new description')
  })

  it('should get the start coordinate', () => {
    expect(route.segments[0].start).to.be.toStrictEqual(
      L.latLng(47.387563828378916, 10.939971758052707)
    )
  })

  it('should return undefined for the start getter if the route has no coordinates', () => {
    expect(emptySegment.start).to.be.undefined
  })

  it('should get the end coordinate', () => {
    expect(route.segments[0].end).to.be.toStrictEqual(
      L.latLng(27.387563828378916, 10.939971758052707)
    )
  })

  it('should return undefined for the end getter if the route has no coordinates', () => {
    expect(emptySegment.end).to.be.undefined
  })

  it('should get polyline', () => {
    expect(route.segments[0].polyline).to.be.toStrictEqual(
      L.polyline(route.segments[0].coordinates, { color: 'rgb(255, 255, 255)', weight: 3 })
    )
  })
})
