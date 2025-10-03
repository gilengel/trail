import type {IUndoRedoAction} from "../";
import type {EditorElementDefinition, ElementProperties} from "../../editorConfiguration";
import type {EditorElementInstance} from "../../editorElementInstanceRegistry";

/**
 * Updates an attribute of the element. This is an undoable/redoable action.
 */
export class UpdateElementAttribute<
    T extends EditorElementDefinition<any, any, any>
> implements IUndoRedoAction {

    private oldValue: ElementProperties<T>[keyof ElementProperties<T>] | undefined;

    constructor(
        private element: EditorElementInstance<T>,
        private attribute: keyof ElementProperties<T>,
        private value: ElementProperties<T>[keyof ElementProperties<T>]) {
    }

    private getAttribute(): ElementProperties<T>[keyof ElementProperties<T>] {
        return this.element.properties[this.attribute];
    }

    async undo() {
        if (this.oldValue !== undefined) {
            this.element.properties[this.attribute] = this.oldValue;
        }
    }

    async redo() {
        this.oldValue = this.getAttribute();
        this.element.properties[this.attribute] = this.value;
    }
}