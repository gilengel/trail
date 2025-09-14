import {type Row} from '../../types/grid';
import {expect, describe, it} from 'vitest';
import {SplitColumn} from './splitColumn';
import {createTestGrid} from "../../stores/actions/test.helper";

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
  const mockSaveFn = () => {
    return Promise.resolve(true)
  };

  it('should split a column in two on redo', async () => {
    const row = createTestRow();
    const splitColumn = new SplitColumn(row, 0, grid);
    await splitColumn.redo(mockSaveFn);

    expect(row.columns.length).toBe(3);
  });

  it('should remove the added column on undo', async () => {
    const row = createTestRow();
    const splitColumn = new SplitColumn(row, 0, grid);
    await splitColumn.redo(mockSaveFn);

    expect(row.columns.length).toBe(3);
    await splitColumn.undo(mockSaveFn);
    expect(row.columns.length).toBe(2);
  });
});
