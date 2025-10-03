import {MoveRow} from './moveRow';
import {expect, describe, it} from 'vitest';
import {type Grid} from '../../grid';

const createTestGrid = (): Grid => {
    return {
        tripId: 0,
        rows: [
            {
                id: '0',
                columns: [],
            },
            {id: '1', columns: []},
        ],
    };
};

describe('moveRow', () => {
    const mockSaveFn = () => {
        return Promise.resolve();
    }

    it('should delete a column on redo on the grid', async () => {
        const grid = createTestGrid();
        const moveRow = new MoveRow(0, 1, grid);
        await moveRow.redo(mockSaveFn);

        expect(grid.rows[0]!.id).toBe('1');
        expect(grid.rows[1]!.id).toBe('0');
    });

    it('should delete a column on redo on the grid', async () => {
        const grid = createTestGrid();
        const moveRow = new MoveRow(0, 1, grid,);
        await moveRow.redo(mockSaveFn);

        expect(grid.rows[0]!.id).toBe('1');
        expect(grid.rows[1]!.id).toBe('0');

        await moveRow.undo(mockSaveFn);

        expect(grid.rows[0]!.id).toBe('0');
        expect(grid.rows[1]!.id).toBe('1');
    });
});
