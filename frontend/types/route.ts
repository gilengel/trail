import {LngLat, LngLatBounds} from "maplibre-gl";
import {distance} from "@turf/turf";
import type {Grid} from "~/types/grid";
import {type GPXRoute, type GPXRouteSegment} from "shared";

export interface NewTripDto {
    name: string;
    layout?: Grid;
}

export interface TripDto {
    id: number;
    name?: string;
    layout: Grid;
}

export interface RouteDto {
    id: number;
    name: string;
    description?: string;
    segments: RouteSegmentDto[];
}

export interface RouteSegmentDto {
    id: number;
    name: string;
    description?: string;
    coordinates: number[][];
    color: string;
}

export class LngLatWithElevation extends LngLat {
    constructor(lng: number, lat: number, elevation: number) {
        super(lng, lat);

        this.elevation = elevation;
    }

    elevation: number = 0;
}

/**
 * Converts a trip DTO to the internal format so that it can be displayed on the map component.
 * @param route - The trip DTO as retrieved from the backend.
 * @returns Trip in map component format.
 */
export function routeDto2MapLibreTrip(route: RouteDto): MapLibreRoute {
    return new MapLibreRoute(
        route.id,
        route.name,
        route.segments.map((segment) =>
            RouteSegmentDto2MapLibreRouteSegment(segment)
        ),
        route.description
    );
}

/**
 * Converts a route gpx to the internal format so that it can be displayed on the map component.
 * @param trip - The trip DTO as retrieved from the backend.
 * @returns Trip in map component format.
 */
export function gpxRoute2MapLibreTrip(trip: GPXRoute): MapLibreRoute {
    return new MapLibreRoute(
        Math.random(),
        trip.name ? trip.name : '',
        trip.segments.map((segment) =>
            gpxRouteSegmentDto2MapLibreRouteSegment(segment)
        )
    );
}

/**
 * Converts a trip segment DTO to the internal format so that it can be displayed on the map component.
 * @param tripSegment - The trip segment DTO as retrieved from the backend.
 * @returns Segment in map component format.
 */
export function gpxRouteSegmentDto2MapLibreRouteSegment(
    tripSegment: GPXRouteSegment
): MapLibreSegment {
    return new MapLibreSegment(
        Math.random(),
        tripSegment.name,

        // not sure why but LibreMap switches longitude and latitude...
        tripSegment.coordinates.map(
            (coordinate) => new LngLatWithElevation(coordinate[1], coordinate[0], coordinate[2])
        ),
        "#000"
    );
}

/**
 * Converts a trip segment DTO to the internal format so that it can be displayed on the map component.
 * @param tripSegment - The trip segment DTO as retrieved from the backend.
 * @returns Segment in map component format.
 */
export function RouteSegmentDto2MapLibreRouteSegment(
    tripSegment: RouteSegmentDto
): MapLibreSegment {
    return new MapLibreSegment(
        tripSegment.id,
        tripSegment.name,

        // not sure why but LibreMap switches longitude and latitude...
        tripSegment.coordinates.map(
            (coordinate) => new LngLatWithElevation(coordinate[1], coordinate[0], coordinate[2])
        ),
        "#000",
        tripSegment.description
    );
}

export class MapLibreRoute {
    private readonly _bounds: LngLatBounds;

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
    private _lineString: object;

    private readonly _bounds: LngLatBounds;

    constructor(
        private _id: number,
        private _name: string,
        private _coordinates: LngLatWithElevation[],
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

    get coordinates(): LngLatWithElevation[] {
        return this._coordinates;
    }

    get color(): string {
        return this._color;
    }

    get start(): LngLat {
        return this._coordinates[0];
    }

    get end(): LngLat {
        return this._coordinates[this._coordinates.length - 1];
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
     * @param latlng1 - The first coordinate.
     * @param latlng2 - The second coordinate.
     * @returns - Direct distance between the two coordinates in Km.
     */
    private distanceBetweenPoints(latlng1: LngLat, latlng2: LngLat) {
        return (
            Math.round(distance(latlng1.toArray(), latlng2.toArray()) * 100) / 100
        );
    }
}
