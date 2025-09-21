import {describe, it, beforeEach, expect, vi} from 'vitest';
import {GroupedUndoRedoAction, type IUndoRedoAction, UndoRedoHandler} from "~/stores/editor/undoredo";

const mockSave = () => {
    return Promise.resolve()
};

describe('UndoRedo', () => {
    let undoRedoHandler: UndoRedoHandler;

    beforeEach(() => {
        undoRedoHandler = new UndoRedoHandler(mockSave);
    });

    it('initially has no undoable or redoable actions', () => {

        expect(undoRedoHandler.hasUnduable()).toBe(false);
        expect(undoRedoHandler.hasReduable()).toBe(false);
    });

    it('executes an action and adds it to the undo stack', async () => {
        const mockAction: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await undoRedoHandler.execute(mockAction);

        expect(mockAction.redo).toHaveBeenCalled();
        expect(undoRedoHandler.hasUnduable()).toBe(true);
        expect(undoRedoHandler.hasReduable()).toBe(false);
    });

    it('undoes an action and moves it to the redo stack', async () => {
        const mockAction: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await undoRedoHandler.execute(mockAction);
        await undoRedoHandler.undo();

        expect(mockAction.undo).toHaveBeenCalled();
        expect(undoRedoHandler.hasUnduable()).toBe(false);
        expect(undoRedoHandler.hasReduable()).toBe(true);
    });

    it('redoes an action and moves it back to the undo stack', async () => {
        const mockAction: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await undoRedoHandler.execute(mockAction);
        await undoRedoHandler.undo();
        await undoRedoHandler.redo();

        expect(mockAction.redo).toHaveBeenCalledTimes(2);
        expect(undoRedoHandler.hasUnduable()).toBe(true);
        expect(undoRedoHandler.hasReduable()).toBe(false);
    });

    it('does nothing if redo is called with no redoable actions', async () => {
        await undoRedoHandler.redo(); // No action in redo stack

        expect(undoRedoHandler.hasUnduable()).toBe(false);
        expect(undoRedoHandler.hasReduable()).toBe(false);
    });

    it('does nothing if undo is called with no undoable actions', async () => {
        await undoRedoHandler.undo(); // No action in undo stack

        expect(undoRedoHandler.hasUnduable()).toBe(false);
        expect(undoRedoHandler.hasReduable()).toBe(false);
    });

    it('clears the redo stack when executing a new action', async () => {
        const mockAction1: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const mockAction2: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await undoRedoHandler.execute(mockAction1);
        await undoRedoHandler.undo(); // Moves to redo stack
        await undoRedoHandler.execute(mockAction2); // Clears redo stack

        expect(undoRedoHandler.hasUnduable()).toBe(true);
        expect(undoRedoHandler.hasReduable()).toBe(false);
    });
});

describe('GroupedUndoRedoAction', () => {
    it('undoes all actions in the correct order', async () => {
        const action1: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const action2: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const groupedAction = new GroupedUndoRedoAction([action1, action2]);

        await groupedAction.undo(mockSave);

        expect(action1.undo).toHaveBeenCalled();
        expect(action2.undo).toHaveBeenCalled();
    });

    it('redoes all actions in the correct order', async () => {
        const action1: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const action2: IUndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const groupedAction = new GroupedUndoRedoAction([action1, action2]);

        await groupedAction.redo(mockSave);

        expect(action1.redo).toHaveBeenCalled();
        expect(action2.redo).toHaveBeenCalled();
    });
});
