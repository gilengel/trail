import type {
    EditorElementDefinition,
    ElementConsumedProperties,
    ElementProperties, ElementProvidedProperties
} from "../definition/elementDefinition";

export type ElementInstanceId = string;
/**
 * Represents the instance of an element definition. Or in other words this is the instance with all user defined data.
 * While a definition defines the default values and the overall schema of an element, an instance builds on this by
 * allowing to overwrite the default values as well as set dynamic behaviour such as adding event listeners.
 */
export type EditorElementInstance<T extends EditorElementDefinition = EditorElementDefinition> = {
    /**
     * identifies the instance in the global registry. While most functions will use the instance directly, you might
     * need the id sometimes for specific use cases (e.g. as the key in a vue for loop). The instanceId is readonly and
     * is set automatically by the editor
     */
    readonly instanceId: ElementInstanceId;  // e.g., "text-instance-123"

    /**
     * the id of the underlying definition. Is set by the editor and cannot be changed as this would break properties.
     */
    readonly elementId: T['id'];  // e.g., "text-element" (references the definition)


    properties: ElementProperties<T>;

    connections: {
        provided: {
            properties: Partial<Record<ElementProvidedProperties<T>, string>>

            events: {
                listeners: { [eventName: string]: string[] }
            }
        },
        consumed: {
            properties: Partial<Record<ElementConsumedProperties<T>, string>>,
        }
    };

    selected: boolean;
    created: Date;
    modified: Date;
};