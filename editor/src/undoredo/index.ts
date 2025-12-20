import {type Ref, ref} from 'vue';
import type {ISaveGridFn} from "../editorConfiguration";
import type {IUndoRedoHandler} from "./iundoRedoHandler";
import type {IUndoRedoAction} from "./iaction"

export type {IUndoRedoHandler} from "./iundoRedoHandler";
export type {IUndoRedoAction} from "./iaction";


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


export class UndoRedoHandler implements IUndoRedoHandler {
    private _undoStack: Ref<IUndoRedoAction[]> = ref([]);
    private _redoStack: Ref<IUndoRedoAction[]> = ref([]);

    constructor(private _persist: ISaveGridFn) {
    }

    public hasUnduable(): boolean {
        return this._undoStack.value.length > 0;
    }

    public hasReduable(): boolean {
        return this._redoStack.value.length > 0;
    }

    public async execute(action: IUndoRedoAction) {
        await action.redo(this._persist);
        this._redoStack.value = [];
        this._undoStack.value.push(action);
    }

    public async redo() {
        const action = this._redoStack.value.pop();
        if (!action) {
            return;
        }

        await action?.redo(this._persist);

        this._undoStack.value.push(action);
    }

    public async undo() {
        const action: IUndoRedoAction | undefined = this._undoStack.value.pop();
        if (!action) {
            return;
        }

        await action.undo(this._persist);
        this._redoStack.value.push(action);
    }
}
