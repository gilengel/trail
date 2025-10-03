import {type Row} from '../../grid';
import {expect, describe, it} from 'vitest';
import {AddRow} from './addRow';
import {createTestGrid} from './test.helper';

const row: Row = {
    id: '',
    columns: [],
};

describe('addRow', () => {
    const mockSaveFn = () => {
        return Promise.resolve();
    }

    it('should add a row to the grid on redo', async () => {
        const grid = createTestGrid();
        const addRow = new AddRow(row, grid);
        await addRow.redo(mockSaveFn);

        expect(grid.rows.length).toBe(2);
    });

    it('should remove the row from the grid on undo', async () => {
        const grid = createTestGrid();

        const addRow = new AddRow(row, grid);
        await addRow.redo(mockSaveFn);

        expect(grid.rows.length).toBe(2);

        await addRow.undo(mockSaveFn);
        expect(grid.rows.length).toBe(1);
    });
});
