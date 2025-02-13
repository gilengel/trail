import {setActivePinia, createPinia} from 'pinia';
import {describe, it, beforeEach, expect, vi} from 'vitest';
import {useUndoRedoStore, GroupedUndoRedoAction, type UndoRedoAction} from '@/stores/undoredo';

describe('UndoRedo', () => {
    let store: ReturnType<typeof useUndoRedoStore>;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useUndoRedoStore();
    });

    it('initially has no undoable or redoable actions', () => {
        expect(store.hasUnduable()).toBe(false);
        expect(store.hasReduable()).toBe(false);
    });

    it('executes an action and adds it to the undo stack', async () => {
        const mockAction: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await store.execute(mockAction);

        expect(mockAction.redo).toHaveBeenCalled();
        expect(store.hasUnduable()).toBe(true);
        expect(store.hasReduable()).toBe(false);
    });

    it('undoes an action and moves it to the redo stack', async () => {
        const mockAction: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await store.execute(mockAction);
        await store.undo();

        expect(mockAction.undo).toHaveBeenCalled();
        expect(store.hasUnduable()).toBe(false);
        expect(store.hasReduable()).toBe(true);
    });

    it('redoes an action and moves it back to the undo stack', async () => {
        const mockAction: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await store.execute(mockAction);
        await store.undo();
        await store.redo();

        expect(mockAction.redo).toHaveBeenCalledTimes(2);
        expect(store.hasUnduable()).toBe(true);
        expect(store.hasReduable()).toBe(false);
    });

    it('does nothing if redo is called with no redoable actions', async () => {
        await store.redo(); // No action in redo stack

        expect(store.hasUnduable()).toBe(false);
        expect(store.hasReduable()).toBe(false);
    });

    it('does nothing if undo is called with no undoable actions', async () => {
        await store.undo(); // No action in undo stack

        expect(store.hasUnduable()).toBe(false);
        expect(store.hasReduable()).toBe(false);
    });

    it('clears the redo stack when executing a new action', async () => {
        const mockAction1: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const mockAction2: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        await store.execute(mockAction1);
        await store.undo(); // Moves to redo stack
        await store.execute(mockAction2); // Clears redo stack

        expect(store.hasUnduable()).toBe(true);
        expect(store.hasReduable()).toBe(false);
    });
});

describe('GroupedUndoRedoAction', () => {
    it('undoes all actions in the correct order', async () => {
        const action1: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const action2: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const groupedAction = new GroupedUndoRedoAction([action1, action2]);

        await groupedAction.undo();

        expect(action1.undo).toHaveBeenCalled();
        expect(action2.undo).toHaveBeenCalled();
    });

    it('redoes all actions in the correct order', async () => {
        const action1: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const action2: UndoRedoAction = {
            redo: vi.fn().mockResolvedValue(undefined),
            undo: vi.fn().mockResolvedValue(undefined),
        };

        const groupedAction = new GroupedUndoRedoAction([action1, action2]);

        await groupedAction.redo();

        expect(action1.redo).toHaveBeenCalled();
        expect(action2.redo).toHaveBeenCalled();
    });
});
