import {type Grid} from '~/models/Grid';
import {type UndoRedoAction} from '../undoredo';

export class MoveRow
    implements UndoRedoAction {
    constructor(
        private oldRowIndex: number,
        private newRowIndex: number,
        private grid: Grid,
    ) {
    }

    async undo() {
        const tempRow = this.grid.rows[this.oldRowIndex];
        this.grid.rows[this.oldRowIndex] = this.grid.rows[this.newRowIndex];
        this.grid.rows[this.newRowIndex] = tempRow;
    }

    async redo() {
        const tempRow = this.grid.rows[this.newRowIndex];
        this.grid.rows[this.newRowIndex] = this.grid.rows[this.oldRowIndex];
        this.grid.rows[this.oldRowIndex] = tempRow;
    }
}
