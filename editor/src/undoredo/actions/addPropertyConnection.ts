import type {IUndoRedoAction} from "../";
import type {EditorElementInstance} from "../../instances/instance";

/**
 * Adds a connection between two elements based on a property with the same key and type in both elements.
 *
 * ⚠️ It does not check for loops and therefore might cause infinite loops. Always make sure before calling it.
 */
export class AddPropertyConnection
    implements IUndoRedoAction {

    _providerBackup: string | undefined;
    _consumerBackup: string | undefined;

    constructor(
        private _provider: EditorElementInstance,
        private _consumer: EditorElementInstance,
        private _property: string
    ) {
        this._providerBackup = this._provider.connections.consumed.properties[this._property];
        this._consumerBackup = this._consumer.connections.provided.properties[this._property];
    }

    async undo() {
        this._provider.connections.consumed.properties[this._property] = this._providerBackup;
        this._consumer.connections.provided.properties[this._property] = this._consumerBackup;
    }

    async redo() {
        this._provider.connections.consumed.properties[this._property] = this._consumer.instanceId;
        this._consumer.connections.provided.properties[this._property] = this._provider.instanceId;
    }
}
