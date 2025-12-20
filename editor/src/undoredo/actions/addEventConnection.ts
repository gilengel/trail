import type {IUndoRedoAction} from "../";
import type {EditorElementInstance} from "../../instances/instance";

/**
 * Adds a connection between two elements based on an event with the same signature arguments
 */
export class AddEventConnection
    implements IUndoRedoAction {

    constructor(
        private _provider: EditorElementInstance,
        private _consumer: EditorElementInstance,
        private _eventKey: string
    ) {
    }

    async undo() {
        console.error("TODO: implement AddEventConnection:undo");
    }

    async redo() {
        const listeners = this._provider.connections.provided.events.listeners;

        if (!(this._eventKey in listeners)) {
            listeners[this._eventKey] = [this._consumer.instanceId]
            return;
        }

        if (listeners[this._eventKey]!.includes(this._consumer.instanceId)) {
            return;
        }

        listeners[this._eventKey]!.push(this._consumer.instanceId)
    }
}
