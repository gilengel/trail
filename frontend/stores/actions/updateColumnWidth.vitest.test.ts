import { UpdateColumnWidth } from './updateColumnWidth';
import { expect, describe, it } from 'vitest';

describe('updateColumnWidth', () => {
  it('should set the columns width on redo', async () => {
    const column = {
      id: '0',
      width: 6,
    };
    const splitColumn = new UpdateColumnWidth(column, 12);
    await splitColumn.redo();

    expect(column.width).toBe(12);
  });

  it('should set the columns with to its original value on undo', async () => {
    const column = {
      id: '0',
      width: 6,
    };
    const splitColumn = new UpdateColumnWidth(column, 12);
    await splitColumn.redo();

    expect(column.width).toBe(12);
    await splitColumn.undo();
    expect(column.width).toBe(6);
  });
});
