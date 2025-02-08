import {setActivePinia, createPinia} from 'pinia';
import {describe, it, beforeEach, expect, vi} from 'vitest';
import {useGridModuleStore} from '@/stores/gridModule';
import {type Column, Element} from '~/types/grid';
import {AddRow} from '@/stores/actions/addRow';
import {DeleteRow} from '@/stores/actions/deleteRow';
import {DeleteColumn} from '@/stores/actions/deleteColumn';
import {SplitColumn} from '@/stores/actions/splitColumn';
import {MoveRow} from '@/stores/actions/moveRow';
import {SetElement} from '@/stores/actions/setElement';
import {UpdateElementAttribute} from '@/stores/actions/updateElementAttribute';
import {createTestGrid} from "~/stores/actions/test.helper";

vi.mock('@/stores/undoRedo', () => {
    return {
        useUndoRedoStore: vi.fn(() => ({
            execute: vi.fn(), // Mock `execute`
            undo: vi.fn(),
            redo: vi.fn(),
            hasUnduable: vi.fn(() => false),
            hasReduable: vi.fn(() => false),
        })),
        GroupedUndoRedoAction: vi.fn(),
    };
});

describe('GridModuleStore', () => {
    let store: ReturnType<typeof useGridModuleStore>;
    let undoRedoStoreMock: ReturnType<typeof useUndoRedoStore>;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useGridModuleStore();
        undoRedoStoreMock = useUndoRedoStore();

        undoRedoStoreMock.execute = vi.fn();
    });

    it('calls execute with AddRow when adding a row', async () => {
        const grid = createTestGrid(2, 2);

        await store.addRow(grid.rows[0], grid);

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(new AddRow(grid.rows[0], grid));
    });

    it('calls execute with DeleteRow when deleting a row', async () => {
        const grid = createTestGrid(2, 2);

        await store.deleteRow(0, grid);

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(new DeleteRow(grid.rows[0], grid));
    });

    it('calls execute with DeleteColumn when deleting a column', async () => {
        const grid = createTestGrid(2, 2);

        await store.deleteColumn(0, 0, grid);

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(new DeleteColumn(grid.rows[0], 0));
    });

    it('calls execute with SplitColumn when splitting a column', async () => {
        const grid = createTestGrid(2, 2);

        await store.splitColumn(0, 0, grid);

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(new SplitColumn(grid.rows[0], 0));
    });

    it('calls execute with MoveRow when moving a row', async () => {
        const grid = createTestGrid(2, 2);

        await store.moveRow(0, 1, grid);

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(new MoveRow(0, 1, grid));
    });

    it('calls execute with SetElement when setting a column element', async () => {
        const column = {} as Column;
        const element = {} as Element;

        await store.setColumnElement(column, element);

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(new SetElement(column, element));
    });

    it('calls execute with UpdateElementAttribute when updating an element attribute', async () => {
        const element = {} as Element;

        await store.updateElementAttribute(element, 'testAttribute', 'newValue');

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(new UpdateElementAttribute(element, 'testAttribute', 'newValue'));
    });

    it('calls execute with GroupedUndoRedoAction when updating column widths', async () => {
        const left = {column: {} as Column, width: 50};
        const right = {column: {} as Column, width: 50};

        await store.updateColumnsWidth(left, right);

        expect(undoRedoStoreMock.execute).toHaveBeenCalledWith(expect.any(GroupedUndoRedoAction));
    });
});
