import type {IUndoRedoAction} from "./index";

export interface IUndoRedoHandler {

    /**
     * Has unduable actions.
     * @returns True if it has unduable actions, false otherwise.
     */
    hasUnduable(): boolean,

    /**
     * Has redoable actions.
     * @returns True if it has redoable actions, false otherwise.
     */
    hasReduable(): boolean,

    /**
     * Executes the given action and stores it on the stack so that is unduable in the future.
     * @param action - The action to be executed and stored.
     */
    execute(action: IUndoRedoAction): Promise<void>,

    /**
     * Retrieves the top action on the redo stack, executes its redo function and stores it on the undo stack.
     * Does nothing if no action is found that is redoable.
     */
    redo(): Promise<void>,

    /**
     * Retrieves the top action on the undo stack, executes its undo function and stores it on the redo stack.
     * Does nothing if no action is found that is unduable.
     */
    undo(): Promise<void>,
}
