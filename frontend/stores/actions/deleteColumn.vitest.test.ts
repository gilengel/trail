import {DeleteColumn} from './deleteColumn';
import {type Row} from '~/types/grid';
import {expect, describe, it} from 'vitest';

const createTestRow = (): Row => {
    return {
        id: '',
        columns: [
            {
                id: '0',
                width: 6,
            },
            {
                id: '1',
                width: 6,
            },
        ],
    };
};

describe('deleteColumn', () => {
    it('should delete a column on redo on the grid', async () => {
        const row = createTestRow();
        const deleteColumn = new DeleteColumn(row, 0);
        await deleteColumn.redo();

        expect(row.columns[0].id).toBe('1');
    });

    it(
        'should set the width of the n-1 column to the max value if ' +
        'the to be deleted column is the last in the row',
        async () => {
            const row = createTestRow();
            const deleteColumn = new DeleteColumn(row, 1);
            await deleteColumn.redo();

            expect(row.columns[0].width).toBe(12);
        },
    );

    it('should add the column on undo to the grid', async () => {
        const row = createTestRow();
        const deleteColumn = new DeleteColumn(row, 0);
        await deleteColumn.redo();

        expect(row.columns[0].id).toBe('1');
        await deleteColumn.undo();

        expect(row.columns[0].id).toBe('0');
        expect(row.columns[1].id).toBe('1');
    });
});
