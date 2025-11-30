import type {ISaveGridFn} from "../editorConfiguration";

/**
 * Interface for arbitrary action that modify the underlying data model.
 */
export interface IUndoRedoAction {
    /**
     * Calling this function shall undo an already executed action. Normally you wouldn't call it directly
     * but via the editor.
     *
     * @param persist function that will persist the changed grid after undoing the action.
     */
    undo(persist: ISaveGridFn): Promise<void>;

    /**
     * Calling this function will execute an action.
     *
     * @param persist function that will persist the changed grid in the backend.
     */
    redo(persist: ISaveGridFn): Promise<void>;
}
