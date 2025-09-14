import type {ElementTypeRegistry} from "../types/editor/editor.elements";

export type AttributeType = string | number | boolean | string[] | number[] | boolean[] | object | undefined;

export class Element<Properties extends object,
    ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
    ConsumedProperties extends readonly (keyof Properties)[] = readonly []> {
    constructor(public readonly id: string,
                public readonly type: keyof ElementTypeRegistry,
                public readonly attributes: Properties,
                public readonly providedProperties: ProvidedProperties,
                public readonly consumedProperties: ConsumedProperties,
                public connectedProvidedProperties: Partial<Record<ProvidedProperties[number], string>>,
                public connectedConsumedProperties: Partial<Record<ConsumedProperties[number], string>>) {
    }
}

export interface EditorElementProperties<Properties extends object,
    ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
    ConsumedProperties extends readonly (keyof Properties)[] = readonly []> {

    grid: Grid,
    element: Element<Properties, ProvidedProperties, ConsumedProperties>,
    selected: boolean,
    highlighted: boolean
}

export interface Column {
    id: string;
    width: number;
    element?: Element<object>;
    row?: Row;
}

export interface Row {
    id: string;
    columns: Column[];
}

export interface Grid {
    tripId: number;
    rows: Row[];
}