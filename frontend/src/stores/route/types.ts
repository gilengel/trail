import type { LatLng } from 'leaflet'
import L from 'leaflet'

export type RouteWithoutSegments = {
  id: number
  name: string
}

export interface RouteDto {
  id: number
  name: string
  description?: string
  segments: RouteSegmentDto[]
}

export interface RouteSegmentDto {
  id: number
  name: string
  description?: string
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
    private _segments: LeafletSegment[],
    private _description?: string
  ) {}

  get id(): number {
    return this._id
  }

  get description(): string | undefined {
    return this._description
  }

  set description(description: string) {
    this._description = description
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
    private _color: string,
    private _description?: string
  ) {
    this._polyline = L.polyline(_coordinates, { color: _color, weight: 3 })
  }

  get id(): number {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get description(): string | undefined {
    return this._description
  }

  set description(description: string) {
    this._description = description
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

  get length(): number {
    let sum = 0
    for (let i = 0; i < this.coordinates.length - 1; ++i) {
      sum += this.coordinates[i + 1].distanceTo(this.coordinates[i])
    }

    return sum
  }

  /**
   * Calculates the sum of all ascents between two neighbouring points in the segment.
   *
   * @readonly
   * @type {number}
   * @memberof LeafletSegment
   */
  get accumulatedAscent(): number {
    let sum = 0
    for (let i = 0; i < this.coordinates.length - 1; ++i) {
      const alt1 = this.coordinates[i].alt as number
      const alt2 = this.coordinates[i + 1].alt as number

      if (alt1 < alt2) {
        sum += alt2 - alt1
      }
    }

    return sum
  }

  /**
   * Calculates the sum of all descents between two neighbouring points in the segment.
   *
   * @readonly
   * @type {number}
   * @memberof LeafletSegment
   */
  get accumulatedDescent(): number {
    let sum = 0
    for (let i = 0; i < this.coordinates.length - 1; ++i) {
      const alt1 = this.coordinates[i].alt as number
      const alt2 = this.coordinates[i + 1].alt as number
      if (alt1 > alt2) {
        sum += alt1 - alt2
      }
    }

    return sum
  }
}
