import {defineStore} from 'pinia';
import {type Ref, ref} from 'vue';
import type {ISaveGridFn} from "~/stores/ISaveGrid";

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

/**
 * Groups multiple actions into one. Calling undo/redo on this
 * action will execute the corresponding function in each contained
 * action.
 *
 * This class is useful if you need to do multiple actions at the same time
 * but don't want the single actions be added to the undo / redo stack
 * (instead the group action is added).
 */
export class GroupedUndoRedoAction implements IUndoRedoAction {
    constructor(private actions: IUndoRedoAction[]) {
    }

    async undo(persist: ISaveGridFn) {
        for (const action of this.actions) {
            await action.undo(persist);
        }
    }

    async redo(persist: ISaveGridFn) {
        for (const action of this.actions) {
            await action.redo(persist);
        }
    }
}

export const useUndoRedoStore = (persist: ISaveGridFn) => defineStore('undoRedo', () => {
    const _undoStack: Ref<IUndoRedoAction[]> = ref([]);
    const _redoStack: Ref<IUndoRedoAction[]> = ref([]);

    /**
     * Has unduable actions.
     * @returns True if it has unduable actions, false otherwise.
     */
    function hasUnduable(): boolean {
        return _undoStack.value.length > 0;
    }

    /**
     * Has redoable actions.
     * @returns True if it has redoable actions, false otherwise.
     */
    function hasReduable(): boolean {
        return _redoStack.value.length > 0;
    }

    /**
     * Executes the given action and stores it on the stack so that is unduable in the future.
     * @param action - The action to be executed and stored.
     */
    async function execute(action: IUndoRedoAction) {
        await action.redo(persist);
        _redoStack.value = [];
        _undoStack.value.push(action);
    }

    /**
     * Retrieves the top action on the redo stack, executes its redo function and stores it on the undo stack.
     * Does nothing if no action is found that is redoable.
     */
    async function redo() {
        const action = _redoStack.value.pop();
        if (!action) {
            return;
        }

        await action?.redo(persist);

        _undoStack.value.push(action);
    }

    /**
     * Retrieves the top action on the undo stack, executes its undo function and stores it on the redo stack.
     * Does nothing if no action is found that is unduable.
     */
    async function undo() {
        const action: IUndoRedoAction | undefined = _undoStack.value.pop();
        if (!action) {
            return;
        }

        await action.undo(persist);
        _redoStack.value.push(action);
    }

    return {
        hasUnduable,
        hasReduable,
        execute,
        undo,
        redo,
    };
});
