import {defineStore} from 'pinia';
import {type Ref, ref} from 'vue';

export interface UndoRedoAction {
    undo(): Promise<void>;

    redo(): Promise<void>;
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
export class GroupedUndoRedoAction implements UndoRedoAction {
    constructor(private actions: UndoRedoAction[]) {
    }

    async undo() {
        for (const action of this.actions) {
            await action.undo();
        }
    }

    async redo() {
        for (const action of this.actions) {
            await action.redo();
        }
    }
}

export const useUndoRedoStore = defineStore('undoRedo', () => {
    const _undoStack: Ref<UndoRedoAction[]> = ref([]);
    const _redoStack: Ref<UndoRedoAction[]> = ref([]);

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
    async function execute(action: UndoRedoAction) {
        await action.redo();
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

        await action?.redo();

        _undoStack.value.push(action);
    }

    /**
     * Retrieves the top action on the undo stack, executes its undo function and stores it on the redo stack.
     * Does nothing if no action is found that is unduable.
     */
    async function undo() {
        const action: UndoRedoAction | undefined = _undoStack.value.pop();
        if (!action) {
            return;
        }

        await action.undo();
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
