import {defineAsyncComponent} from "vue";
import type {PropertySchema} from "../properties/elementProperty";
import type {ConsumedEventSchema, EventSchema} from "../events/eventRegistry";

export type EditorElementDefinitionID = string;
/**
 * The most fundamental and important type that defines your editor elements that users can use. Each element can have
 * properties that are used to customize your element and are passed to the element view (e.g. in a vue component these
 * are passed down as properties).
 */
export type EditorElementDefinition<
    Properties extends Record<string, unknown> = Record<string, unknown>,
    ProvidedProperties extends ReadonlyArray<keyof Properties> = ReadonlyArray<keyof Properties>,
    ConsumedProperties extends ReadonlyArray<keyof Properties> = ReadonlyArray<keyof Properties>,
    ProvidedEvents extends EventSchema<ProvidedProperties> = EventSchema<ProvidedProperties>,
    ConsumedEvents extends ConsumedEventSchema = ConsumedEventSchema,
> = {
    /**
     * unique identifier to identify the definition
     */
    readonly id: EditorElementDefinitionID; // TODO: currently the user defines this which feels weird as this is mostly necessary by the editor itself - autogenerate it?
    readonly name: string;
    readonly category?: string;

    /**
     * The most important glue: this is the vue component that will be displayed to the user.
     */
    readonly component: ReturnType<typeof defineAsyncComponent>; // TODO: remove the hard dependency to vue and make it generic?

    /**
     * Default values for all properties as well as if properties can be provided or consumed.
     */
    readonly defaults: {
        readonly properties: Properties;

        readonly connections: {
            readonly provided: {
                readonly properties: ProvidedProperties;

                /**
                 * All events that an element can cause are defined here.
                 */
                readonly events?: ProvidedEvents;
            },

            readonly consumed: {
                readonly properties: ConsumedProperties;

                /**
                 * All callbacks that can be triggered by external events are defined here.
                 */
                readonly callbacks?: ConsumedEvents;
            }
        }
    };

    /**
     * You can define custom schema for properties to overwrite the displayed component for a property.
     * This is optional.
     */
    readonly propertySchema?: PropertySchema<keyof Properties>,

    /**
     * Optional metadata that can be used to describe elements in the editor for your users.
     */
    readonly metadata?: {
        readonly description?: string;
        readonly icon?: string;
        readonly tags?: string[];
        readonly version?: string;
    };
};

export type ElementProperties<T> = T extends EditorElementDefinition<infer P, any, any, any> ? P : never;

export type ElementProvidedProperties<T> = T extends EditorElementDefinition<any, infer P, any, any>
    ? P[number]
    : never;

export type ElementConsumedProperties<T> = T extends EditorElementDefinition<any, infer P, any, any>
    ? P[number]
    : never;

export type ExtractCallbackFunctions<T extends ConsumedEventSchema> = {
    [K in keyof T]: T[K] extends { fn: infer F } ? F : never
}

export function extractCallbackFunctions(
    schema?: ConsumedEventSchema
): Record<string, (...args: any[]) => void> {
    if (!schema) return {}

    const callbacks: Record<string, (...args: any[]) => void> = {}

    for (const [eventName, config] of Object.entries(schema)) {
        if ('fn' in config && typeof config.fn === 'function') {
            callbacks[eventName] = config.fn as (...args: any[]) => void
        }
    }

    return callbacks
}