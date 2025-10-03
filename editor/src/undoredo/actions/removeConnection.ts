import type {IUndoRedoAction} from "../";
import type {EditorElementInstance} from "../../editorElementInstanceRegistry";

/**
 * Removes a connection between two elements based on a property with the same key and type in both elements.
 *
 * ⚠️ It does not check for loops and therefore might cause infinite loops. Always make sure before calling it.
 */
export class RemoveConnection
    implements IUndoRedoAction {

    _providerBackup: string | undefined;
    _consumerBackup: string | undefined;

    constructor(
        private _provider: EditorElementInstance,
        private _consumer: EditorElementInstance,
        private _property: string
    ) {
        this._providerBackup = this._provider.connections.consumed[this._property];
        this._consumerBackup = this._consumer.connections.provided[this._property];
    }

    async undo() {
        this._provider.connections.consumed[this._property] = this._providerBackup;
        this._consumer.connections.provided[this._property] = this._consumerBackup;
    }

    async redo() {
        this._provider.connections.consumed[this._property] = undefined;
        this._consumer.connections.provided[this._property] = undefined;
    }
}
