import {defineAsyncComponent} from "vue";
import type {PropertySchema} from "./elementProperty";

export type EditorElementDefinition<
    Properties extends Record<string, unknown> = Record<string, unknown>,
    ProvidedProperties extends ReadonlyArray<keyof Properties> = ReadonlyArray<keyof Properties>,
    ConsumedProperties extends ReadonlyArray<keyof Properties> = ReadonlyArray<keyof Properties>
> = {
    id: string;
    name: string;
    category?: string;

    component: ReturnType<typeof defineAsyncComponent>;

    defaults: {
        properties: Properties;
        providedProperties: ProvidedProperties;
        consumedProperties: ConsumedProperties;
    };

    propertySchema?: PropertySchema<keyof Properties>,

    metadata?: {
        description?: string;
        icon?: string;
        tags?: string[];
        version?: string;
    };
};

export type ElementProperties<T> = T extends EditorElementDefinition<infer P, any, any> ? P : never;

export type ElementProvidedProperties<T> = T extends EditorElementDefinition<any, infer P, any>
    ? P[number]  // This extracts the union type from the tuple
    : never;

export type ElementConsumedProperties<T> = T extends EditorElementDefinition<any, infer P, any>
    ? P[number]  // This extracts the union type from the tuple
    : never;