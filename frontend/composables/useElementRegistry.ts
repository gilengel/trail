/* eslint-disable @typescript-eslint/no-explicit-any */
import {globalElementRegistry} from "~/components/builder/editor.configuration";
import type {EditorElementDefinition, ElementProperties} from "@trail/grid-editor/configuration/elementDefinition";
import type {PropertyType} from "@trail/grid-editor/configuration/elementProperty";
import {globalPropertyTypeRegistry} from "@trail/grid-editor/configuration/elementPropertyRegistry";

/**
 * Convenience wrapper that provides access to the editors element registry. Use it to add or get editor element
 * definitions or instances.
 * @returns Object where the definition and instances are further grouped separately.
 */
export function useElementRegistry() {
    return {
        registry: globalElementRegistry,

        definitions: {
            // Convenient methods
            get: (id: string) => globalElementRegistry.definitions.get(id),
            getAll: () => globalElementRegistry.definitions.getAll(),
            getByCategory: (category: string) => globalElementRegistry.definitions.getByCategory(category),
            getByTag: (tag: string) => globalElementRegistry.definitions.getByTag(tag),

            // Reactive refs for Vue
            //elements: computed(() => globalElementRegistry.definitions.getAll()),
            //categories: computed(() => globalElementRegistry.definitions.getCategories()),
            //tags: computed(() => globalElementRegistry.definitions.getTags()),

            // Registration methods
            register: (element: EditorElementDefinition<any, any, any>) => globalElementRegistry.definitions.register(element),
            registerMany: (elements: EditorElementDefinition<any, any, any>[]) => globalElementRegistry.definitions.registerMany(elements),
        },

        instances: {
            create: <T extends EditorElementDefinition<any, any, any>>(
                definition: T,
                config: {
                    properties?: Partial<ElementProperties<T>>;
                } = {}
            ) => globalElementRegistry.instances.createInstance(definition, config)
        },

        properties: {
            get: (type: PropertyType) => globalPropertyTypeRegistry.get(type),
            register: (type: PropertyType, component: Component) => globalPropertyTypeRegistry.registerType(type, component),
        }
    };
}