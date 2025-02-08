/**
 * List of all available elements that can be used to create a page.
 *
 * If you need to add a new element just add it to this list and it will
 * automatically appear in the ui as the ui iterates over all the values
 * in this list on start.
 */
export enum ElementType {
    Text = 'Text',
    Heading = 'Heading',
    Map = 'Map',
    Image = 'Image',
}

const elementTypeKeys = Object.keys(ElementType);

export const ElementTypes = elementTypeKeys as ElementType[];

export class Element {
    constructor(public readonly type: ElementType, public readonly attributes: Record<string, string | number | boolean | undefined>) {
    }
}

export interface Point {
    x: number;
    y: number;
}

export enum ElementAttributeType {
    Number = 'Number',
    String = 'String',
    Boolean = 'Boolean',
    Collection = 'Collection',
}

export type SimpleAttribute = {
    name: string;
    type: ElementAttributeType;
    value: string | number | boolean;
    //component?: CustomAttributeOptionElements;
};

export type CollectionAttribute = {
    name: string;
    type: ElementAttributeType;
    options: string[];
    value: string;
    //component?: CustomAttributeOptionElements;
};

export type ElementAttribute = (SimpleAttribute | CollectionAttribute);


export interface Column {
    id: string;
    width: number;
    element?: Element;
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