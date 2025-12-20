import type {EditorElementDefinition, EditorElementDefinitionID} from "./elementDefinition";
import {defineAsyncComponent} from "vue";

export interface IDefinitionRegistry {

    // Register a single element definition
    register<T extends EditorElementDefinition>(element: T): this,

    // Register multiple elements
    registerMany<T extends readonly EditorElementDefinition[]>(elements: T): this,

    // Get element by ID with type safety
    get(id: EditorElementDefinitionID): EditorElementDefinition | undefined,

    // Get all elements
    getAll(): EditorElementDefinition[],

    // Get elements by category
    getByCategory(category: string): EditorElementDefinition[],

    // Get elements by tag
    getByTag(tag: string): EditorElementDefinition[],

    // Get all categories
    getCategories(): string[],

    // Get all tags
    getTags(): string[],

    // Check if element exists
    has(id: string): boolean,

    // Get element count
    size(): number,

    // Clear all elements
    clear(): void,

    /**
     * Returns the component for the element as shown to the user if found, null otherwise
     * @param definitionTypeId
     */
    getComponent(definitionTypeId: string): ReturnType<typeof defineAsyncComponent> | null;
}