import type {EditorElementDefinition} from "./editorConfiguration";

export class ElementDefinitionRegistry {
    private elements = new Map<string, EditorElementDefinition<any, any, any>>();
    private categories = new Map<string, Set<string>>();
    private tags = new Map<string, Set<string>>();

    // Register a single element
    register<T extends EditorElementDefinition<any, any, any>>(element: T): this {
        if (this.elements.has(element.id)) {
            throw new Error(`Element with ID '${element.id}' is already registered`);
        }

        this.elements.set(element.id, element);

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
    registerMany<T extends readonly EditorElementDefinition<any, any, any>[]>(elements: T): this {
        for (const element of elements) {
            this.register(element);
        }
        return this;
    }

    // Get element by ID with type safety
    get<Id extends string>(id: Id): EditorElementDefinition<any, any, any> | undefined {
        return this.elements.get(id);
    }

    // Get all elements
    getAll(): EditorElementDefinition<any, any, any>[] {
        return Array.from(this.elements.values());
    }

    // Get elements by category
    getByCategory(category: string): EditorElementDefinition<any, any, any>[] {
        const elementIds = this.categories.get(category);
        if (!elementIds) return [];

        return Array.from(elementIds)
            .map(id => this.elements.get(id)!)
            .filter(Boolean);
    }

    // Get elements by tag
    getByTag(tag: string): EditorElementDefinition<any, any, any>[] {
        const elementIds = this.tags.get(tag);
        if (!elementIds) return [];

        return Array.from(elementIds)
            .map(id => this.elements.get(id)!)
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
        return this.elements.has(id);
    }

    // Get element count
    size(): number {
        return this.elements.size;
    }

    // Clear all elements
    clear(): void {
        this.elements.clear();
        this.categories.clear();
        this.tags.clear();
    }
}