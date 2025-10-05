import type {PropertyType} from "./elementProperty";
import type {Component} from "vue";

export class PropertyTypeRegistry {
    private typeComponents = new Map<PropertyType, Component>()

    // Register a component for a property type
    registerType(type: PropertyType, component: Component): this {
        if (this.typeComponents.has(type)) {
            throw new Error(`Component for property type '${type}' is already registered`)
        }
        this.typeComponents.set(type, component)
        return this
    }

    get(type: PropertyType): Component | undefined {
        // Handle object type recursively
        if (type === 'object') {
            return this.typeComponents.get('object')
        }

        // Standard types
        return this.typeComponents.get(type)
    }

    clear(): void {
        this.typeComponents.clear()
    }
}

export const globalPropertyTypeRegistry = new PropertyTypeRegistry()
