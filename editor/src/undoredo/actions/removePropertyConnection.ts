import type {IUndoRedoAction} from "../";
import type {EditorElementInstance} from "../../instances/instance";
import {AddPropertyConnection} from "./addPropertyConnection";

/**
 * Removes a connection between two elements based on a property with the same key and type in both elements.
 *
 * ⚠️ It does not check for loops and therefore might cause infinite loops. Always make sure before calling it.
 */
export class RemovePropertyConnection
    implements IUndoRedoAction {

    private _action: AddPropertyConnection;

    constructor(
        _provider: EditorElementInstance,
        _consumer: EditorElementInstance,
        _property: string
    ) {
        this._action = new AddPropertyConnection(_provider, _consumer, _property);
    }

    async undo() {
        await this._action.redo();
    }

    async redo() {
        await this._action.undo();
    }
}
