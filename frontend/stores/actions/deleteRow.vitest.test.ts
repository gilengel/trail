import {expect, describe, it} from 'vitest';
import {createTestGrid} from './test.helper';
import {DeleteRow} from "~/stores/actions/deleteRow";


describe('deleteRow', () => {
    it('should delete a row on redo on the grid', async () => {
        const grid = createTestGrid(3);
        const row = grid.rows[0];
        const deleteRow = new DeleteRow(row, grid);

        expect(grid.rows.length).toBe(3);
        await deleteRow.redo();
        expect(grid.rows.length).toBe(2);
    });

    it('should remove the row from the grid on undo', async () => {
        const grid = createTestGrid(3);
        const row = grid.rows[0];
        const deleteRow = new DeleteRow(row, grid);
        await deleteRow.redo();

        expect(grid.rows.length).toBe(2);
        await deleteRow.undo();
        expect(grid.rows.length).toBe(3);
    });
});
