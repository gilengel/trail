import {v4 as uuidv4} from 'uuid';
import type {
    EditorElementDefinition, ElementConsumedProperties,
    ElementProperties,
    ElementProvidedProperties
} from "./configuration/elementDefinition";

export type EditorElementInstance<T extends EditorElementDefinition = EditorElementDefinition> = {
    instanceId: string;  // e.g., "text-instance-123"
    elementId: T['id'];  // e.g., "text-element" (references the definition)

    // Instance-specific data - properly typed based on element definition
    properties: ElementProperties<T>;

    defaults: T['defaults'];

    connections: {
        consumed: Partial<Record<ElementConsumedProperties<T>, string>>;
        provided: Partial<Record<ElementProvidedProperties<T>, string>>;
    };

    selected: boolean;

    // Instance metadata
    created: Date;
    modified: Date;
};

export class EditorElementInstanceRegistry {
    private instances = new Map<string, EditorElementInstance>();


    // Create type-safe instance from definition
    public createInstance<T extends EditorElementDefinition>(
        definition: EditorElementDefinition<any, any, any>,
        config: {
            properties?: Partial<ElementProperties<T>>;
        } = {}
    ): EditorElementInstance<T> | null {
        const now = new Date();

        const instanceId = uuidv4();
        const instance: EditorElementInstance<T> = {
            instanceId,
            elementId: definition.id,

            // Merge default properties with overrides - fully typed!
            properties: {
                ...definition.defaults.properties,
                ...config.properties
            } as ElementProperties<T>,

            defaults: definition.defaults,

            connections: {
                consumed: {},
                provided: {}
            },

            selected: false,

            created: now,
            modified: now,
        };

        this.instances.set(instanceId, instance);

        return instance;
    }

    // Update instance with type safety
    updateInstance<T extends EditorElementDefinition>(
        instanceId: string,
        updates: {
            properties?: Partial<ElementProperties<T>>;
        }
    ): boolean {
        const instance = this.instances.get(instanceId) as EditorElementInstance<T>;
        if (!instance) return false;

        // Update properties with type safety
        if (updates.properties) {
            instance.properties = {
                ...instance.properties,
                ...updates.properties
            };
        }


        instance.modified = new Date();
        return true;
    }

    // Get instance with proper typing
    getInstance<T extends EditorElementDefinition>(instanceId: string): EditorElementInstance<T> | undefined {
        return this.instances.get(instanceId) as EditorElementInstance<T> | undefined;
    }

    // Get all instances of a specific element type
    getInstancesByElementId<T extends EditorElementDefinition>(elementId: string): EditorElementInstance<T>[] {
        return Array.from(this.instances.values())
            .filter(instance => instance.elementId === elementId) as EditorElementInstance<T>[];
    }

    // Get all instances
    getAllInstances(): EditorElementInstance[] {
        return Array.from(this.instances.values());
    }

    // Remove instance
    removeInstance(instanceId: string): boolean {
        const instance = this.instances.get(instanceId);
        if (!instance) return false;

        this.instances.delete(instanceId);
        return true;
    }
}