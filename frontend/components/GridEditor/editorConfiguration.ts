import type {Grid} from "~/components/GridEditor/grid";

type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// Base interface for save function
export interface ISaveGridFn {
    (grid: Grid): Promise<void>;
}

// Main EditorElement type with improved constraints
export type EditorElementDefinition<
    Properties extends Record<string, any> = Record<string, any>,
    ProvidedProperties extends ReadonlyArray<keyof Properties> = ReadonlyArray<keyof Properties>,
    ConsumedProperties extends ReadonlyArray<keyof Properties> = ReadonlyArray<keyof Properties>
> = {
    id: string;
    name: string;
    category?: string;

    components: {
        element: ReturnType<typeof defineAsyncComponent>;
        properties: ReturnType<typeof defineAsyncComponent>;
    };

    defaults: {
        properties: Properties;
        providedProperties: ProvidedProperties;
        consumedProperties: ConsumedProperties;
    };

    validation?: {
        properties?: (props: Properties) => boolean | string[];
        required?: ReadonlyArray<RequiredKeys<Properties>>;
    };

    metadata?: {
        description?: string;
        icon?: string;
        tags?: string[];
        version?: string;
    };
};

export type ElementProperties<T> = T extends EditorElementDefinition<infer P, any, any> ? P : never;

export type ElementProvidedProperties<T> = T extends EditorElementDefinition<any, infer PP, any> ? PP : never;

export type ElementConsumedProperties<T> = T extends EditorElementDefinition<any, any, infer CP> ? CP : never;

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