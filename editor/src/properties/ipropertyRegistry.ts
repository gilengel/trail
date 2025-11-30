import type {PropertyType} from "./elementProperty";
import type {Component} from "vue";

export interface IPropertyTypeRegistry {

    // Register a component for a property type
    register(type: PropertyType, component: Component): this

    get(type: PropertyType): Component | undefined

    clear(): void
}
