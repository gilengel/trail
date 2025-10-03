import {expect, describe, it} from 'vitest';
import {createTestGrid} from './test.helper';
import {DeleteRow} from "./deleteRow";


describe('deleteRow', () => {
    const mockSave = () => {
        return Promise.resolve()
    };

    it('should delete a row on redo on the grid', async () => {
        const grid = createTestGrid(3);
        const row = grid.rows[0]!;
        const deleteRow = new DeleteRow(row, grid);

        expect(grid.rows.length).toBe(3);
        await deleteRow.redo(mockSave);
        expect(grid.rows.length).toBe(2);
    });

    it('should remove the row from the grid on undo', async () => {
        const grid = createTestGrid(3);
        const row = grid.rows[0]!;
        const deleteRow = new DeleteRow(row, grid);
        await deleteRow.redo(mockSave);

        expect(grid.rows.length).toBe(2);
        await deleteRow.undo(mockSave);
        expect(grid.rows.length).toBe(3);
    });
});
