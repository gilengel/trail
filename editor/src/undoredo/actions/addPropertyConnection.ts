import type {IUndoRedoAction} from "../";
import type {EditorElementInstance} from "../../instances/instance";

export function splice<T>(array: T[], element: T) {
    const index = array.indexOf(element);

    if (index == -1) {
        return array;
    }

    array.splice(index, 1);
    return array;
}


/**
 * Adds a connection between two elements based on a property with the same key and type in both elements.
 *
 * ⚠️ It does not check for loops and therefore might cause infinite loops. Always make sure before calling it.
 */
export class AddPropertyConnection
    implements IUndoRedoAction {

    constructor(
        private _provider: EditorElementInstance,
        private _consumer: EditorElementInstance,
        private _property: string
    ) {

    }

    async undo() {
        splice(this._provider.connections.consumed.properties[this._property]!, this._consumer.instanceId);
        splice(this._provider.connections.provided.properties[this._property]!, this._provider.instanceId);

        if (this._provider.connections.consumed.properties[this._property]!.length == 0) {
            delete this._provider.connections.consumed.properties[this._property];
        }

        if (this._provider.connections.provided.properties[this._property]!.length == 0) {
            delete this._provider.connections.provided.properties[this._property];
        }
    }

    async redo() {
        if (!(this._property in this._provider.connections.consumed.properties)) {
            this._provider.connections.consumed.properties[this._property] = []
        }

        if (!(this._property in this._consumer.connections.provided.properties)) {
            this._consumer.connections.provided.properties[this._property] = []
        }

        this._provider.connections.consumed.properties[this._property]!.push(this._consumer.instanceId);
        this._provider.connections.provided.properties[this._property]!.push(this._provider.instanceId);

    }
}
