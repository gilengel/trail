import {type AttributeType, Element} from '~/types/grid';

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
    implements UndoRedoAction {
    private oldValue: AttributeType;

    constructor(
        private element: Element<Properties, ProvidedProperties, ConsumedProperties>,
        private attribute: Property,
        private value: Properties[Property],
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
