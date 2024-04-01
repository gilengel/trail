import type { LatLng } from 'leaflet'
import L from 'leaflet'

export type RouteWithoutSegments = {
  id: number
  name: string
}

export interface RouteDto {
  id: number
  name: string
  segments: RouteSegmentDto[]
}

export interface RouteSegmentDto {
  id: number
  name: string
  coordinates: number[][]
  color: string
}

export interface Segment {
  get start(): L.LatLng | undefined
  get end(): L.LatLng | undefined
}

export class LeafletRoute implements Segment {
  constructor(
    private _id: number,
    private _name: string,
    private _segments: LeafletSegment[]
  ) {}

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }

  get segments(): LeafletSegment[] {
    return this._segments
  }

  get start(): LatLng | undefined {
    if (this._segments.length == 0) {
      return undefined
    }

    return this._segments[0].start
  }
  get end(): LatLng | undefined {
    if (this._segments.length == 0) {
      return undefined
    }

    return this._segments[this._segments.length - 1].end
  }
}

export class LeafletSegment implements Segment {
  private _polyline: L.Polyline

  constructor(
    private _id: number,
    private _name: string,
    _coordinates: L.LatLng[],
    private _color: string
  ) {
    this._polyline = L.polyline(_coordinates, { color: _color })
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get coordinates(): L.LatLng[] {
    return this._polyline.getLatLngs() as LatLng[]
  }

  get color(): string {
    return this._color
  }

  get start(): LatLng | undefined {
    if (this._polyline.getLatLngs().length == 0) {
      return undefined
    }

    return this._polyline.getLatLngs()[0] as LatLng
  }

  get end(): LatLng | undefined {
    if (this._polyline.getLatLngs().length == 0) {
      return undefined
    }

    return this._polyline.getLatLngs()[this._polyline.getLatLngs().length - 1] as LatLng
  }

  get polyline(): L.Polyline {
    return this._polyline
  }
}
