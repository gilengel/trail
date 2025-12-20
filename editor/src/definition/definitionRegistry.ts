import type {EditorElementDefinition, EditorElementDefinitionID} from "./elementDefinition";
import type {IDefinitionRegistry} from "./idefinitionRegistry";
import {defineAsyncComponent} from "vue";

export class DefinitionRegistry implements IDefinitionRegistry {
    private definitions = new Map<EditorElementDefinitionID, EditorElementDefinition>();
    private categories = new Map<EditorElementDefinitionID, Set<string>>();
    private tags = new Map<EditorElementDefinitionID, Set<string>>();

    // Register a single element definition
    register<T extends EditorElementDefinition>(element: T): this {
        if (this.definitions.has(element.id)) {
            throw new Error(`Element with ID '${element.id}' is already registered`);
        }

        this.definitions.set(element.id, element);

        // Index by category
        const category = element.category || 'default';
        if (!this.categories.has(category)) {
            this.categories.set(category, new Set());
        }
        this.categories.get(category)!.add(element.id);

        // Index by tags
        const tags = element.metadata?.tags || [];
        for (const tag of tags) {
            if (!this.tags.has(tag)) {
                this.tags.set(tag, new Set());
            }
            this.tags.get(tag)!.add(element.id);
        }

        return this;
    }

    // Register multiple elements
    registerMany<T extends readonly EditorElementDefinition[]>(elements: T): this {
        for (const element of elements) {
            this.register(element);
        }
        return this;
    }

    // Get element by ID with type safety
    get(id: EditorElementDefinitionID): EditorElementDefinition | undefined {
        return this.definitions.get(id);
    }

    // Get all elements
    getAll(): EditorElementDefinition[] {
        return Array.from(this.definitions.values());
    }

    // Get elements by category
    getByCategory(category: string): EditorElementDefinition[] {
        const elementIds = this.categories.get(category);
        if (!elementIds) return [];

        return Array.from(elementIds)
            .map(id => this.definitions.get(id)!)
            .filter(Boolean);
    }

    // Get elements by tag
    getByTag(tag: string): EditorElementDefinition[] {
        const elementIds = this.tags.get(tag);
        if (!elementIds) return [];

        return Array.from(elementIds)
            .map(id => this.definitions.get(id)!)
            .filter(Boolean);
    }

    // Get all categories
    getCategories(): string[] {
        return Array.from(this.categories.keys());
    }

    // Get all tags
    getTags(): string[] {
        return Array.from(this.tags.keys());
    }

    // Check if element exists
    has(id: string): boolean {
        return this.definitions.has(id);
    }

    // Get element count
    size(): number {
        return this.definitions.size;
    }

    // Clear all elements
    clear(): void {
        this.definitions.clear();
        this.categories.clear();
        this.tags.clear();
    }

    public getComponent(definitionTypeId: string): ReturnType<typeof defineAsyncComponent> | null {
        const definition = this.definitions.get(definitionTypeId);
        return definition?.component || null;
    }
}