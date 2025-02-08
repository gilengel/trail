import {type Row} from '~/types/grid';
import {expect, describe, it} from 'vitest';
import {AddRow} from './addRow';
import {createTestGrid} from './test.helper';

const row: Row = {
    id: '',
    columns: [],
};

describe('addRow', () => {
    it('should add a row to the grid on redo', async () => {
        const grid = createTestGrid();
        const addRow = new AddRow(row, grid);
        await addRow.redo();

        expect(grid.rows.length).toBe(2);
    });

    it('should remove the row from the grid on undo', async () => {
        const grid = createTestGrid();

        const addRow = new AddRow(row, grid);
        await addRow.redo();

        expect(grid.rows.length).toBe(2);

        await addRow.undo();
        expect(grid.rows.length).toBe(1);
    });
});
