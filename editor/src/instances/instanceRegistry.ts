import {v4 as uuidv4} from 'uuid';
import {type EditorElementDefinition, type ElementProperties,} from "../definition/elementDefinition";
import {Direction, type IInstanceRegistry} from "./iinstanceRegistry";
import type {EditorElementInstance} from "./instance";
import type {IDefinitionRegistry} from "../definition/idefinitionRegistry";


export class InstanceRegistry implements IInstanceRegistry {
    private instances = new Map<string, EditorElementInstance>();

    constructor(private readonly _definitionRegistry: IDefinitionRegistry) {
    }

    /**
     * Simply inserting an existing instance to the list of registered instances. This is necessary for instances
     * that were persisted before and are loaded from the backend
     *
     * @param instance contains all custom data that was loaded from the backend
     */
    public insertExistingInstance(instance: EditorElementInstance) {
        this.instances.set(instance.instanceId, instance);
    }

    public create<T extends EditorElementDefinition>(
        definition: EditorElementDefinition,
        config: {
            properties?: Partial<ElementProperties<T>>;
        } = {}
    ): EditorElementInstance<T> | null {
        const now = new Date();

        const instanceId = uuidv4();
        const instance: EditorElementInstance<T> = {
            instanceId,
            elementId: definition.id,

            // Merge default properties with overrides
            properties: {
                ...definition.defaults.properties,
                ...config.properties
            } as ElementProperties<T>,

            connections: {
                consumed: {
                    properties: {},
                },
                provided: {
                    properties: {},
                    events: {
                        listeners: {}
                    }
                }
            },

            selected: false,

            created: now,
            modified: now,
        };

        this.instances.set(instanceId, instance);

        return instance;
    }

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

    withProperty(propertyKey: PropertyKey, direction: Direction): EditorElementInstance[] {
        return this.getAllInstances().filter((instance: EditorElementInstance) => {
            const definition = this._definitionRegistry.get(instance.elementId);

            if (!definition) return false;

            switch (direction) {
                case Direction.Provided:
                    return propertyKey in definition.defaults.connections.provided.properties;
                case Direction.Consumed:
                    return propertyKey in definition.defaults.connections.consumed.properties;
            }
        })
    }

    withEvent(eventKey: PropertyKey): EditorElementInstance[] {
        return this.getAllInstances().filter((instance: EditorElementInstance) => {
            const definition = this._definitionRegistry.get(instance.elementId);
            const providedEvents = definition!.defaults.connections.provided.events;

            return providedEvents && eventKey in providedEvents;
        });
    }
}