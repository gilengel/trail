import {Element} from '~/models/Grid';
import {useGridSave} from "~/composables/useGridSave";

/**
 * Updates an attribute of the element. This is an undoable/redoable action.
 */
export class UpdateElementAttribute
    implements UndoRedoAction {
    private oldValue: string | number | boolean | undefined;

    constructor(
        private element: Element,
        private attribute: string,
        private value: string | number | boolean,
    ) {
    }

    private getAttribute() {
        return this.element.attributes[this.attribute];
        // return (Object.keys(this.element.attributes)).find(key => key === this.attribute);
    }

    async undo() {
        /*
        const attribute = this.getAttribute();
          if (!attribute || !this.oldValue) {
              return;
          }
          */

        //this.element.attributes[this.attribute] = this.oldValue;

        await useGridSave(this.grid)
    }

    async redo() {
        /*
        const attribute = this.getAttribute();

          if (!attribute) {
              return;
          }
          */

        this.oldValue = this.element.attributes[this.attribute];
        this.element.attributes[this.attribute] = this.value;

        await useGridSave(this.grid)
    }
}
