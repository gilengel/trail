import {type Element, type Grid} from '~/types/grid';

/**
 * Properties for a grid element for a trip or route.
 * @template Properties - All changeable properties for the element.
 * @template ProvidedProperties - (Optional) all properties that are publicly exposed and can be consumed by other elements.
 * @template ConsumedProperties - (Optional) all properties that are consumed from other elements
 * Type is a map where the key is the id of the provided element and the value
 * the consumed property, which must be a key in Properties.
 */
export interface ElementProps<Properties extends object,
    ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
    ConsumedProperties extends readonly (keyof Properties)[] = readonly []> {
    /**
     * The element instance containing the properties and metadata.
     */
    element: Element<Properties, ProvidedProperties, ConsumedProperties>;

    selected: boolean;

    highlighted: boolean;

    grid: Grid;
}