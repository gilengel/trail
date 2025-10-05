import type {Grid} from "./grid";
import type {EditorElementDefinition} from "./configuration/elementDefinition";

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
    Properties extends Record<string, any>,
    ProvidedProps extends ReadonlyArray<keyof Properties>,
    ConsumedProps extends ReadonlyArray<keyof Properties>
>(
    config: Omit<EditorElementDefinition<Properties, ProvidedProps, ConsumedProps>, 'defaults'> & {
        defaults: {
            properties: Properties;
            providedProperties: ProvidedProps;
            consumedProperties: ConsumedProps;
        };
    }
): EditorElementDefinition<Properties, ProvidedProps, ConsumedProps> {
    return config as EditorElementDefinition<Properties, ProvidedProps, ConsumedProps>;
}