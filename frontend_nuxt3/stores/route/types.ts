import { LngLat, LngLatBounds } from "maplibre-gl";
import { distance, length } from "@turf/turf";

export type RouteWithoutSegments = {
  id: number;
  name: string;
};

export interface TripDto {
  id: number;
  name: string;
  description?: string;
  segments: TripSegmentDto[];
}

export interface TripSegmentDto {
  id: number;
  name: string;
  description?: string;
  coordinates: number[][];
  color: string;
}

export function TripDto2MapLibreTrip(trip: TripDto): MapLibreTrip {
  return new MapLibreTrip(
    trip.id,
    trip.name,
    trip.segments.map((segment) =>
      RouteSegmentDto2MapLibreRouteSegment(segment)
    ),
    trip.description
  );
}

export function RouteSegmentDto2MapLibreRouteSegment(
  tripSegment: TripSegmentDto
): MapLibreSegment {
  return new MapLibreSegment(
    tripSegment.id,
    tripSegment.name,

    // not sure why but LibreMap switches longitude and latitude...
    tripSegment.coordinates.map(
      (coordinate) => new LngLat(coordinate[1], coordinate[0])
    ),
    "#000"
  );
}

export class MapLibreTrip {
  private _bounds: LngLatBounds;

  constructor(
    private _id: number,
    private _name: string,
    private _segments: MapLibreSegment[],
    private _description?: string
  ) {
    this._bounds = new LngLatBounds();
    for (const segment of this._segments) {
      this._bounds.extend(segment.bounds);
    }
  }

  get id(): number {
    return this._id;
  }

  get description(): string | undefined {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get segments(): MapLibreSegment[] {
    return this._segments;
  }

  get start(): LngLat | undefined {
    if (this._segments.length == 0) {
      return undefined;
    }

    return this._segments[0].start;
  }
  get end(): LngLat | undefined {
    if (this._segments.length == 0) {
      return undefined;
    }

    return this._segments[this._segments.length - 1].end;
  }

  get bounds(): LngLatBounds {
    return this._bounds;
  }
}

export class MapLibreSegment {
  private _lineString: any;

  private _bounds: LngLatBounds;

  constructor(
    private _id: number,
    private _name: string,
    private _coordinates: LngLat[],
    private _color: string,
    private _description?: string
  ) {
    this._lineString = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: _coordinates,
      },
    };

    this._bounds = new LngLatBounds();
    for (const coordinate of this._coordinates) {
      this._bounds.extend(coordinate);
    }
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  get coordinates(): LngLat[] {
    return this._coordinates;
  }

  get color(): string {
    return this._color;
  }

  get start(): LngLat {
    return this._coordinates[0];
  }

  get end(): LngLat {
    return this._coordinates[-1];
  }

  get length(): number {
    return 42;
    //return length(
    //  this._lineString.geometry.coordinates.map((e) => e.toArray())
    //);
  }

  get bounds(): LngLatBounds {
    return this._bounds;
  }

  /**
   * Calculates the sum of all ascents between two neighbouring points in the segment.
   *
   * @readonly
   * @type {number}
   * @memberof LeafletSegment
   */
  get accumulatedAscent(): number {
    /*
    let sum = 0;
    for (let i = 0; i < this.coordinates.length - 1; ++i) {
      const alt1 = this.coordinates[i][2];
      const alt2 = this.coordinates[i + 1][2];

      if (alt1 < alt2) {
        sum += alt2 - alt1;
      }
    }

    return sum;
    */
    return 42;
  }

  /**
   * Calculates the sum of all descents between two neighbouring points in the segment.
   *
   * @readonly
   * @type {number}
   * @memberof LeafletSegment
   */
  get accumulatedDescent(): number {
    /*
    let sum = 0;
    for (let i = 0; i < this.coordinates.length - 1; ++i) {
      const alt1 = this.coordinates[i][2] as number;
      const alt2 = this.coordinates[i + 1][2] as number;
      if (alt1 > alt2) {
        sum += alt1 - alt2;
      }
    }

    return sum;
    */
    return 42;
  }

  /**
   * Calculates the length between two coordinates rounded to two decimals. Unit is Km.
   *
   * @param latlng1
   * @param latlng2
   * @returns
   */
  private distanceBetweenPoints(latlng1: LngLat, latlng2: LngLat) {
    return (
      Math.round(distance(latlng1.toArray(), latlng2.toArray()) * 100) / 100
    );
  }
}
