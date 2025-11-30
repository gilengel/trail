import type {EditorElementDefinition, ElementProperties} from "../definition/elementDefinition";
import type {EditorElementInstance} from "./instance";

export enum Direction {
    Provided,
    Consumed
}

export interface IInstanceRegistry {

    /**
     * Simply inserting an existing instance to the list of registered instances. This is necessary for instances
     * that were persisted before and are loaded from the backend
     *
     * @param instance contains all custom data that was loaded from the backend
     */
    insertExistingInstance(instance: EditorElementInstance): void,

    // Create type-safe instance from definition
    create<T extends EditorElementDefinition>(
        definition: EditorElementDefinition,
        config: {
            properties?: Partial<ElementProperties<T>>;
        }
    ): EditorElementInstance<T> | null,

    updateInstance<T extends EditorElementDefinition>(
        instanceId: string,
        updates: {
            properties?: Partial<ElementProperties<T>>;
        }
    ): boolean,

    // Get instance with proper typing
    getInstance<T extends EditorElementDefinition>(instanceId: string): EditorElementInstance<T> | undefined,

    // Get all instances of a specific element type
    getInstancesByElementId<T extends EditorElementDefinition>(elementId: string): EditorElementInstance<T>[],

    // Get all instances
    getAllInstances(): EditorElementInstance[],

    // Remove instance
    removeInstance(instanceId: string): boolean,

    withProperty(propertyKey: PropertyKey, direction: Direction): EditorElementInstance[],

    withEvent(eventKey: PropertyKey): EditorElementInstance[]
}