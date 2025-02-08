import {type Column, type Grid} from '~/types/grid';

export const createTestGrid = (numRows: number = 1, numCols: number = 0): Grid => {
    const grid: Grid = {
        id: '',
        rows: []
    };

    for (let i = 0; i < numRows; i++) {
        const columns: Column[] = [];
        for (let j = 0; j < numCols; j++) {
            columns.push({
                id: `${j}`,
                width: 0
            });
        }
        grid.rows.push({
            id: '',
            columns: columns,
        });
    }
    return grid;
};
