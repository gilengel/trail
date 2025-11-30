import type {EditorElementInstance} from "../instances/instance";

export type EventPayloadType =
    | 'properties'
    | 'partial-properties'
    | 'custom'

export interface BaseEventConfig {
    name: string
    label: string
    description?: string
    payloadType: EventPayloadType
}

export interface PropertiesEventConfig extends BaseEventConfig {
    payloadType: 'properties'
}

export interface PartialPropertiesEventConfig<T extends Record<string, any>> extends BaseEventConfig {
    payloadType: 'partial-properties'
    properties: ReadonlyArray<keyof T>
}

export interface CustomEventConfig extends BaseEventConfig {
    payloadType: 'custom'
    payloadSchema: Record<string, any>
}

export interface CustomConsumedEventConfig<Payload extends Record<string, any> = Record<string, any>> extends BaseEventConfig {
    payloadType: 'custom'
    readonly payloadSchema: Payload
    fn: (args: Payload) => void
}

export type EventConfig<T extends Record<string, any> = Record<string, any>> =
    | PropertiesEventConfig
    | PartialPropertiesEventConfig<T>
    | CustomEventConfig

export type ConsumedEventConfig =
    | PropertiesEventConfig
    | PartialPropertiesEventConfig<any>
    | CustomConsumedEventConfig<any>

export type EventSchema<T extends Record<string, any>> = Record<string, EventConfig<T>>
export type ConsumedEventSchema = Record<string, ConsumedEventConfig>

export const defineCallback = <const T extends Record<string, any>>(
    ...args: [
        schema: T,
        fn: (instance: EditorElementInstance, args: T) => void,  // Add instance parameter
        meta: { name: string; label: string }
    ]
) => ({
    ...args[2],
    payloadType: 'custom' as const,
    payloadSchema: args[0],
    fn: args[1]
})

export function deepEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null)
        return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        if (!bKeys.includes(key)) return false;
        if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
}

export function areEventsEqual<T extends Record<string, any>>(
    a: EventConfig<T>,
    b: EventConfig<T>
): boolean {

    if (a.payloadType !== b.payloadType) return false;

    switch (a.payloadType) {
        case "properties":
            return true;

        case "partial-properties":
            if (!("properties" in b)) return false;

            const pa = a.properties;
            const pb = b.properties;

            return pa.length === pb.length &&
                pa.every((p, i) => p === pb[i]);

        case "custom":
            if (!("payloadSchema" in b)) return false;
            return deepEqual(a.payloadSchema, b.payloadSchema);
    }
}



