import {describe, it, expect} from "vitest";
import {MapLibreRoute, MapLibreSegment, LngLatWithElevation, type RouteDto, routeDto2MapLibreTrip} from "~/types/route";

describe("MapLibreTrip", () => {
    it("converts a trip dto to a MapLibreTrip", () => {
        const tripDto: RouteDto = {
            id: 0,
            name: 'test trip dto',
            description: 'test trip description',
            segments: [{
                id: 0,
                name: 'test trip segment',
                coordinates: [[0, 0, 0], [90, 90, 0]],
                color: 'white',
                description: 'test trip segment'
            }]
        };

        const result = routeDto2MapLibreTrip(tripDto);
        expect(result.name).toBe('test trip dto');
        expect(result.description).toBe('test trip description');
        expect(result.start).toStrictEqual(new LngLatWithElevation(0, 0, 0))
        expect(result.end).toStrictEqual(new LngLatWithElevation(90, 90, 0))

        expect(result.segments.length).toBe(1)
        expect(result.segments[0].description).toBe('test trip segment');

    })

    it("sets the name correctly", () => {
        const tripDto: RouteDto = {
            id: 0,
            name: 'test trip dto',
            description: 'test trip description',
            segments: []
        };

        const result = routeDto2MapLibreTrip(tripDto);
        expect(result.name).toBe('test trip dto');
        result.name = "new trip dto name";
        expect(result.name).toBe('new trip dto name');
    })

    it("sets the description correctly", () => {
        const tripDto: RouteDto = {
            id: 0,
            name: 'test trip dto',
            description: 'test trip description',

            segments: [{
                id: 0,
                name: 'test trip segment',
                coordinates: [[0, 0, 0], [90, 90, 0]],
                color: 'white',
                description: 'test trip segment description'
            }]
        };

        const result = routeDto2MapLibreTrip(tripDto);
        expect(result.description).toBe('test trip description');
        result.description = 'new test trip description';
        expect(result.description).toBe('new test trip description');

        expect(result.segments[0].description).toBe('test trip segment description');
        result.segments[0].description = 'new test trip segment description';
        expect(result.segments[0].description).toBe('new test trip segment description');
    })

    it("creates a trip and calculates bounds", () => {
        const segment = new MapLibreSegment(1, "Segment 1", [
            new LngLatWithElevation(10, 20, 100),
            new LngLatWithElevation(30, 40, 200)
        ], "#ff0000");

        const trip = new MapLibreRoute(1, "Test Trip", [segment]);

        expect(trip.id).toBe(1);
        expect(trip.name).toBe("Test Trip");
        expect(trip.segments).toHaveLength(1);
        expect(trip.bounds).toBeDefined();
    });

    it("handles an empty trip", () => {
        const trip = new MapLibreRoute(2, "Empty Trip", []);

        expect(trip.id).toBe(2);
        expect(trip.name).toBe("Empty Trip");
        expect(trip.segments).toHaveLength(0);
        expect(trip.start).toBeUndefined();
        expect(trip.end).toBeUndefined();
    });
});

describe("MapLibreSegment", () => {
    it("initializes segment properties correctly", () => {
        const segment = new MapLibreSegment(1, "Segment 1", [
            new LngLatWithElevation(10, 20, 100),
            new LngLatWithElevation(30, 40, 200)
        ], "#ff0000");

        expect(segment.id).toBe(1);
        expect(segment.name).toBe("Segment 1");
        expect(segment.coordinates).toHaveLength(2);
        expect(segment.color).toBe("#ff0000");
        expect(segment.bounds).toBeDefined();
    });

    it("calculates start and end points correctly", () => {
        const segment = new MapLibreSegment(2, "Segment 2", [
            new LngLatWithElevation(10, 20, 100),
            new LngLatWithElevation(30, 40, 200)
        ], "#0000ff");

        expect(segment.start.lng).toBe(10);
        expect(segment.start.lat).toBe(20);
        expect(segment.end.lng).toBe(30);
        expect(segment.end.lat).toBe(40);
    });

    it("handles empty segment coordinates", () => {
        const segment = new MapLibreSegment(3, "Empty Segment", [], "#000");

        expect(segment.start).toBeUndefined();
        expect(segment.end).toBeUndefined();
        expect(segment.bounds).toBeDefined();
    });

    it("returns fixed length and ascent/descent values", () => {
        const segment = new MapLibreSegment(4, "Segment 4", [
            new LngLatWithElevation(10, 20, 100),
            new LngLatWithElevation(30, 40, 200)
        ], "#ff0000");

        expect(segment.length).toBe(42); // Hardcoded return value
        expect(segment.accumulatedAscent).toBe(42);
        expect(segment.accumulatedDescent).toBe(42);
    });

    it("calculates the distance between two points", () => {
        const segment = new MapLibreSegment(5, "Distance Test", [], "#000");

        const distance = segment["distanceBetweenPoints"](
            new LngLatWithElevation(10, 20, 100),
            new LngLatWithElevation(30, 40, 100)
        );

        expect(distance).toBeGreaterThan(0);
    });
});
