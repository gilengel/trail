import type {IUndoRedoAction} from "../";
import type {Column} from "../../grid"
import type {EditorElementInstance} from "../../instances/instance";

/**
 * Sets the element type of column. If there was an element before it is cached
 * inside to allow the action to be undoable.
 *
 * This is an undo/redouble action.
 */
export class SetElement
    implements IUndoRedoAction {
    private oldElement: EditorElementInstance<any> | undefined;
    private newElement: EditorElementInstance<any> | undefined;

    constructor(
        private column: Column,
        private element: EditorElementInstance<any>,
    ) {
    }

    async undo() {
        if (!this.oldElement) {
            // @ts-ignore
            this.column.element = undefined;
            return;
        }

        this.column.element = this.oldElement;
    }

    async redo() {
        if (!this.column.element) {
            this.oldElement = undefined;
            this.column.element = this.element;
            return;
        }

        if (this.column.element) {
            this.oldElement = this.column.element;
        }

        if (this.newElement) {
            this.column.element = this.newElement;
            return;
        }

        this.column.element = this.element;
        this.newElement = this.element;
    }
}
