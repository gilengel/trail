import {type Grid, type Row} from '~/models/Grid';
import {type UndoRedoAction} from '../undoredo';

/**
 * Adds a row to the grid. This is an undo/redo able action
 */
export class AddRow
    implements UndoRedoAction {
    constructor(
        private row: Row,
        private grid: Grid,
    ) {
    }

    async undo() {
        const rowIndex = this.grid.rows.indexOf(this.row);
        this.grid.rows.splice(rowIndex, 1);
    }

    async redo() {
        this.grid.rows.push(this.row);
    }
}
