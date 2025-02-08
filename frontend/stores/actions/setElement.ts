import {type Column, Element} from '~/types/grid';

/**
 * Sets the element type of column. If there was an element before it is cached
 * inside to allow the action to be undoable.
 *
 * This is an undo/redouble action.
 */
export class SetElement
    implements UndoRedoAction {
    private oldElement: Element | undefined;
    private newElement: Element | undefined;

    constructor(
        private column: Column,
        private element: Element,
    ) {
    }

    async undo() {
        if (!this.oldElement) {
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
