import type {Grid} from "./grid";
import type {EditorElementDefinition} from "./definition/elementDefinition";
import type {ConsumedEventSchema, EventSchema} from "./events/eventRegistry";

// Base interface for save function
export interface ISaveGridFn {
    (grid: Grid): Promise<void>;
}


export type EditorConfiguration<Elements extends readonly EditorElementDefinition<any, any, any>[] = EditorElementDefinition[]> = {
    elements: Elements;

    persistence: {
        save: ISaveGridFn;
    };
};


export function createEditorElementDefinition<
    Properties extends Record<string, unknown>,
    ProvidedProperties extends ReadonlyArray<keyof Properties>,
    ConsumedProperties extends ReadonlyArray<keyof Properties>,
    ProvidedEvents extends EventSchema<ProvidedProperties> = EventSchema<ProvidedProperties>,
    ConsumedEvents extends ConsumedEventSchema = ConsumedEventSchema
>(
    config: Omit<EditorElementDefinition<Properties, ProvidedProperties, ConsumedProperties>, 'defaults'> & {
        defaults: {
            properties: Properties;

            connections: {
                provided: {
                    properties: ProvidedProperties,
                    events: ProvidedEvents,
                },

                consumed: {
                    properties: ConsumedProperties,
                    callbacks: ConsumedEvents
                }
            }
        };
    }
): EditorElementDefinition<Properties, ProvidedProperties, ConsumedProperties, ProvidedEvents, ConsumedEvents> {
    return config as EditorElementDefinition<Properties, ProvidedProperties, ConsumedProperties, ProvidedEvents, ConsumedEvents>;
}