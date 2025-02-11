import {type AttributeType, Element} from '~/types/grid';

/**
 * Updates an attribute of the element. This is an undoable/redoable action.
 */
export class UpdateElementAttribute
    implements UndoRedoAction {
    private oldValue: AttributeType;

    constructor(
        private element: Element,
        private attribute: string,
        private value: AttributeType,
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
    }

    async redo() {
        /*
        const attribute = this.getAttribute();

          if (!attribute) {
              return;
          }
          */


        this.element.attributes[this.attribute] = this.value;
    }
}
