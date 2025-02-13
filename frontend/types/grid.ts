/**
 * List of all available elements that can be used to create a page.
 *
 * If you need to add a new element just add it to this list, and it will
 * automatically appear in the ui as the ui iterates over all the values
 * in this list on start.
 */
export enum ElementType {
    Text = 'Text',
    Heading = 'Heading',
    Map = 'Map',
    Image = 'Image',
}

export type AttributeType = string | number | boolean | string[] | number[] | boolean[] | object | undefined;
const elementTypeKeys = Object.keys(ElementType);

export const ElementTypes = elementTypeKeys as ElementType[];

export class Element<T> {
    constructor(public readonly type: ElementType, public readonly attributes: T) {
    }
}

export interface Column {
    id: string;
    width: number;
    element?: Element<unknown>;
    row?: Row;
}

export interface Row {
    id: string;
    columns: Column[];
}

export interface Grid {
    id: string;
    rows: Row[];
}