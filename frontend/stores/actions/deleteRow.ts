import {type Grid, type Row} from '~/models/Grid';
import {type UndoRedoAction} from '../undoredo';

/**
 * Deletes a row to the grid. This is an undo/redoable action
 */
export class DeleteRow
    implements UndoRedoAction {
    private readonly rowIndex: number;

    constructor(
        private row: Row,
        private grid: Grid,
    ) {
        this.rowIndex = this.grid.rows.indexOf(this.row);
    }

    async undo() {
        this.grid.rows.splice(this.rowIndex, 0, this.row);
    }

    async redo() {
        this.grid.rows.splice(this.rowIndex, 1);
    }
}
