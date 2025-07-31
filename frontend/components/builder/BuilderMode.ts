import type {InjectionKey} from "vue";
import {type Column, Element, ElementType} from "~/types/grid";

export enum BuilderMode {
    Create,
    Connect
}

export enum ProvidedMethods {
    SwitchMode = 'switchMode',
    CreateElement = 'createElement',
    SelectElement = 'selectElement',
    SelectedElementChanged = 'selectedElementChanged'
}

export type SwitchMode = (newMode: BuilderMode) => void
export type CreateElement = (elementType: ElementType, column: Column) => void
export type SelectElement = (element: Element<object>) => void
export type SelectedElementChanged = (element: Element<object>) => void

export const SwitchModeKey: InjectionKey<SwitchMode> = Symbol(ProvidedMethods.SwitchMode)
export const CreateElementKey: InjectionKey<CreateElement> = Symbol(ProvidedMethods.CreateElement)
export const SelectElementKey: InjectionKey<SelectElement> = Symbol(ProvidedMethods.SelectElement)
export const SelectedElementChangedKey: InjectionKey<SelectedElementChanged> = Symbol(ProvidedMethods.SelectedElementChanged)