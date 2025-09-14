import type {InjectionKey} from "vue";
import {type Column, Element} from "../types/grid";
import type {ElementTypeRegistry} from "~/types/editor/editor.elements";

export enum BuilderMode {
    Create,
    ConnectProperty
}

export enum ProvidedMethods {
    SwitchMode = 'switchMode',
    CreateElement = 'createElement',
    SelectElement = 'selectElement',
    SelectedElementChanged = 'selectedElementChanged'
}

export type SwitchMode = (newMode: BuilderMode, meta: Record<string, unknown>) => void
export type CreateElement = (elementType: keyof ElementTypeRegistry, column: Column) => void
export type SelectElement = (element: Element<object>) => void
export type SelectedElementChanged = (element: Element<object>) => void

export const SwitchModeKey: InjectionKey<SwitchMode> = Symbol(ProvidedMethods.SwitchMode);
export const CreateElementKey: InjectionKey<CreateElement> = Symbol(ProvidedMethods.CreateElement);
export const SelectElementKey: InjectionKey<SelectElement> = Symbol(ProvidedMethods.SelectElement);
export const SelectedElementChangedKey: InjectionKey<SelectedElementChanged> = Symbol(ProvidedMethods.SelectedElementChanged);