/**
 * List of all available elements that can be used to create a page.
 *
 * If you need to add a new element, add it to this list, and it will
 * automatically appear in the ui as the ui iterates over all the values
 * in this list on start.
 */
export enum ElementType {
    Text = 'Text',
    Heading = 'Heading',
    Map = 'Map',
    Image = 'Image',
    ElevationProfile = 'ElevationProfile'
}

export type AttributeType = string | number | boolean | string[] | number[] | boolean[] | object | undefined;
const elementTypeKeys = Object.keys(ElementType);

export const ElementTypes = elementTypeKeys as ElementType[];

export class Element<Properties extends object,
    ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
    ConsumedProperties extends readonly (keyof Properties)[] = readonly []> {
    constructor(public readonly id: string,
                public readonly type: ElementType,
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