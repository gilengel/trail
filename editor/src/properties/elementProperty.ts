import type {Component} from "vue";

export type PropertyType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'color'
    | 'select'
    | 'range'
    | 'object'
    | 'array'
    | 'custom'

export interface BasePropertyConfig {
    type: PropertyType
    label: string
    description?: string
    required?: boolean
    defaultValue?: any

    component?: Component
}

export interface StringPropertyConfig extends BasePropertyConfig {
    type: 'string'
    minLength?: number
    maxLength?: number
    placeholder?: string
}

export interface NumberPropertyConfig extends BasePropertyConfig {
    type: 'number'
    min?: number
    max?: number
    step?: number
}

export interface BooleanPropertyConfig extends BasePropertyConfig {
    type: 'boolean'
}

export interface ColorPropertyConfig extends BasePropertyConfig {
    type: 'color'
    format?: 'hex' | 'rgb' | 'hsl'
}

export interface SelectPropertyConfig extends BasePropertyConfig {
    type: 'select'
    options: string[]
}

export interface RangePropertyConfig extends BasePropertyConfig {
    type: 'range'
    min: number
    max: number
    step?: number
}

export interface ObjectPropertyConfig extends BasePropertyConfig {
    type: 'object'
    properties: Record<string, PropertyConfig>
}

export interface ArrayPropertyConfig extends BasePropertyConfig {
    type: 'array'
    itemType: PropertyConfig
}

export interface CustomPropertyConfig extends BasePropertyConfig {
    type: 'custom'
}

export type PropertyConfig =
    | StringPropertyConfig
    | NumberPropertyConfig
    | BooleanPropertyConfig
    | ColorPropertyConfig
    | SelectPropertyConfig
    | RangePropertyConfig
    | ObjectPropertyConfig
    | ArrayPropertyConfig
    | CustomPropertyConfig


// Schema for an element's properties
export type PropertySchema<K extends keyof any> = Partial<{
    [P in K]: PropertyConfig;
}>;