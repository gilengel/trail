import {Element} from '~/types/grid';
import type {IUndoRedoAction} from "~/stores/undoredo";

/**
 * Updates an attribute of the element. This is an undoable/redoable action.
 * @template Property
 * @template Properties
 * @template ProvidedProperties
 * @template ConsumedProperties
 */
export class UpdateElementAttribute<Properties extends object, Property extends keyof Properties,
    ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
    ConsumedProperties extends readonly (keyof Properties)[] = readonly []>
    implements IUndoRedoAction {
    private oldValue: Properties[Property] | undefined = undefined;

    constructor(
        private element: Element<Properties, ProvidedProperties, ConsumedProperties>,
        private attribute: Property,
        private value: Properties[Property],
    ) {
    }

    private getAttribute() {
        return this.element.attributes[this.attribute];
    }

    async undo() {
        this.element.attributes[this.attribute] = this.oldValue!;
    }

    async redo() {
        this.oldValue = await this.getAttribute();

        this.element.attributes[this.attribute] = this.value;
    }
}
