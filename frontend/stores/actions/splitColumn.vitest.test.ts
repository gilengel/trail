import {type Row} from '~/types/grid';
import {expect, describe, it} from 'vitest';
import {SplitColumn} from './splitColumn';
import {createTestGrid} from "~/stores/actions/test.helper";
const grid = createTestGrid();

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

describe('splitColumn', () => {
    it('should split a column in two on redo', async () => {
        const row = createTestRow();
        const splitColumn = new SplitColumn(row, grid, 0);
        await splitColumn.redo();

        expect(row.columns.length).toBe(3);
    });

    it('should remove the added column on undo', async () => {
        const row = createTestRow();
        const splitColumn = new SplitColumn(row, grid, 0);
        await splitColumn.redo();

        expect(row.columns.length).toBe(3);
        await splitColumn.undo();
        expect(row.columns.length).toBe(2);
    });
});
