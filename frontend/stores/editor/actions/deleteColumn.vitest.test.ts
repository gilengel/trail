import {DeleteColumn} from './deleteColumn';

import {expect, describe, it, beforeEach} from 'vitest';
import {createTestGrid} from "~/stores/editor/actions/test.helper";
import type {Grid} from "~/components/GridEditor/grid";


describe('deleteColumn', () => {
    const mockSaveFn = () => {
        return Promise.resolve();
    }

    let grid: Grid;

    beforeEach(() => {
        grid = createTestGrid(1, 2);
    });
    it('should delete a column on redo on the grid', async () => {

        const deleteColumn = new DeleteColumn(grid.rows[0], 0, grid);
        await deleteColumn.redo();

        expect(grid.rows[0].columns[0].id).toBe('1');
    });


    it(
        'should set the width of the n-1 column to the max value if ' +
        'the to be deleted column is the last in the row',
        async () => {
            const deleteColumn = new DeleteColumn(grid.rows[0], 1, grid);
            await deleteColumn.redo();

            expect(grid.rows[0].columns[0].width).toBe(12);
        },
    );

    it('should add the column on undo to the grid', async () => {
        const deleteColumn = new DeleteColumn(grid.rows[0], 0, grid);
        await deleteColumn.redo();

        expect(grid.rows[0].columns[0].id).toBe('1');
        await deleteColumn.undo();

        expect(grid.rows[0].columns[0].id).toBe('0');
        expect(grid.rows[0].columns[1].id).toBe('1');
    });

});
