import {describe, it, expect, vi} from "vitest";
import {areEventsEqual, deepEqual, defineCallback, type EventConfig} from "./eventRegistry"

describe("deepEqual", () => {
    it("returns true for identical primitives", () => {
        expect(deepEqual(5, 5)).toBe(true);
        expect(deepEqual("a", "a")).toBe(true);
    });

    it("returns false for different primitives", () => {
        expect(deepEqual(5, 6)).toBe(false);
    });

    it("returns true for identical objects", () => {
        expect(deepEqual({a: 1, b: 2}, {a: 1, b: 2})).toBe(true);
    });

    it("returns false for objects with different keys", () => {
        expect(deepEqual({a: 1}, {b: 1})).toBe(false);
    });

    it("returns false for objects with different values", () => {
        expect(deepEqual({a: 1}, {a: 2})).toBe(false);
    });

    it("returns false for objects with different keys", () => {
        expect(deepEqual({a: 1, b: 2}, {a: 2})).toBe(false);
    });

    it("returns true for deeply equal objects", () => {
        expect(
            deepEqual(
                {a: {b: {c: 1}}},
                {a: {b: {c: 1}}}
            )
        ).toBe(true);
    });

    it("returns false for deeply different objects", () => {
        expect(
            deepEqual(
                {a: {b: {c: 1}}},
                {a: {b: {c: 2}}}
            )
        ).toBe(false);
    });
});


describe("defineCallback", () => {
    it("creates a custom event config with schema, fn, and meta", () => {
        const schema = {count: 1, flag: true};
        const fn = vi.fn();
        const meta = {name: "Test", label: "Test Label"};

        const cb = defineCallback(schema, fn, meta);

        expect(cb.payloadType).toBe("custom");
        expect(cb.payloadSchema).toEqual(schema);
        expect(cb.fn).toBe(fn);
        expect(cb.name).toBe("Test");
        expect(cb.label).toBe("Test Label");
    });

    it("preserves literal types (const schema)", () => {
        const schema = {x: 1 as const};
        const fn = vi.fn();
        const meta = {name: "X", label: "X Label"};

        const cb = defineCallback(schema, fn, meta);

        expect(cb.payloadSchema.x).toBe(1);
    });
});


describe("areEventsEqual", () => {
    it("returns true for equal 'properties' events", () => {
        const a = {payloadType: "properties"} as const;
        const b = {payloadType: "properties"} as const;

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(true);
    });

    it("returns false if payloadType differs", () => {
        const a = {payloadType: "properties"} as const;
        const b = {payloadType: "custom", payloadSchema: {}} as const;

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(false);
    });

    it("returns true for equal partial-properties events", () => {
        const a = {
            payloadType: "partial-properties",
            properties: ["a", "b"] as const
        };

        const b = {
            payloadType: "partial-properties",
            properties: ["a", "b"] as const
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(true);
    });

    it("returns false for partial-properties with missing properties in b", () => {
        const a = {
            payloadType: "partial-properties",
            properties: ["a", "b"] as const
        };

        const b = {
            payloadType: "partial-properties",
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(false);
    });

    it("returns false for partial-properties with different arrays", () => {
        const a = {
            payloadType: "partial-properties",
            properties: ["a", "b"] as const
        };

        const b = {
            payloadType: "partial-properties",
            properties: ["a", "c"] as const
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(false);
    });

    it("returns true for equal custom events", () => {
        const a = {
            payloadType: "custom",
            payloadSchema: {x: 1, y: {z: true}}
        };

        const b = {
            payloadType: "custom",
            payloadSchema: {x: 1, y: {z: true}}
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(true);
    });

    it("returns false for different custom schemas", () => {
        const a = {
            payloadType: "custom",
            payloadSchema: {x: 1}
        };

        const b = {
            payloadType: "custom",
            payloadSchema: {x: 2}
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(false);
    });

    it("returns false for missing payloadSchema in b", () => {
        const a = {
            payloadType: "custom",
            payloadSchema: {x: 1}
        };

        const b = {
            payloadType: "custom",
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(false);
    });

    it("returns false for deeply different custom schemas", () => {
        const a = {
            payloadType: "custom",
            payloadSchema: {nested: {a: 1}}
        };

        const b = {
            payloadType: "custom",
            payloadSchema: {nested: {a: 2}}
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(false);
    });

    // just to get the coverage up for an unreachable code line
    it("makes the coverage happy 😊", () => {
        const a = {
            payloadType: "",
        };

        const b = {
            payloadType: "",
        };

        expect(areEventsEqual(a as unknown as EventConfig, b as unknown as EventConfig)).toBe(undefined);
    });
});