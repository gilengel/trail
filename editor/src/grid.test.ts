import {describe, expect, it} from 'vitest';
import {createDefaultGrid} from "./grid";

describe('Grid', () => {
    it('creates a default grid with 3 rows (1. with 2 columns, 2. with 3 columns, 3. with 2 columns)', async () => {
        const grid = createDefaultGrid(0);

        expect(grid.rows.length).toBe(3);
        expect(grid.rows[0]!.columns.length).toBe(2);
        expect(grid.rows[1]!.columns.length).toBe(3);
        expect(grid.rows[2]!.columns.length).toBe(2);
    });
});
